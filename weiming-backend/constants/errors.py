from constants.error_reasons import ErrorReasons

class ValidationError(Exception):
    def __init__(self, response_code, reason, msg_args=[]):
        self.response_code = response_code
        self.reason = reason.name
        self.message = reason.value.format(*msg_args)
    
    def __str__(self):
        return self.message