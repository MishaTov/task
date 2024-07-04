from datetime import datetime

from flask_wtf import FlaskForm
from flask_wtf.file import MultipleFileField, FileSize
from wtforms.fields.datetime import DateTimeLocalField
from wtforms.fields.numeric import IntegerRangeField
from wtforms.fields.simple import StringField, TextAreaField, SubmitField
from wtforms.validators import ValidationError, DataRequired, Length


class TaskForm(FlaskForm):
    EMPTY_MSG = 'This field must be filled'
    LONG_SUBJECT_MSG = 'Max length of this field 250 characters'
    WRONG_TIME = 'You cannot set deadline in past'
    BIG_FILE_MSG = 'Max allowed file size is 15Mb'

    @staticmethod
    def validate_time(form, time):
        if time.data.timestamp() < datetime.now().timestamp():
            raise ValidationError(TaskForm.WRONG_TIME)

    subject = StringField(
        validators=[DataRequired(message=EMPTY_MSG), Length(max=50, message=LONG_SUBJECT_MSG)],
        render_kw={'placeholder': 'Subject'}
    )
    description = TextAreaField(
        render_kw={'placeholder': '[Optional] Description...'}
    )
    deadline = DateTimeLocalField(
        validators=[DataRequired(message=EMPTY_MSG), validate_time]
    )
    user_limit = IntegerRangeField(
        default=5, render_kw={'min': 1, 'max': 10}
    )
    files = MultipleFileField(
        validators=[FileSize(max_size=15*1024*1024, message=BIG_FILE_MSG)]
    )
    submit = SubmitField('Create')
