# encryption
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
from base64 import b64encode, b64decode

# libraries
from uuid import uuid4
from email.utils import parseaddr
from flask import render_template, request
from flask_mail import Message
from premailer import transform
import urllib.parse as urlparse

# mine
from main import cache, mail
from models.user import User
from utils.handler_chain import HandlerChainNode, RequestHandlerChainResult
from constants.secrets import PASSWORD_VERIFICATION_KEY
from constants.error_reasons import ErrorReasons

def find_user_by_email(email):
    # find a user by their email
    return User.get_or_none(User.email == email)

# add user session to cache
def add_new_user_session(u):
    u.session = str(uuid4())
    return cache_user_session(u)

def cache_user_session(u):
    user_dict = u.to_cacheable_value()
    cache.set_hash(u.email, user_dict, 600)
    return user_dict

def get_user_session(email, session_key):
    if (email != None and session_key != None):
        cached_session = cache.get_hash(email)
        if cached_session != None and len(cached_session) > 0:
            if cached_session.get('session') == session_key:
                return cached_session
        else:
            user = find_user_by_email(email)
            if user.session == session_key:
                return cache_user_session(user) 
    return None

def send_verification_email(user, origin=None):
    msg = Message('Email verification required', recipients=[user.email])
    originUrl = request.url_root if origin == None else origin + '/'

    url = '{}user/verify?{}'.format(originUrl, encode_user_verification_params(user))
    msg.html = transform(render_template('email_verification.html', user=user, url=url))
    mail.send(msg)

def encode_user_verification_params(user):
    cipher = AES.new(PASSWORD_VERIFICATION_KEY, AES.MODE_CBC)

    ciphertext_bytes = cipher.encrypt(pad(str.encode(user.email), AES.block_size))
    iv = urlparse.quote( b64encode(cipher.iv).decode('utf-8') )
    ciphertext = urlparse.quote( b64encode(ciphertext_bytes).decode('utf-8') )

    return 'c={}&i={}'.format(ciphertext, iv)

def decode_user_verification_params():
    ciphertext_bytes = b64decode( request.args.get('c') )
    iv = b64decode( request.args.get('i') )

    cipher = AES.new(PASSWORD_VERIFICATION_KEY, AES.MODE_CBC, iv)
    decrypted_bytes = unpad(cipher.decrypt(ciphertext_bytes), AES.block_size)
    email = decrypted_bytes.decode('utf-8')

    user = None # find tge user with this email
    user.is_verified = True
    # save changes made to user

class PasswordConfirmationCheckerChainNode(HandlerChainNode):
    def __init__(self, should_check_new=False):
        self.should_check_new = should_check_new

    def test(self):
        password = request.body.get('password') if not self.should_check_new else request.body.get('new_password')
        password_confirmation = request.body.get('password_confirmation') if not self.should_check_new else request.body.get('new_password_confirmation')
        return ((password != None and password == password_confirmation) or
            (self.should_check_new and password == None and password_confirmation == None))
    
    def return_failure(self):
        return (False, RequestHandlerChainResult(
            400,
            ErrorReasons.PASSWORD_MISMATCH
        ))

class EmailValidityCheckerChainNode(HandlerChainNode):
    def __init__(self, should_check_new=False):
        self.should_check_new = should_check_new

    def test(self):
        email = request.body.get('email') if not self.should_check_new else request.body.get('new_email')
        return ('@' in parseaddr(email)[1] or
            (self.should_check_new and email == None))
    
    def return_failure(self):
        return (False, RequestHandlerChainResult(
            400,
            ErrorReasons.INVALID_EMAIL
        ))

class EmailUniquenessCheckerChainNode(HandlerChainNode):
    def __init__(self, should_check_new=False):
        self.should_check_new = should_check_new

    def test(self):
        email = request.body.get('email') if not self.should_check_new else request.body.get('new_email')
        existing_user = find_user_by_email(email)
        return existing_user == None

    def return_failure(self):
        return (False, RequestHandlerChainResult(
            400,
            ErrorReasons.PREEXISTING_ACCOUNT
        ))

class UserPasswordMatchCheckerChainNode(HandlerChainNode):
    def __init__(self, user):
        self.user = user

    def test(self):
        return self.user != None and self.user.verify_password(request.body.get('password'))

    def return_failure(self):
        return (False, RequestHandlerChainResult(
            401,
            ErrorReasons.ACCOUNT_NOT_FOUND
        ))