import re

from flask import render_template
from flask_login import current_user
from flask_restful import Resource


def prepare_title(name):
    words = re.findall(r'[A-Z][a-z]*', name)
    return ' '.join(words).capitalize()


class BaseMeta(type):
    def __new__(mcs, name, bases, class_dict):
        class_dict['title'] = prepare_title(name)
        return super().__new__(mcs, name, bases, class_dict)


class BaseResource(Resource, metaclass=BaseMeta):

    @staticmethod
    def get_menu():
        if getattr(current_user, 'is_authenticated', False):
            return ['Main page', 'Profile', 'Assignment', 'About', 'Contacts', 'Logout']
        else:
            return ['Main page', 'Register', 'Login', 'About', 'Contacts']

    @classmethod
    def render_template(cls, template, **context):
        context['menu'] = cls.get_menu()
        context['title'] = cls.title
        return render_template(template, **context)
