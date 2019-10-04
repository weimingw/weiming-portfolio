import datetime
from flask import render_template, request, redirect, url_for

from routes.endpoints.users_endpoints import *
from models.user import User
from services.response_service import *
from main import app, cache, db
from services.users_service import *
from services.request_service import skip_validate_user
from premailer import transform

"""
    Note to self:
    User is special in that there is a lot of validation happening 
    outside of the model, since it is updated every time a session
    is created, so a lot of times we would have
    pointlessly repeated validation that we're better off skipping
"""
@db.atomic()
@skip_validate_user
@app.route(USER_EP.path, methods=['POST'])
def create_user():
    body = request.get_json()

    password_confirmation_node = PasswordConfirmationCheckerChainNode()
    email_validity_node = EmailValidityCheckerChainNode()
    email_uniqueness_node = EmailUniquenessCheckerChainNode()

    password_confirmation_node.set_next(email_validity_node)
    email_validity_node.set_next(email_uniqueness_node)
    
    is_successful, result = password_confirmation_node.run()
    if not is_successful:
        return result.convert_to_response()

    u = User.create(email=body.get('email'), 
            name=body.get('name'), 
            password=body.get('password'))
    send_verification_email(u, origin=body.get('origin'))

    session = add_new_user_session(u)
    u.save()
    return return_success({
        'payload': session
    })

@db.atomic()
@app.route(USER_EP.path, methods=['PUT'])
def update_user():
    user = request.user

    user_password_match_node = UserPasswordMatchCheckerChainNode(user)
    password_confirmation_node = PasswordConfirmationCheckerChainNode(should_check_new=True)
    email_validity_node = EmailValidityCheckerChainNode(should_check_new=True)
    email_uniqueness_node = EmailUniquenessCheckerChainNode(should_check_new=True)
    
    user_password_match_node.set_next(password_confirmation_node)
    password_confirmation_node.set_next(email_validity_node)
    email_validity_node.set_next(email_uniqueness_node)

    is_successful, result = user_password_match_node.run()
    if not is_successful:
        return result.convert_to_response()

    new_email = request.body.get('new_email')
    user.edit(email=new_email, 
            name=request.body.get('new_name'), 
            password=request.body.get('new_password'))

    cache.rename(request.body.get('email'), new_email)
    user.save()
    return return_success({
        'payload': user.to_cacheable_value()
    })

@db.atomic()
@skip_validate_user
@app.route(LOGIN_EP.path, methods=['POST'])
def login():  
    existing_user = find_user_by_email(email=request.body.get('email'))
    user_password_match_node = UserPasswordMatchCheckerChainNode(existing_user)
    
    is_successful, result = user_password_match_node.run()
    if not is_successful:
        return result.convert_to_response()

    session = add_new_user_session(existing_user)

    return return_success({
        'payload': session
    })

@app.route(LOGOUT_EP.path, methods=['DELETE'])
def logout():
    cache.delete(request.body.get('email'))
    return return_success({
        'payload': 'Logged out'
    })

@db.atomic()
@skip_validate_user
@app.route(VERIFY_USER_EP.path)
def verify_user():
    if request.args.get('c') != None and request.args.get('i') != None:
        params = decode_user_verification_params()
        return return_success({
            'payload': 'User successfully verified'
        })
    else:
        return return_bad_request({
            'payload': 'Could not verify any user'
        })

@app.route(VERIFY_SESSION_EP.path, methods=['POST'])
def verify_session():
    return return_success({
        'payload': 'Session verified'
    })

@skip_validate_user
@app.route('/debug')
def debug():
    return transform(render_template('email_verification.html', user=None))