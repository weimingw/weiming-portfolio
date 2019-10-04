import json
from flask import Response

def create_body_with_status(hash, status):
    payload = dict(hash)
    payload['status'] = status
    return payload

def create_body_with_failure_status(hash):
    return create_body_with_status(hash, 'FAILURE')

def return_success(hash={}):
    payload = create_body_with_status(hash, 'SUCCESS')
    return Response(json.dumps(payload), status=200, mimetype='application/json')

def return_bad_request(hash={}):
    payload = create_body_with_failure_status(hash)
    return Response(json.dumps(payload), status=400, mimetype='application/json')

def return_unauthorized(hash={}):
    payload = create_body_with_failure_status(hash)
    return Response(json.dumps(payload), status=401, mimetype='application/json')

def return_failure(hash={}, status=400):
    payload = create_body_with_failure_status(hash)
    return Response(json.dumps(payload), status=status, mimetype='application/json')

def return_not_found(hash={}):
    return return_failure(hash=hash, status=404)