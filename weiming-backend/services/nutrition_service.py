from models.nutrition.nutrition_day_entry import NutritionDayEntry

def create_nutrition_day_entry_list_from_json(entries_json):
    return list(map(lambda entry: \
        NutritionDayEntry.create_from_json(entry),
        entries_json
    ))