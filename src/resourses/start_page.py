from flask import make_response, render_template

from src.resourses.base import BaseResource


class StartPage(BaseResource):
    title = 'Start page'

    @staticmethod
    def get():
        return make_response(render_template('index.html', title=StartPage.title))
