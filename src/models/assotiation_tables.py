from src import db

user_task = db.Table('user_task',
                     db.Column('id', db.Integer, primary_key=True),
                     db.Column('user_id', db.Integer, db.ForeignKey('users.id')),
                     db.Column('task_id', db.Integer, db.ForeignKey('tasks.id')),
                     )
