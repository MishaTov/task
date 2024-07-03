from flask import make_response, flash, redirect, url_for
from flask_login import login_user, logout_user

from src.forms.register_form import RegisterForm
from src.models import User

from src.resourses.base import BaseResource


class Register(BaseResource):

    def get(self):
        logout_user()
        form = RegisterForm()
        return make_response(self.render_template('register.html', form=form))

    def post(self):
        form = RegisterForm()
        if form.validate_on_submit():
            new_user = User.add_user(name=form.name.data,
                                     surname=form.surname.data,
                                     username=form.username.data,
                                     password=form.password.data)
            login_user(new_user)
            flash('Successfully registered')
            return redirect(url_for('profile', username=form.username.data))
        return make_response(self.render_template('register.html', form=form))
