from peewee import *
import playhouse.db_url

import mongoengine

from constants.secrets import DATABASE_URI, MONGO_URI

db = playhouse.db_url.connect(DATABASE_URI)
mongo = mongoengine.connect('weimingmongo', host=MONGO_URI)