from flask import Flask
from flask_sqlalchemy import SQLAlchemy

from config import app_secret_key

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mssql+pyodbc://AMMAR\SQLEXPRESS/test_creditSmartAttendance?driver=ODBC+Driver+11+for+SQL+Server'
app.config['SECRET_KEY'] = app_secret_key
db = SQLAlchemy(app)