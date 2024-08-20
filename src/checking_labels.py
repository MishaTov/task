from datetime import datetime

from apscheduler.schedulers.background import BackgroundScheduler

from src import socketio, app
from src.models import Task, User


color_label = {Task.STATUS_WAITING: '#00FFD8',
               Task.STATUS_PROGRESS: '#FFD900',
               Task.STATUS_DONE: '#32FF00',
               Task.STATUS_FAILED: '#FF0000'}


def change_label(task_uid, label):
    Task.update_task_info(task_uid, label=label)
    socketio.emit(f'change task label {task_uid}',
                  {'task_uid': task_uid,
                   'label': label,
                   'color': color_label[label]},
                  include_self=True)
    socketio.emit(f'change assignment label',
                  {'task_uid': task_uid,
                   'label': label,
                   'color': color_label[label]},
                  include_self=True)


@socketio.on('accept reject event')
def accept_reject_handler(task_uid):
    task = Task.get_task(task_uid, Task.label)
    users = list(map(lambda x: x.username, User.get_task_assigned_users(task.id, User.username)))
    if not users and task.label not in (Task.STATUS_WAITING, Task.STATUS_DONE, Task.STATUS_FAILED):
        label = Task.STATUS_WAITING
        change_label(task_uid, label)
    elif users and task.label not in (Task.STATUS_PROGRESS, Task.STATUS_DONE, Task.STATUS_FAILED):
        label = Task.STATUS_PROGRESS
        change_label(task_uid, label)
    socketio.emit(f'update users list {task_uid}',
                  {'task_uid': task_uid,
                   'users': users},
                  include_self=True)


@socketio.on('missed deadline')
def missed_deadline_handler(task_uid):
    task = Task.get_task(task_uid, Task.deadline, Task.label)
    if datetime.now() >= task.deadline and task.label not in (Task.STATUS_DONE, Task.STATUS_FAILED):
        label = Task.STATUS_FAILED
        change_label(task_uid, label)


@socketio.on('edit task event')
def edit_task_handler(task_uid):
    task = Task.get_task(task_uid, Task.subject, Task.description, Task.deadline, Task.user_limit, Task.files)
    socketio.emit(f'edit task page {task_uid}',
                  {'task_uid': task_uid,
                   'subject': task.subject,
                   'description': task.description,
                   'deadline': task.deadline,
                   'user_limit': task.user_limit,
                   'files': task.files},
                  include_self=True)
    socketio.emit(f'edit assignment page {task_uid}',
                  {'task_uid': task_uid,
                   'subject': task.subject,
                   'deadline': task.deadline},
                  include_self=True)


def check_task_deadlines():
    with app.app_context():
        tasks = Task.get_all(Task.uid)
        for task in tasks:
            missed_deadline_handler(task.uid)


scheduler = BackgroundScheduler()
scheduler.add_job(check_task_deadlines, 'interval', minutes=1/60)
scheduler.start()
