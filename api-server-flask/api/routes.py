# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present AppSeed.us
"""

from datetime import datetime, timezone, timedelta

from functools import wraps
from inspect import Traceback

from flask import Blueprint,request,jsonify, send_from_directory
from flask_restx import Api, Resource, fields

import jwt

from .models import Education, Experience, Position, Skill, db, Users, JWTTokenBlocklist
from .config import BaseConfig
import requests

rest_api = Api(version="1.0", title="Users API")


"""
    Flask-Restx models for api request and response data
"""

signup_model = rest_api.model('SignUpModel', {"username": fields.String(required=True, min_length=2, max_length=32),
                                              "email": fields.String(required=True, min_length=4, max_length=64),
                                              "password": fields.String(required=True, min_length=4, max_length=16)
                                              })

login_model = rest_api.model('LoginModel', {"email": fields.String(required=True, min_length=4, max_length=64),
                                            "password": fields.String(required=True, min_length=4, max_length=16)
                                            })

user_edit_model = rest_api.model('UserEditModel', {"userID": fields.String(required=True, min_length=1, max_length=32),
                                                   "username": fields.String(required=True, min_length=2, max_length=32),
                                                   "email": fields.String(required=True, min_length=4, max_length=64)
                                                   })


"""
   Helper function for JWT token required
"""

def token_required(f):

    @wraps(f)
    def decorator(*args, **kwargs):

        token = None

        if "authorization" in request.headers:
            token = request.headers["authorization"]

        if not token:
            return {"success": False, "msg": "Valid JWT token is missing"}, 400

        try:
            data = jwt.decode(token, BaseConfig.SECRET_KEY, algorithms=["HS256"])
            current_user = Users.get_by_email(data["email"])

            if not current_user:
                return {"success": False,
                        "msg": "Sorry. Wrong auth token. This user does not exist."}, 400

            token_expired = db.session.query(JWTTokenBlocklist.id).filter_by(jwt_token=token).scalar()

            if token_expired is not None:
                return {"success": False, "msg": "Token revoked."}, 403

            if not current_user.check_jwt_auth_active():
                return {"success": False, "msg": "Token expired."}, 403

        except:
            return {"success": False, "msg": "Token is invalid"}, 401

        return f(current_user, *args, **kwargs)

    return decorator


"""
    Flask-Restx routes
"""
@rest_api.route('/api/users/register')
class Register(Resource):
    """
       Creates a new user by taking 'signup_model' input
    """

    @rest_api.expect(signup_model, validate=True)
    def post(self):

        req_data = request.get_json()

        _username = req_data.get("username")
        _email = req_data.get("email")
        _password = req_data.get("password")

        user_exists = Users.get_by_email(_email)
        if user_exists:
            return {"success": False,
                    "msg": "Email already taken"}, 400

        new_user = Users(username=_username, email=_email)

        new_user.set_password(_password)
        new_user.save()

        return {"success": True,
                "userID": new_user.id,
                "msg": "The user was successfully registered"}, 200


@rest_api.route('/api/users/login')
class Login(Resource):
    """
       Login user by taking 'login_model' input and return JWT token
    """

    @rest_api.expect(login_model, validate=True)
    def post(self):

        req_data = request.get_json()

        _email = req_data.get("email")
        _password = req_data.get("password")

        user_exists = Users.get_by_email(_email)

        if not user_exists:
            return {"success": False,
                    "msg": "This email does not exist."}, 400

        if not user_exists.check_password(_password):
            return {"success": False,
                    "msg": "Wrong credentials."}, 400

        # create access token uwing JWT
        token = jwt.encode({'email': _email, 'exp': datetime.utcnow() + timedelta(minutes=30)}, BaseConfig.SECRET_KEY)

        user_exists.set_jwt_auth_active(True)
        user_exists.save()

        return {"success": True,
                "token": token,
                "user": user_exists.toJSON()}, 200


@rest_api.route('/api/users/edit')
class EditUser(Resource):
    """
       Edits User's username or password or both using 'user_edit_model' input
    """

    @rest_api.expect(user_edit_model)
    @token_required
    def post(self, current_user):

        req_data = request.get_json()

        _new_username = req_data.get("username")
        _new_email = req_data.get("email")

        if _new_username:
            self.update_username(_new_username)

        if _new_email:
            self.update_email(_new_email)

        self.save()

        return {"success": True}, 200


@rest_api.route('/api/users/logout')
class LogoutUser(Resource):
    """
       Logs out User using 'logout_model' input
    """

    @token_required
    def post(self, current_user):

        _jwt_token = request.headers["authorization"]

        jwt_block = JWTTokenBlocklist(jwt_token=_jwt_token, created_at=datetime.now(timezone.utc))
        jwt_block.save()

        self.set_jwt_auth_active(False)
        self.save()

        return {"success": True}, 200


@rest_api.route('/api/sessions/oauth/github/')
class GitHubLogin(Resource):
    def get(self):
        code = request.args.get('code')
        client_id = BaseConfig.GITHUB_CLIENT_ID
        client_secret = BaseConfig.GITHUB_CLIENT_SECRET
        root_url = 'https://github.com/login/oauth/access_token'

        params = { 'client_id': client_id, 'client_secret': client_secret, 'code': code }

        data = requests.post(root_url, params=params, headers={
            'Content-Type': 'application/x-www-form-urlencoded',
        })

        response = data._content.decode('utf-8')
        access_token = response.split('&')[0].split('=')[1]

        user_data = requests.get('https://api.github.com/user', headers={
            "Authorization": "Bearer " + access_token
        }).json()
        
        user_exists = Users.get_by_username(user_data['login'])
        if user_exists:
            user = user_exists
        else:
            try:
                user = Users(username=user_data['login'], email=user_data['email'])
                user.save()
            except:
                user = Users(username=user_data['login'])
                user.save()
        
        user_json = user.toJSON()

        token = jwt.encode({"username": user_json['username'], 'exp': datetime.utcnow() + timedelta(minutes=30)}, BaseConfig.SECRET_KEY)
        user.set_jwt_auth_active(True)
        user.save()

        return {"success": True,
                "user": {
                    "_id": user_json['_id'],
                    "email": user_json['email'],
                    "username": user_json['username'],
                    "token": token,
                }}, 200


@rest_api.route('/api/settings')
class SettingsSaver(Resource):
    @token_required
    def post(self, dumb):

        req_data = request.get_json()

        print("Request JSON received:\n")
        print(request.get_json())

        Experience.query.filter_by(user_id=self.id).delete()  # Delete old experiences
        Education.query.filter_by(user_id=self.id).delete() 
        Skill.query.filter_by(user_id=self.id).delete()
        db.session.commit()  # Commit the deletion


        for exp_data in req_data.get('experiences', []):
            new_exp = Experience(**exp_data, user_id = self.id)
            db.session.add(new_exp)
            self.experiences.append(new_exp)

        for edu_data in req_data.get('educations', []):
            new_edu = Education(**edu_data, user_id = self.id)
            db.session.add(new_edu)
            self.educations.append(new_edu)

        new_skills = Skill(description=req_data.get('skill'), user_id = self.id)
        self.skills.append(new_skills)

        self.save()

        ''' Now update the generator service '''


        response = requests.post(BaseConfig.GENERATOR_API + "/update-user-details", headers={
            "Authorization": f'Bearer {BaseConfig.GENERATOR_AUTH_KEY}' }, json= {
                "userId": self.id,
                "experiences": [experience.to_dict_full() for experience in self.experiences],
                "educations": [education.to_dict_full() for education in self.educations],
                "skill": self.skills[0].to_dict_full() if self.skills else '' 
            })

        print(str(response.status_code) + ": "+ response.text)

        return {"success": True if response.status_code == 200 else False,
                }, response.status_code
    
    @token_required
    def get(self, dumb): 

        user_details = {
            'experiences': [experience.to_dict() for experience in self.experiences],
            'educations': [education.to_dict() for education in self.educations],
            'skill': self.skills[0].description if self.skills else '' 
        }

        return user_details, 200
    
@rest_api.route('/api/positions')
class PositionsSaver(Resource):
    @token_required
    def post(self, dumb):

        req_data = request.get_json()

        new_position = Position(**req_data, user_id = self.id)

        self.positions.append(new_position)

        self.save()

        return {"success": True,
                }, 200
    
    @token_required
    def get(self, dumb): 

        return [position.to_dict() for position in self.positions], 200

@rest_api.route('/api/positions/<int:position_id>') 
class PositionDetail(Resource):
    @token_required
    def get(self, dumb, position_id):  # The method now accepts position_id as a parameter

        # Find the position by ID
        position = next((position for position in self.positions if position.id == position_id), None)

        # If position is found, return its dictionary representation
        if position:
            return position.to_dict(), 200

        # If not found, return an error message
        return {"message": "Position not found"}, 404
    @token_required
    def delete(self, dumb, position_id):
        # Find the position by ID
        position = next((position for position in self.positions if position.id == position_id), None)
        
        if position:
            db.session.delete(position)
            db.session.commit()
            return {'message': 'Position deleted successfully'}, 200
        else:
            return {'message': 'Position not found'}, 404

@rest_api.route('/api/generate-resume/<int:position_id>')
class GenerationHandler(Resource):
    @token_required
    def post(self, dumb, position_id):  # this endpoint is used to generate a resume
        
         # Find the position by ID
        position : Position = next((position for position in self.positions if position.id == position_id), None)
    
        # we initiate the resume generation process
        # client will receive generator response including job id
        # client should poll 
        response = requests.post(BaseConfig.GENERATOR_API + "/generate-resume",
            headers={"Authorization": f'Bearer {BaseConfig.GENERATOR_AUTH_KEY}'},
            json={'userId': self.id,
                  'title': position.title, 'description': position.description})
        
        return response.json(), response.status_code
    
@rest_api.route('/api/generation-status/<int:job_id>')
class GenerationStatus(Resource):
    @token_required
    def get(self, dumb, job_id):
        
        # we act as a pure proxy to generation handler
        response = requests.get(BaseConfig.GENERATOR_API + f"/generation-status/{job_id}",
            headers={"Authorization": f'Bearer {BaseConfig.GENERATOR_AUTH_KEY}'})
        
        return response.json(), response.status_code

@rest_api.route("/api/download-resume/<int:job_id>")
class DownloadResume(Resource):
    @token_required
    def get(self, dumb, job_id):
    
        #this is a temporary solution, we need to save the file to a bucket
        directory = '/tmp'
        return send_from_directory(directory,f'resume{job_id}.docx', as_attachment=True)
    