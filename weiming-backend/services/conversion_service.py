from datetime import datetime

def str_to_date(str):
    if str.find('T') > -1:
        return datetime.strptime(str, '%Y-%m-%dT%H:%M:%S.%fZ').date()
    else:
        return datetime.strptime(str, '%Y-%m-%d').date()