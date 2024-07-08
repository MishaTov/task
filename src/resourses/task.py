from flask import make_response, request, jsonify
from flask_login import login_required
from datetime import datetime

from src import db
from src.models import Task, User
from src.resourses.base import BaseResource


class TaskDescription(BaseResource):
    @login_required
    def get(self, task_uid):
        task = Task.get_task(task_uid)
        color_label = {'Waiting for an assignment': '#00FFD8',
                       'In progress': '#FFD900',
                       'Done': '#32FF00',
                       'Missed the deadline': '#FF0000'}
        return make_response(self.render_template('task.html', color=color_label, task=task))

    @staticmethod
    def patch(task_uid, **fields):
        task = Task.get_task(task_uid)
        for attr, value in fields.items():
            if hasattr(task, attr):
                setattr(task, attr, value)
        db.session.add(task)
        db.session.commit()


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


class CheckLabel(BaseResource):
    color_label = {'Waiting for an assignment': '#00FFD8',
                   'In progress': '#FFD900',
                   'Done': '#32FF00',
                   'Missed the deadline': '#FF0000'}

    @staticmethod
    def get(task_uid):
        task = Task.get_task(task_uid, Task.deadline, Task.label)
        users = list(map(lambda x: x.username, User.get_task_assigned_users(task.id, User.username)))
        if datetime.utcnow() >= task.deadline and task.label not in (Task.STATUS_DONE, Task.STATUS_FAILED):
            TaskDescription.patch(task_uid, label=Task.STATUS_FAILED)
        elif not users and task.label not in (Task.STATUS_WAITING, Task.STATUS_DONE, Task.STATUS_FAILED):
            TaskDescription.patch(task_uid, label=Task.STATUS_WAITING)
        elif users and task.label not in (Task.STATUS_PROGRESS, Task.STATUS_DONE, Task.STATUS_FAILED):
            TaskDescription.patch(task_uid, label=Task.STATUS_PROGRESS)
        return jsonify({'users': users,
                        'label': task.label,
                        'color': CheckLabel.color_label[task.label]})
