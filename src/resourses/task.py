# from datetime import datetime
# from time import sleep

from flask import make_response, request, jsonify
from flask_login import login_required
from flask_socketio import emit

from src import socketio
from src.forms.task_form import TaskForm
from src.models import Task, User, Comment
from src.resourses.base import BaseResource


class TaskDescription(BaseResource):
    @login_required
    def get(self, task_uid):
        task = Task.get_task(task_uid)
        task_form = TaskForm(obj=task)
        color_label = {'Waiting for an assignment': '#00FFD8',
                       'In progress': '#FFD900',
                       'Done': '#32FF00',
                       'Missed the deadline': '#FF0000'}
        return make_response(self.render_template('task.html', color=color_label, task=task, task_form=task_form))

    @staticmethod
    def post(**kwargs):
        data = request.get_json()
        if data.get('type') == 'comment':
            task_uid = data.get('task_uid')
            content = data.get('content')
            comment = Task.post_comment(task_uid, content)
            socketio.emit('new comment',
                          {'comment_uid': comment.uid,
                           'content': comment.content,
                           'created': comment.created.strftime('%d %b %Y %H:%M'),
                           'author': comment.author},
                          include_self=True)

    @staticmethod
    def patch(**kwargs):
        data = request.get_json()
        if data.get('type') == 'task':
            task_uid = data.pop('task_uid')
            task_info = data.get('task_info')
            Task.update_task_info(task_uid, **task_info)
        elif data.get('type') == 'comment':
            comment_uid = data.get('comment_uid')
            content = data.get('content')
            comment = Comment.update_comment(comment_uid, content)
            socketio.emit('update comment',
                          {'comment_uid': comment.uid,
                           'content': comment.content},
                          include_self=True)

    @staticmethod
    def delete(**kwargs):
        data = request.get_json()
        if data.get('type') == 'task':
            task_uid = data.get('task_uid')
            task = Task.get_task(task_uid, Task.subject)
            for user in task.users:
                user.current_task_number -= 1
                User.update_user_info(user.username, current_task_number=user.current_task_number)
            subject = task.subject
            task.delete()
            return jsonify({'message': f'Task "{subject}" was deleted'})
        elif data.get('type') == 'comment':
            comment_uid = data.get('comment_uid')
            Comment.delete_comment(comment_uid)
            socketio.emit('delete comment',
                          {'comment_uid': comment_uid},
                          include_self=True)


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
