from src.models import File
from src.resourses.base import BaseResource


class DownloadFile(BaseResource):

    @staticmethod
    def get(file_uid):
        return File.download(file_uid)
