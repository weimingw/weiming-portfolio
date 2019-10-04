from flask_mail import Mail

from constants.secrets import MAIL_USER, MAIL_PASS, MAIL_HOST, MAIL_SENDER
from main import app

app.config['MAIL_SERVER'] = MAIL_HOST
app.config['MAIL_PORT'] = 587
app.config['MAIL_USERNAME'] = MAIL_USER
app.config['MAIL_PASSWORD'] = MAIL_PASS
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_DEFAULT_SENDER'] = MAIL_SENDER

mail = Mail(app)
