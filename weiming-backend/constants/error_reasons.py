from enum import Enum

class ErrorReasons(Enum):
    # User-related
    SESSION_NOT_FOUND = 'Session not found. Please login again.'
    PASSWORD_MISMATCH = 'The passwords provided don\'t match.'
    INVALID_EMAIL = 'Invalid email provided.'
    PREEXISTING_ACCOUNT = 'That email already has an account.'
    ACCOUNT_NOT_FOUND = 'Could not find user with matching email and password'
    MISSING_PARAM = 'Missing required values for: {}'

    # Nutrition-related
    NUTRITION_DAY_NOT_UNIQUE = 'There is already existing data for this date'
    NUTRITION_DAY_NOT_FOUND = 'There is no data found for this day'