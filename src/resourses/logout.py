from flask import redirect, url_for, request
from flask_login import login_required, logout_user

from src.resourses.base import BaseResource


class Logout(BaseResource):
    @staticmethod
    @login_required
    def get():
        logout_user()
        return redirect(url_for('login'))
