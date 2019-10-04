import json
import datetime
from passlib.hash import sha256_crypt
from peewee import *

from config.database import db

class User(Model):
    class Meta:
        db_table = 'users'
        database = db

    # fields
    id = AutoField()
    email = CharField(max_length=100, null=False)
    name = CharField(max_length=100, null=False)
    is_verified = BooleanField()
    password_hash = CharField(max_length=100)
    last_login = DateField()
    session = CharField(max_length=36)

    def create(email=None, name=None, password=None):
        user = User()
        user.email = email
        user.name = name
        user.password_hash = sha256_crypt.hash(password)
        user.is_verified = False  
        user.last_login = datetime.date.today()
        user.session = None
        return user

    def set_to_verified(self):
        self.is_verified = True

    def verify_password(self, password):
        return sha256_crypt.verify(password, self.password_hash)

    def edit(self, email=None, name=None, password=None):
        if email != None:
            self.email = email
        if name != None:
            self.name = name
        if password != None:
            self.password_hash = sha256_crypt.hash(password)

    def to_cacheable_value(self):
        return {
            'email': self.email,
            'name': self.name,
            'isVerified': 1 if self.is_verified else 0,
            'session': self.session
        }

    def __str__(self):
        hash = self.to_cacheable_value()
        return json.dumps(hash)