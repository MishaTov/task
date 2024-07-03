from datetime import datetime
from uuid import uuid4

from flask_login import current_user
from sqlalchemy import desc

from src import db
from .assotiation_tables import user_task
from .file import File
from .user import User


class Task(db.Model):
    __tablename__ = 'tasks'

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
    files = db.relationship('File', backref='task')
    comments = db.relationship('Comment', backref='tasks')

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
    def get_task(uid):
        return db.session.query(Task).filter_by(uid=uid).first()

    @staticmethod
    def create_task(subject, description, deadline, user_limit, files):
        new_task = Task(
            subject=subject,
            description=description,
            deadline=deadline,
            user_limit=user_limit
        )
        if files:
            files_ = File.upload(files, new_task.id)
            for file in files_:
                new_task.files.append(file)
        db.session.add(new_task)
        db.session.commit()

    @staticmethod
    def get_all():
        return db.session.query(Task).order_by(desc(Task.created)).all()

    @staticmethod
    def accept(username, task_uid):
        user = User.get_user(username)
        task = Task.get_task(task_uid)
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
                'message': f'Task is assigned to user {username}'}

    @staticmethod
    def reject(username, task_uid):
        user = User.get_user(username)
        task = Task.get_task(task_uid)
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
                'message': f'User {username} is no longer assigned to this task'}

    def __repr__(self):
        return (f'Task({self.id}, \n'
                f'{self.subject}, \n'
                f'{self.created.strftime("%d %B %Y %H:%M:%S")}, \n'
                f'{self.deadline.strftime("%d %B %Y %H:%M:%S")}, \n'
                f'{self.created_by}, \n'
                f'{self.user_limit}, \n'
                f'{self.label}, \n'
                f'{list(map(lambda x: (x.filename, x.data), self.files))})\n')
