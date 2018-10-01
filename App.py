from flask import Flask
from flask_caching import Cache
from flask_sqlalchemy import SQLAlchemy

from config import app_secret_key, db_connection_string

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = db_connection_string
app.config['SECRET_KEY'] = app_secret_key
cache = Cache(app, config={'CACHE_TYPE': 'simple'})
db = SQLAlchemy(app)