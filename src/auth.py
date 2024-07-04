from flask import render_template, make_response

from src import login_manager
from src.models import User


@login_manager.user_loader
def load_user(username):
    return User.get_user(username)


@login_manager.unauthorized_handler
def unauthorized():
    return make_response(render_template('not_authorized.html'), 401)

