from flask_wtf import FlaskForm
from wtforms.fields.simple import StringField, PasswordField, BooleanField, SubmitField
from wtforms.validators import ValidationError, DataRequired

from src.models import User


class LoginForm(FlaskForm):
    EMPTY_MSG = 'This field must be filled'
    USER_NOT_FOUND_MSG = 'User not found'
    WRONG_PASSWORD_MSG = 'Wrong password'

    def validate_username(self, username):
        self.user = User.get_user(username.data)
        if not self.user:
            raise ValidationError(self.USER_NOT_FOUND_MSG)

    def validate_password(self, password):
        if hasattr(self, 'user') and hasattr(self.user, 'username') \
                and not self.user.check_password(self.user.username, password.data):
            raise ValidationError(self.WRONG_PASSWORD_MSG)

    username = StringField(
        validators=[DataRequired(message=EMPTY_MSG)],
        render_kw={'placeholder': 'Username'}
    )
    password = PasswordField(
        validators=[DataRequired(message=EMPTY_MSG)],
        render_kw={'placeholder': 'Password'}
    )
    remember = BooleanField('Remember me')
    submit = SubmitField('Login')
