from flask_login import UserMixin
from sqlalchemy.orm import load_only
from werkzeug.security import generate_password_hash, check_password_hash

from src import db
from src.models.assotiation_tables import user_task


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), nullable=False)
    surname = db.Column(db.String(30), nullable=False)
    username = db.Column(db.String(20), unique=True, nullable=False)
    password = db.Column(db.String(162), nullable=False)
    task_limit = db.Column(db.Integer, default=5)
    current_task_number = db.Column(db.Integer, default=0)

    def __init__(self, **fields):
        self.name = fields.get('name')
        self.surname = fields.get('surname')
        self.username = fields.get('username')
        self.password = generate_password_hash(fields.get('password'))
        self.task_limit = fields.get('task_limit')

    def get_id(self):
        return self.username

    @staticmethod
    def check_password(username, password):
        current_password = User.get_user(username).password
        return check_password_hash(current_password, password)

    @staticmethod
    def add_user(name, surname, username, password):
        new_user = User(
            name=name,
            surname=surname,
            username=username,
            password=password
        )
        db.session.add(new_user)
        db.session.commit()
        return new_user

    @staticmethod
    def get_user(username):
        return db.session.query(User).filter_by(username=username).first()

    @staticmethod
    def get_task_assigned_users(task_id, *columns):
        query = db.session.query(User).join(user_task).filter(user_task.c.task_id == task_id)
        if not columns:
            return query.all()
        return query.options(load_only(*columns)).all()

    def __repr__(self):
        return f'User({self.id}, {self.name}, {self.surname}, {self.username})'

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'surname': self.surname,
            'username': self.username
        }
