from src import db


class Comment(db.Model):
    __tablename__ = 'comments'

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text)
    created = db.Column(db.DateTime)
    author = db.Column(db.String(20))
    task_id = db.Column(db.Integer, db.ForeignKey('tasks.id'))
