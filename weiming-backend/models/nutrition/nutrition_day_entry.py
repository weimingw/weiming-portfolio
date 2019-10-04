from mongoengine import EmbeddedDocument
from mongoengine.fields import *

from config.database import db

class NutritionDayEntry(EmbeddedDocument):

    LABEL_MAX_LEN = 100
    ndbno = IntField(required=True)
    amount = IntField(required=True)
    unit = StringField(max_length=50, required=True)
    label = StringField(max_length=LABEL_MAX_LEN, required=True)

    def create():
        entry = NutritionDayEntry()
        return entry

    def create_from_json(entry):
        label = entry.get('label')
        if len(label) > NutritionDayEntry.LABEL_MAX_LEN:
            label = label[0:NutritionDayEntry.LABEL_MAX_LEN-3] + '...'
        return NutritionDayEntry.create() \
            .set_ndbno(entry.get('ndbno')) \
            .set_amount(entry.get('amount')) \
            .set_unit(entry.get('unit')) \
            .set_label(label)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

    def to_payload(self):
        return {
            'ndbno': self.ndbno,
            'amount': self.amount,
            'unit': self.unit,
            'label': self.label
        }

    def set_ndbno(self, ndbno):
        self.ndbno = ndbno
        return self

    def set_amount(self, amount):
        self.amount = amount
        return self

    def set_unit(self, unit):
        self.unit = unit
        return self

    def set_label(self, label):
        self.label = label
        return self