from flask import make_response, redirect, url_for, flash

from src.forms.task_form import TaskForm
from src.models import Task

from src.resourses.base import BaseResource


class CreateTask(BaseResource):

    def get(self):
        form = TaskForm()
        return make_response(self.render_template('create_task.html', form=form))

    def post(self):
        form = TaskForm()
        if form.validate_on_submit():
            Task.create_task(
                subject=form.subject.data,
                description=form.description.data,
                deadline=form.deadline.data,
                user_limit=form.user_limit.data,
                files=form.files.data
            )
            flash('Successfully created')
            return redirect(url_for('assignment'))
        return make_response(self.render_template('create_task.html', form=form))
