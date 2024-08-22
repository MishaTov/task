from datetime import datetime
from uuid import uuid4

from flask_login import current_user
from sqlalchemy import desc
from sqlalchemy.orm import load_only

from src import db
from . import Comment
from .assotiation_tables import user_task
from .file import File
from .user import User


class Task(db.Model):
    __tablename__ = 'tasks'

    STATUS_WAITING = 'Waiting for an assignment'
    STATUS_PROGRESS = 'In progress'
    STATUS_DONE = 'Done'
    STATUS_FAILED = 'Missed the deadline'

    id = db.Column(db.Integer, primary_key=True)
    subject = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text)
    created = db.Column(db.DateTime)
    deadline = db.Column(db.DateTime)
    created_by = db.Column(db.String(20))
    label = db.Column(db.String(30), default='Waiting for an assignment')
    uid = db.Column(db.String(36), unique=True)
    user_limit = db.Column(db.Integer, default=5)
    current_user_number = db.Column(db.Integer, default=0)
    users = db.relationship('User', secondary=user_task, backref='tasks')
    files = db.relationship('File', backref='task', cascade='all, delete, delete-orphan')
    comments = db.relationship('Comment', backref='tasks', cascade='all, delete, delete-orphan')

    def __init__(self, **fields):
        self.subject = fields.get('subject')
        self.description = fields.get('description')
        self.created = datetime.utcnow()
        self.deadline = fields.get('deadline')
        self.created_by = current_user.username
        self.label = fields.get('label')
        self.uid = str(uuid4())
        self.user_limit = fields.get('user_limit')

    @staticmethod
    def get_task(uid, *columns):
        query = db.session.query(Task).filter_by(uid=uid)
        if columns:
            return query.options(load_only(*columns)).first()
        return query.first()

    @staticmethod
    def create_task(subject, description, deadline, user_limit, files):
        new_task = Task(
            subject=subject,
            description=description,
            deadline=deadline,
            user_limit=user_limit
        )
        if files:
            Task.add_files(files, new_task)
        db.session.add(new_task)
        db.session.commit()
        return new_task

    @staticmethod
    def post_comment(task_uid, content):
        task = Task.get_task(task_uid)
        comment = Comment.create_comment(task.id, content)
        task.comments.append(comment)
        db.session.add(task)
        db.session.commit()
        return comment

    @staticmethod
    def add_files(files, task):
        files_ = File.upload(files, task.id)
        for file in files_:
            task.files.append(file)

    @staticmethod
    def get_all(*columns):
        query = db.session.query(Task).order_by(desc(Task.created))
        if columns:
            return query.options(load_only(*columns)).all()
        return query.all()

    @staticmethod
    def accept(username, task_uid):
        user = User.get_user(username, User.task_limit, User.current_task_number)
        task = Task.get_task(task_uid, Task.user_limit, Task.current_user_number)
        if user.current_task_number >= user.task_limit:
            return {'success': False,
                    'message': f'User {username} has the maximum number of tasks allowed'}
        elif task.current_user_number >= task.user_limit:
            return {'success': False,
                    'message': 'The maximum allowed number of users has already been assigned to this task'}
        task.users.append(user)
        user.current_task_number += 1
        task.current_user_number += 1
        db.session.commit()
        return {'success': True,
                'users': list(map(lambda x: x.username, task.users)),
                'message': f'Task is assigned to user {username}',
                'action': 'Accept'}

    @staticmethod
    def reject(username, task_uid):
        user = User.get_user(username, User.task_limit, User.current_task_number)
        task = Task.get_task(task_uid, Task.user_limit, Task.current_user_number)
        if user.current_task_number == 0:
            return {'success': False,
                    'message': f'User {username} has no assigned tasks'}
        elif task.current_user_number == 0:
            return {'success': False,
                    'message': 'The task has no assigned users'}
        task.users.remove(user)
        user.current_task_number -= 1
        task.current_user_number -= 1
        db.session.commit()
        return {'success': True,
                'users': list(map(lambda x: x.username, task.users)),
                'message': f'User {username} is no longer assigned to this task',
                'Action': 'Reject'}

    @staticmethod
    def update_task_info(task_uid, **fields):
        task = Task.get_task(task_uid)
        for attr, value in fields.items():
            if hasattr(task, attr):
                setattr(task, attr, value)
        db.session.add(task)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def __repr__(self):
        return (f'Task({self.id}, '
                f'{self.subject}, '
                f'{self.description} '
                f'{self.created.strftime("%d %B %Y %H:%M:%S")}, '
                f'{self.deadline.strftime("%d %B %Y %H:%M:%S")}, '
                f'{self.created_by}, '
                f'{self.user_limit}, '
                f'{self.label}, '
                f'{list(map(lambda x: (x.filename, x.data), self.files))})\n')
