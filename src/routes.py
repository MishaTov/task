from src import api

from .resourses.about import About
from .resourses.contacts import Contacts
from .resourses.create_task import CreateTask
from .resourses.download_file import DownloadFile
from .resourses.login import Login
from .resourses.logout import Logout
from .resourses.profile import Profile
from .resourses.register import Register
from .resourses.main_page import MainPage
from .resourses.assignment import Assignment
from .resourses.task import TaskDescription, AcceptReject, CheckLabel

api.add_resource(MainPage, '/', strict_slashes=False)
api.add_resource(Register, '/register', strict_slashes=False)
api.add_resource(Login, '/login', strict_slashes=False)
api.add_resource(About, '/about', strict_slashes=False)
api.add_resource(Contacts, '/contacts', strict_slashes=False)
api.add_resource(Profile, '/profile/<username>', strict_slashes=False)
api.add_resource(Assignment, '/assignment', strict_slashes=False)
api.add_resource(CreateTask, '/create_task', strict_slashes=False)
api.add_resource(Logout, '/logout', strict_slashes=False)
api.add_resource(TaskDescription, '/assignment/<task_uid>', strict_slashes=False)
api.add_resource(DownloadFile, '/assignment/download/<file_uid>', strict_slashes=False)
api.add_resource(AcceptReject, '/assignment/<task_uid>/action', strict_slashes=False)
api.add_resource(CheckLabel, '/label/<task_uid>', strict_slashes=False)
