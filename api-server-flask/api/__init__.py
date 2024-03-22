# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present AppSeed.us
"""

import os, json

from flask import Flask, request
from flask_cors import CORS, cross_origin

from .routes import rest_api
from .models import db
from .models import Country
import pycountry

app = Flask(__name__)
CORS(app)

app.config.from_object('api.config.BaseConfig')
app.config['PROPAGATE_EXCEPTIONS'] = False

from flask_migrate import Migrate

app.config['DEBUG'] = True
db.init_app(app)
migrate = Migrate(app, db)
rest_api.init_app(app)




def seed_countries():
    Country.query.delete()

    for country in pycountry.countries:
        new_country = Country(
            name=country.name,
            iso_alpha2=country.alpha_2,
            iso_alpha3=country.alpha_3
        )
        db.session.add(new_country)

    db.session.commit()

# Setup database
@app.before_first_request
def initialize_database():
    try:
        db.create_all()
    except Exception as e:

        print('> Error: DBMS Exception: ' + str(e) )

        # fallback to SQLite
        BASE_DIR = os.path.abspath(os.path.dirname(__file__))
        app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(BASE_DIR, 'db.sqlite3')

        print('> Fallback to SQLite ')
        db.create_all()

"""
   Custom responses
"""

@app.after_request
def after_request(response):
    """
       Sends back a custom error with {"success", "msg"} format
    """
    content_type = response.headers.get('Content-Type', '')
    if int(response.status_code) >= 400 and 'application/json' in content_type:
        if response.get_data().strip():
            response_data = json.loads(response.get_data())
            if "errors" in response_data:
                response_data = {"success": False,
                                "msg": list(response_data["errors"].items())[0][1]}
            response.set_data(json.dumps(response_data))
            response.headers.add('Content-Type', 'application/json')
    return response

'''@app.before_request
def log_request_info():
    app.logger.debug('Headers: %s', request.headers)
    app.logger.debug('Body: %s', request.get_data(as_text=True))
    # If you expect JSON and want to log it as a dictionary:
    if request.is_json:
        app.logger.debug('JSON: %s', json.dumps(request.get_json()))
'''

@app.cli.command("seed_db")
def seed_db():
    """Seeds the database with initial data."""
    seed_countries()  # Assuming seed_countries is accessible/imported

if __name__ == '__main__':
    app.run(debug=True)
