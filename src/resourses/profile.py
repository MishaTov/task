from flask import make_response

from src.models import User
from src.resourses.base import BaseResource


class Profile(BaseResource):

    def get(self, username):
        user = User.get_user(username)
        if not user:
            return make_response('<h1>Page not found</h1>', 404)
        return make_response(self.render_template('profile.html', user=user))
