from flask import make_response
from flask_login import login_required

from src.models import Task
from src.resourses.base import BaseResource


class Assignment(BaseResource):

    # @staticmethod
    # def time_left(due_to):
    #     time = (due_to - datetime.utcnow()).total_seconds()
    #     seconds = int(time % 60)
    #     minutes = int((time // 60) % 60)
    #     hours = int((time // 3600) % 24)
    #     days = int(time // 86400)
    #     return f'{days} days {hours} hours {minutes} minutes {seconds} seconds'

    @login_required
    def get(self):
        tasks = Task.get_all()
        color_label = {'Waiting for an assignment': '#00FFD8',
                       'In progress': '#FFD900',
                       'Done': '#32FF00',
                       'Missed the deadline': '#FF0000'}
        return make_response(self.render_template('assignment.html', tasks=tasks, color=color_label))


# {{ color[task.label] }}