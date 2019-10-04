from services.response_service import return_failure

class HandlerChainNode():

    next = None

    def __init__(self):
        pass

    def set_next(self, next):
        self.next = next

    # should return (successful?, payload)
    def run(self):
        try:
            if self.test():
                if self.next != None:
                    return self.next.run()
                else:
                    return self.return_success()
            else:
                return self.return_failure()
        except Exception as e:
            return self.return_failure()

    """
        Return True for caller to know it is a success,
        and any values you want to return to the caller
    """
    def return_success(self):
        return (True, None)

    def return_failure(self):
        return (False, None)

    def test(self):
        return (True, None)

class RequestHandlerChainResult():

    def __init__(self, response_code, reason=None):
        self.response_code = response_code
        self.reason = reason

    def convert_to_response(self):
        return return_failure(
            hash={ 
                'payload': self.reason.value,
                'reason': self.reason.name 
            },
            status=self.response_code
        )