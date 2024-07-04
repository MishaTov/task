from flask import make_response

from src.resourses.base import BaseResource


class MainPage(BaseResource):
    title = 'Main page'

    def get(self):
        return make_response(self.render_template('index.html', title=MainPage.title))
