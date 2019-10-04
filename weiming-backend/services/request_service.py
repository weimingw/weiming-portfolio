
from flask import request
from datetime import date

from constants.error_reasons import ErrorReasons
from main import app, cache, db
from utils.handler_chain import HandlerChainNode, RequestHandlerChainResult
from services.users_service import get_user_session, find_user_by_email

"""
    A file for all things needed to handle requests
"""

"""
    Parses body of request as JSON and stores it as body
"""
@app.before_request
def parse_body():
    if request.method == 'GET':
        request.body = request.args
    else:
        request.body = request.get_json(force=True, silent=True)

"""
    Checks that the request has an associated user with an associated session
    Adds the user's session to request.session
"""
@app.before_request
def validate_user():
    func = app.view_functions[request.endpoint]
    if hasattr(func, '_skip_validate_user'):
        return None

    full_session_checker = RequestCheckerNode()
    full_session_checker.set_next(SessionCheckerNode())
    is_successful, result = full_session_checker.run()

    if is_successful:
        # add user and session to request context
        user, session = result
        request.user = user
        request.session = session
        cache.set_expiration(user.email, 600)
        return None
    else:
        return result.convert_to_response()

class RequestCheckerNode(HandlerChainNode):
    def test(self):
        return (request.body.get('email') != None and
                request.body.get('session') != None)

    def return_failure(self):
        return (False, RequestHandlerChainResult(
            401,
            ErrorReasons.SESSION_NOT_FOUND
        ))

class SessionCheckerNode(HandlerChainNode):
    user = None
    session = None

    def test(self):
        email = request.body.get('email')
        session_key = request.body.get('session')
        self.user = find_user_by_email(email)
        if self.user == None:
            return False

        self.session = get_user_session(email, session_key)
        return self.session != None

    def return_success(self):
        # update user's last login
        with db.atomic():
            self.user.last_login = date.today()
            self.user.save()
        return (True, (self.user, self.session))

    def return_failure(self):
        return (False, RequestHandlerChainResult(
            401,
            ErrorReasons.SESSION_NOT_FOUND
        ))
            
def skip_validate_user(func):
    func._skip_validate_user = True
    return func

"""
    Always roll back if we encounter an error
"""
@app.teardown_request
def teardown_request(exception):
    if exception:
        # roll back changes
        pass
    # end session
    db.close()