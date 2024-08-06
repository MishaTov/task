from flask_wtf import FlaskForm
from wtforms.fields.simple import TextAreaField, SubmitField
from wtforms.validators import DataRequired


class CommentForm(FlaskForm):
    content = TextAreaField(
        validators=[DataRequired()],
        render_kw={'placeholder': 'Type your comment here'}
    )
    send = SubmitField('Send')
