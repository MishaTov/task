from io import BytesIO
from uuid import uuid4

from flask import send_file
from werkzeug.utils import secure_filename

from src import db


class File(db.Model):
    __tablename__ = 'files'

    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(50))
    data = db.Column(db.LargeBinary)
    uid = db.Column(db.String(36), unique=True)
    task_id = db.Column(db.Integer, db.ForeignKey('tasks.id'))

    def __init__(self, file, task_id):
        self.filename = secure_filename(file.filename)
        self.data = file.read()
        self.uid = str(uuid4())
        self.task_id = task_id

    @staticmethod
    def get_file(uid):
        return db.session.query(File).filter_by(uid=uid).first()

    @staticmethod
    def upload(files, task_id):
        to_add = []
        for file in files:
            new_file = File(
                file=file,
                task_id=task_id
            )
            to_add.append(new_file)
        db.session.add_all(to_add)
        db.session.commit()
        return to_add

    @staticmethod
    def download(uid):
        file = File.get_file(uid)
        return send_file(
            path_or_file=BytesIO(file.data),
            download_name=file.filename,
            as_attachment=True
        )
