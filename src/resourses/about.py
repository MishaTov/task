from flask import make_response

from src.resourses.base import BaseResource


class About(BaseResource):

    def get(self):
        return make_response(self.render_template('about.html'))
