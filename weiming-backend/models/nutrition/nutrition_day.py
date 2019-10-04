from datetime import date
import json
from mongoengine import Document
from mongoengine.fields import *

from config.database import mongo
from models.user import User
from models.nutrition.nutrition_day_entry import NutritionDayEntry
from constants.errors import ValidationError, ErrorReasons
from services.conversion_service import str_to_date

class NutritionDay(Document):
    user_id = IntField(required=True)
    date = DateField(required=True)
    entries = ListField(EmbeddedDocumentField(NutritionDayEntry))

    meta = {
        'indexes': [ 'user_id' ]
    }

    def create():
        day = NutritionDay()
        day.date = date.today()
        return day

    def get_with_id(id):
        day = NutritionDay.objects(id=id).first()
        if day == None:
            raise ValidationError(400, ErrorReasons.NUTRITION_DAY_NOT_FOUND)
        return day

    def are_user_and_date_unique(self):
        possible_duplicate = NutritionDay.objects(
                user_id=self.user_id, 
                date=self.date
            ).first()
        if possible_duplicate == None:
            return True
        else:
            return possible_duplicate.id == self.id

    def save(self, *args, **kwargs):
        if ((hasattr(self, '_changed_fields')
                and 'date' not in self._changed_fields)
                or self.are_user_and_date_unique()):
            super().save(*args, **kwargs)
        else:
            raise ValidationError(400, ErrorReasons.NUTRITION_DAY_NOT_UNIQUE)        

    def to_payload(self, detailed=False):
        payload = {
            'id': str(self.id),
            'date': self.date.isoformat()
        }
        if detailed:
            payload['entries'] = list(map(lambda entry: entry.to_payload(), self.entries))
        return payload

    def set_date(self, date_obj):
        assert isinstance(date_obj, date)
        self.date = date_obj
        return self

    def with_date_str(self, date_str):
        assert isinstance(date_str, str)
        return self.set_date(str_to_date(date_str))

    def with_user(self, user):
        return self.set_user_id(user.id)

    def set_user_id(self, id):
        self.user_id = id
        return self

    def set_entries(self, entries):
        self.entries = entries
        return self