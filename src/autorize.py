from src import db
from src.models.user import User


class UserLogin:

    def get_user(self, username):
        self.__user = db.session.query(User).filter_by(username=username).first()

    def create(self, user):
        self.__user = user

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        return self.__user['username']
