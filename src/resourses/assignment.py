from flask import make_response
from flask_login import login_required

from src.models import Task
from src.resourses.base import BaseResource


class Assignment(BaseResource):

    @login_required
    def get(self):
        tasks = Task.get_all(Task.uid, Task.subject, Task.label, Task.deadline)
        color_label = {'Waiting for an assignment': '#00FFD8',
                       'In progress': '#FFD900',
                       'Done': '#32FF00',
                       'Missed the deadline': '#FF0000'}
        return make_response(self.render_template('assignment.html', tasks=tasks, color=color_label))
