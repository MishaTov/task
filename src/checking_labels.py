from datetime import datetime

from apscheduler.schedulers.background import BackgroundScheduler
from flask_socketio import emit

from src import socketio
from src.models import Task, User
from src.resourses.task import TaskDescription

color_label = {Task.STATUS_WAITING: '#00FFD8',
               Task.STATUS_PROGRESS: '#FFD900',
               Task.STATUS_DONE: '#32FF00',
               Task.STATUS_FAILED: '#FF0000'}


@socketio.on('accept reject event')
def accept_reject_handler(task_uid):
    task = Task.get_task(task_uid, Task.label)
    users = list(map(lambda x: x.username, User.get_task_assigned_users(task.id, User.username)))
    if not users and task.label not in (Task.STATUS_WAITING, Task.STATUS_DONE, Task.STATUS_FAILED):
        TaskDescription.patch(task_uid, label=Task.STATUS_WAITING)
        emit('label status waiting', broadcast=True)
    elif users and task.label not in (Task.STATUS_PROGRESS, Task.STATUS_DONE, Task.STATUS_FAILED):
        TaskDescription.patch(task_uid, label=Task.STATUS_PROGRESS)
        emit('label status progress', broadcast=True)
    elif users and task.label == Task.STATUS_PROGRESS:
        emit('assigned users list', {'users': users}, broadcast=True)


@socketio.on('missed deadline event')
def missed_deadline_handler(task_uid):
    task = Task.get_task(task_uid, Task.deadline, Task.label)
    if datetime.now() >= task.deadline and task.label not in (Task.STATUS_DONE, Task.STATUS_FAILED):
        TaskDescription.patch(task_uid, label=Task.STATUS_FAILED)
        emit('label status failed', broadcast=True)


@socketio.on('edit task event')
def edit_task_handler(task_uid):
    task = Task.get_task(task_uid, Task.subject, Task.description, Task.deadline, Task.user_limit, Task.files)
    emit('edit task page event',
         {'subject': task.subject,
          'description': task.description,
          'deadline': task.deadline,
          'user limit': task.user_limit,
          'files': task.files},
         broadcast=True)
    emit('edit assignment page event',
         {'subject': task.subject,
          'deadline': task.deadline},
         broadcast=True)


def check_task_deadlines():
    all_task_uid = Task.get_all(Task.uid)
    for task_uid in all_task_uid:
        missed_deadline_handler(task_uid, update_by_user=False)


scheduler = BackgroundScheduler()
scheduler.add_job(check_task_deadlines, 'interval', minutes=10)
scheduler.start()
