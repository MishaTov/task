from flask import make_response

from src.resourses.base import BaseResource


class Contacts(BaseResource):

    def get(self):
        return make_response(self.render_template('contacts.html'))
