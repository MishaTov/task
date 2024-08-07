# from datetime import datetime
# from time import sleep

from flask import make_response, request, jsonify
from flask_login import login_required
from flask_socketio import emit

from src import socketio
from src.forms.task_form import TaskForm
from src.models import Task, User
from src.resourses.base import BaseResource


class TaskDescription(BaseResource):
    @login_required
    def get(self, task_uid):
        task_form = TaskForm()
        task = Task.get_task(task_uid)
        color_label = {'Waiting for an assignment': '#00FFD8',
                       'In progress': '#FFD900',
                       'Done': '#32FF00',
                       'Missed the deadline': '#FF0000'}
        return make_response(self.render_template('task.html', color=color_label, task=task, task_form=task_form))

    @staticmethod
    def post(**kwargs):
        data = request.get_json()
        task_uid = data.get('task_uid')
        content = data.get('content')
        comment = Task.post_comment(task_uid, content)
        socketio.emit('new comment',
                      {'content': comment.content,
                       'created': comment.created.strftime('%d %b %Y %H:%M'),
                       'author': comment.author},
                      include_self=True)

    @staticmethod
    def patch(task_uid, **fields):
        Task.update_task_info(task_uid, **fields)

    @staticmethod
    def delete(task_uid):
        task = Task.get_task(task_uid, Task.subject)
        for user in task.users:
            user.current_task_number -= 1
            User.update_user_info(user.username, current_task_number=user.current_task_number)
        subject = task.subject
        task.delete()
        return jsonify({'message': f'Task "{subject}" was deleted'})

    # @staticmethod
    # @socketio.on('get_label')
    # def handle_connect(task_uid):
    #     color_label = {'Waiting for an assignment': '#00FFD8',
    #                    'In progress': '#FFD900',
    #                    'Done': '#32FF00',
    #                    'Missed the deadline': '#FF0000'}
    #     task = Task.get_task(task_uid, Task.deadline, Task.label)
    #     while True:
    #         sleep(1)
    #         users = list(map(lambda x: x.username, User.get_task_assigned_users(task.id, User.username)))
    #         label = task.label
    #         if datetime.now() >= task.deadline and task.label not in (Task.STATUS_DONE, Task.STATUS_FAILED):
    #             label = Task.STATUS_FAILED
    #             TaskDescription.patch(task_uid, label=label)
    #         elif not users and task.label not in (Task.STATUS_WAITING, Task.STATUS_DONE, Task.STATUS_FAILED):
    #             label = Task.STATUS_WAITING
    #             TaskDescription.patch(task_uid, label=label)
    #         elif users and task.label not in (Task.STATUS_PROGRESS, Task.STATUS_DONE, Task.STATUS_FAILED):
    #             label = Task.STATUS_PROGRESS
    #             TaskDescription.patch(task_uid, label=label)
    #         emit('label', {'users': users, 'label': task.label, 'color': color_label[label]})


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
