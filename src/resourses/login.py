from datetime import timedelta

import flask
from flask import redirect, url_for, make_response
from flask_login import login_user, current_user

from src.forms.login_form import LoginForm
from src.models import User

from src.resourses.base import BaseResource


class Login(BaseResource):

    def get(self):
        if current_user.is_authenticated:
            return redirect(url_for('profile', username=current_user.username))
        form = LoginForm()
        response = make_response(self.render_template('login.html', form=form))
        return response

    def post(self):
        form = LoginForm()
        if form.validate_on_submit():
            user = User.get_user(form.username.data)
            login_user(user, remember=form.remember.data, duration=timedelta(days=30))
            next_ = flask.request.args.get('next')
            return redirect(next_ or url_for('profile', username=form.username.data))
        return make_response(self.render_template('login.html', form=form))
