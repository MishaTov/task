from flask_wtf import FlaskForm
from wtforms.fields.simple import StringField, PasswordField, SubmitField
from wtforms.validators import ValidationError, DataRequired, Regexp, EqualTo

from src.models import User


class RegisterForm(FlaskForm):
    EMPTY_MSG = 'This field must be filled'
    WRONG_FIRST_NAME_MSG = 'First name must be alphabetic and no longer than 20 symbols'
    WRONG_LAST_NAME_MSG = 'Last name must be alphabetic and no longer than 30 symbols'
    WRONG_USERNAME_MSG = 'Username can contain only latin letters, numbers and underscores and be up to 30 characters'
    USER_EXISTS_MSG = 'This username already used'
    WRONG_PASSWORD_MSG = 'Password must be from 6 to 30 characters ' \
                         'and can contain only latin letters, numbers and underscores'
    WRONG_REPEAT_PASSWORD_MSG = 'Passwords do not match'

    USERNAME_PATTERN = r'^[A-Za-z0-9_]{1,20}$'
    PASSWORD_PATTERN = r'^[A-Za-z0-9_]{6,30}$'

    @staticmethod
    def validate_name(form, name):
        if not (name.data.isalpha() and len(name.data) <= 20):
            raise ValidationError(RegisterForm.WRONG_FIRST_NAME_MSG)

    @staticmethod
    def validate_surname(form, surname):
        if not (surname.data.isalpha() and len(surname.data) <= 30):
            raise ValidationError(RegisterForm.WRONG_LAST_NAME_MSG)

    @staticmethod
    def validate_username(form, username):
        if User.get_user(username.data):
            raise ValidationError(RegisterForm.USER_EXISTS_MSG)

    name = StringField(
        validators=[DataRequired(EMPTY_MSG), validate_name],
        render_kw={'placeholder': 'First name'}
    )
    surname = StringField(
        validators=[DataRequired(EMPTY_MSG), validate_surname],
        render_kw={'placeholder': 'Last name'}
    )
    username = StringField(
        validators=[DataRequired(EMPTY_MSG), Regexp(USERNAME_PATTERN, message=WRONG_USERNAME_MSG), validate_username],
        render_kw={'placeholder': 'Username'}
    )
    password = PasswordField(
        validators=[DataRequired(EMPTY_MSG), Regexp(PASSWORD_PATTERN, message=WRONG_PASSWORD_MSG)],
        render_kw={'placeholder': 'Password'}
    )
    password_ = PasswordField(
        validators=[DataRequired(EMPTY_MSG), EqualTo('password', message=WRONG_REPEAT_PASSWORD_MSG)],
        render_kw={'placeholder': 'Repeat password'}
    )
    submit = SubmitField('Register')
