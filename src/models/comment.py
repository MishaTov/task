from uuid import uuid4

from src import db
from flask_login import current_user
from datetime import datetime


class Comment(db.Model):
    __tablename__ = 'comments'

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text)
    created = db.Column(db.DateTime)
    author = db.Column(db.String(20))
    uid = db.Column(db.String(36), unique=True)
    task_id = db.Column(db.Integer, db.ForeignKey('tasks.id'))

    def __init__(self, task_id, content):
        self.content = content
        self.created = datetime.utcnow()
        self.author = current_user.username
        self.uid = str(uuid4())
        self.task_id = task_id

    @staticmethod
    def create_comment(task_id, content):
        new_comment = Comment(task_id, content)
        db.session.add(new_comment)
        db.session.commit()
        return new_comment
