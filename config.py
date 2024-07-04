import pathlib
from os import getenv

from dotenv import load_dotenv
from flask_login import LoginManager as LogMan

BASE_DIR = pathlib.Path(__file__).parent
load_dotenv()


class Config:
    SECRET_KEY = getenv('SECRET_KEY')
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + str(BASE_DIR / 'data' / 'db.sqlite3')
    SQLALCHEMY_TRACK_MODIFICATIONS = False


class LoginManager(LogMan):
    def __init__(self, app=None):
        super().__init__(app)
        self.login_view = 'login'
