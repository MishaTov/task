from flask import make_response, redirect, url_for, flash

from src import socketio
from src.forms.task_form import TaskForm
from src.models import Task

from src.resourses.base import BaseResource


class CreateTask(BaseResource):

    color_label = {'Waiting for an assignment': '#00FFD8',
                   'In progress': '#FFD900',
                   'Done': '#32FF00',
                   'Missed the deadline': '#FF0000'}

    def get(self):
        form = TaskForm()
        return make_response(self.render_template('create_task.html', form=form))

    def post(self):
        form = TaskForm()
        if form.validate_on_submit():
            new_task = Task.create_task(
                subject=form.subject.data,
                description=form.description.data,
                deadline=form.deadline.data,
                user_limit=form.user_limit.data,
                files=form.files.data
            )
            flash('Successfully created')
            socketio.emit('new task',
                          {'task_uid': new_task.uid,
                           'subject': new_task.subject,
                           'label': new_task.label,
                           'color': CreateTask.color_label[new_task.label],
                           'deadline': str(new_task.deadline)},
                          include_self=True)
            return redirect(url_for('assignment'))
        return make_response(self.render_template('create_task.html', form=form))
