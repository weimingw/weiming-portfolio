
from flask import request

from main import app, db
from routes.endpoints.nutrition_endpoints import *
from models.nutrition.nutrition_day import NutritionDay
from models.nutrition.nutrition_day_entry import NutritionDayEntry
from services.response_service import *
from services.conversion_service import str_to_date
from services.nutrition_service import *
from constants.errors import *

@app.route(NUTRITION_DAY_EP.path, methods=['GET'])
def get_all_nutrition_days():
    user = request.user
    detailed = True if request.args.get('detailed') != None else False

    if request.args.get('date'):
        date = request.args.get('date')
        day = NutritionDay.objects(
                date=str_to_date(date), 
                user_id=user.id
            ).first()
        if day != None:
            return return_success({
                'payload': day.to_payload(detailed)
            })
        else:
            return return_not_found({
                'payload': None,
                'reason': ErrorReasons.NUTRITION_DAY_NOT_FOUND.value
            })
    else:
        days = NutritionDay \
            .objects(user_id=user.id) \
            .order_by('+date')
        days = sorted(days, key=lambda day: day.date)
        return return_success({
            'payload': list(map(lambda day: day.to_payload(detailed), days))
        })

@app.route(NUTRITION_DAY_EP.path, methods=['POST'])
def create_nutrition_day():
    body = request.body
    entries_json = body.get('entries', [])

    entries = create_nutrition_day_entry_list_from_json(entries_json)

    day = NutritionDay.create() \
        .with_user(request.user) \
        .with_date_str(body.get('date')) \
        .set_entries(entries)
    day.save()

    return return_success({
        'payload': day.to_payload(detailed=True)
    })

@app.route(NUTRITION_DAY_EP.path, methods=['PUT'])
def edit_nutrition_day():
    body = request.body
    id = body.get('id')
    if id == None:
        raise ValidationError(400, ErrorReasons.MISSING_PARAM, ['id'])
    
    day = NutritionDay.get_with_id(id)
    if body.get('date') != None:
        day.with_date_str(body.get('date'))
    if body.get('entries') != None:
        entries = create_nutrition_day_entry_list_from_json(body.get('entries'))
        day.set_entries(entries)

    day.save()
    return return_success({
        'payload': day.to_payload()
    })

@app.route(NUTRITION_DAY_EP.path, methods=['DELETE'])
def delete_nutrition_day():
    body = request.body
    id = body.get('id')
    if id == None:
        raise ValidationError(400, ErrorReasons.MISSING_PARAM, ['id'])

    day = NutritionDay.get_with_id(id)
    day.delete()
    return return_success({
        'payload': {
            'id': str(day.id)
        }
    })