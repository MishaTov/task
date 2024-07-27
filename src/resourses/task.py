from datetime import datetime

from flask import make_response, request, jsonify
from flask_login import login_required

from src import db
from src.forms.task_form import TaskForm
from src.models import Task, User
from src.resourses.base import BaseResource


class TaskDescription(BaseResource):
    @login_required
    def get(self, task_uid):
        form = TaskForm()
        task = Task.get_task(task_uid)
        color_label = {'Waiting for an assignment': '#00FFD8',
                       'In progress': '#FFD900',
                       'Done': '#32FF00',
                       'Missed the deadline': '#FF0000'}
        return make_response(self.render_template('task.html', color=color_label, task=task, form=form))

    @staticmethod
    def patch(task_uid, **fields):
        task = Task.get_task(task_uid)
        for attr, value in fields.items():
            if hasattr(task, attr):
                setattr(task, attr, value)
        db.session.add(task)
        db.session.commit()

    @staticmethod
    def delete(task_uid):
        task = Task.get_task(task_uid, Task.subject)
        for user in task.users:
            user.current_task_number -= 1
            User.update_user_info(user.username, current_task_number=user.current_task_number)
        subject = task.subject
        task.delete()
        return jsonify({'message': f'Task "{subject}" was deleted'})


class AcceptReject(BaseResource):
    @staticmethod
    def post(**kwargs):
        data = request.get_json()
        username = data.get('username')
        task_id = data.get('task_uid')
        result = Task.accept(username, task_id)
        return jsonify(result)

    @staticmethod
    def delete(**kwargs):
        data = request.get_json()
        username = data.get('username')
        task_id = data.get('task_uid')
        result = Task.reject(username, task_id)
        return jsonify(result)
