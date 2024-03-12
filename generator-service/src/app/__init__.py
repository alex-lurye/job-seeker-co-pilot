from flask import Flask
from .views import api_blueprint
import logging

from logging.config import dictConfig

dictConfig({
    'version': 1,
    'formatters': {'default': {
        'format': '[%(asctime)s] %(levelname)s in %(module)s: %(message)s',
    }},
    'handlers': {'file': {
        'class': 'logging.FileHandler',
        'filename': 'app.log',
        'formatter': 'default'
    }},
    'root': {
        'level': 'DEBUG',
        'handlers': ['file']
    }
})

app = Flask(__name__)

app.register_blueprint(api_blueprint, url_prefix='/api')

if __name__ == '__main__':
   app.run(debug=True, port=5001)