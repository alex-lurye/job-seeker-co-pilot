from flask import request, jsonify
import os
from functools import wraps

def require_api_key(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_key = request.headers.get('Authorization')
        if auth_key and auth_key == os.getenv('AUTH_KEY'):
            return f(*args, **kwargs)
        else:
            return jsonify({"message": "Authentication failed."}), 401
    return decorated_function