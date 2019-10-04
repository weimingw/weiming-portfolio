import { logError } from "./errorUtil";
import uuid from 'uuid/v4';

export function sendGeneralSuccess(res, payload) {
    res.send({
        status: 'SUCCESS',
        payload,
    });
}

export function sendGeneralFailure(res, payload) {
    res.status(400).json(payload);
}

export function sendGeneralFailureForError(req, res, error) {
    const errorId = uuid();
    logError(req, error, errorId);
    sendGeneralFailure(res, {
        payload: `An error on the server has occurred. (Error ID: ${errorId})`,        
    });
}

export function handlePromiseWithResponse(promise, req, res) {
    return promise
        .then(payload => sendGeneralSuccess(res, payload))
        .catch(error => sendGeneralFailureForError(req, res, error));
}