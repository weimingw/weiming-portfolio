from main import app
from services.response_service import return_bad_request, return_failure
from constants.errors import ValidationError

import traceback

"""
    Automatically handles exceptions without killing the program and leaving clients hanging,
    and prints out generic stack trace
"""
@app.errorhandler(Exception)
def handle_generic_exception(error):
    if type(error) is ValidationError:
        return return_failure(
            hash={ 'payload': error.message, 'reason': error.reason },
            status=error.response_code
        )
    traceback.print_exc()
    return return_bad_request({
        'payload': 'An error on the server occurred.'
    })