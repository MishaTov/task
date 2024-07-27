from flask import Flask
from flask_migrate import Migrate
from flask_restful import Api
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy

from config import Config, LoginManager

app = Flask(__name__, template_folder='../templates', static_folder='../static')
app.config.from_object(Config)
db = SQLAlchemy(app)
migrate = Migrate(app, db)
login_manager = LoginManager(app)
api = Api(app)
socketio = SocketIO(app)

from . import routes, auth, checking_labels
