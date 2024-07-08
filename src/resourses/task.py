from flask import make_response, request, jsonify
from flask_login import login_required
from datetime import datetime
from src.models import Task
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
        deadline, label, users = Task.get_task(task_uid, Task.deadline, Task.label, Task.users)
        if datetime.utcnow() >= deadline and Task.label not in (Task.STATUS_DONE, Task.STATUS_FAILED):
            TaskDescription.patch(task_uid, label=Task.STATUS_FAILED)
        elif not users and Task.label not in (Task.STATUS_WAITING, Task.STATUS_DONE, Task.STATUS_FAILED):
            TaskDescription.patch(task_uid, label=Task.STATUS_WAITING)
        elif users and Task.label not in (Task.STATUS_PROGRESS, Task.STATUS_DONE, Task.STATUS_FAILED):
            TaskDescription.patch(task_uid, label=Task.STATUS_PROGRESS)
        return jsonify({'users': list(map(lambda x: x.username, users)),
                        'label': label,
                        'color': CheckLabel.color_label[label]})
