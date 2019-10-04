import os

from flask import Flask

app = Flask(__name__)

# Setup database and migrations
from config.database import db, mongo

# Setup Redis cache
from config.cache import cache

# Setup mail
from config.mail import mail

# Setup routes
from routes.all import *

# Setup core request handling services
import services.request_service

# Setup exception handling services
import services.exception_service

__path__=['./']

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
