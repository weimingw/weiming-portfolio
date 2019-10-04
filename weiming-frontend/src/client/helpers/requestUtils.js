import * as deepmerge from 'deepmerge';

import { redirectToLoginWhenSessionRequired } from './sessionUtils';
import { convertPayloadToSnakeCase } from './formUtils';
import store, { actionKeys } from '../vuex';

/**
 * Creates a method that sends requests for endpoints
 * @param {*} callTypeOpts contains:
 *      snakeCasedParams - body params and search params are converted to snake_case before sending
 */
function getRequestMakingFunction(callTypeOpts) {
    const {
        snakeCasedParams,
    } = callTypeOpts;

    /**
     * Makes a request to the endpoint object
     * @param {*} endpoint object with fullUrl and method fields
     * @param {*} params any options that go into a fetch request
     * @param {*} bodyObj anything to send as request body
     * @param {*} opts any options we might pass in in the future
     */
    return async function(endpoint, 
                params,
                bodyObj,
                opts = {}) {
        const { 
            method = 'GET',
            fullUrl,
        } = endpoint;

        const body = getRequestBody(endpoint, bodyObj, snakeCasedParams);

        const requestUrl = method === 'GET' ?
            `${ fullUrl }?${ transformObjectToSearchParamString(body) }` :
            fullUrl;

        const requestParams = getRequestParams(params, method, body);

        return new Promise(async (resolve, reject) => {
            const response = await fetch(requestUrl, requestParams);
            const json = await response.json();
            if (response.status === 200 && json.status === 'SUCCESS') {
            // complete success, return the response
                resolve(json);
            } else if (json.reason) {
                // an error from the server, potentially have custom handler
                // handler may override whether we display errors, thus we AND
                const handled = handleServerError(endpoint, json);
                if (handled) reject(new HandledError());
            }
            reject(new Error(json.payload));
        }).catch(err => {
            let errorMsg = err instanceof TypeError ?
                'An error occurred. It could be network related.' :
                err.message || 'An error occurred.';
            if (!endpoint.silentlyHandleErrors && !(err instanceof HandledError)) {
                store.dispatch(actionKeys.ADD_ERROR_MESSAGE, errorMsg);
            }
            throw err;
        });
    }
}

export const makeApiRequestToEndpoint = getRequestMakingFunction({ snakeCasedParams: true });
export const makeAppRequestToEndpoint = getRequestMakingFunction({ snakeCasedParams: false });

function getRequestBody(endpoint, bodyObj, snakeCasedParams) {
    const { omitSession } = endpoint;
    const { session, email, ...otherData } = bodyObj;

    let body = {
        session: omitSession ? null : session || store.state.session,
        email: omitSession ? null : email || store.state.user,
        ...otherData,
    };
    if (snakeCasedParams) {
        body = convertPayloadToSnakeCase(body);
    }
    return body;
}

function getRequestParams(params, method, body) {
    return deepmerge({
        method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: method === 'GET' ? undefined : JSON.stringify(body), 
    }, params);
}

function transformEntriesListToObject(entries) {
    const params = {}
    entries.forEach(([key, val]) => {
        params[key] = val;
    });
    return params;
}

export function transformSearchParamStringToObject(search) {
    return transformEntriesListToObject([ ...new URLSearchParams(search).entries() ]);
}

function transformEntriesListToSearchParamString(entries) {
    return entries
        .map(([key, val]) => {
            if (Array.isArray(val)) {
                return val
                    .map(iv => `${encodeURIComponent(key)}=${encodeURIComponent(iv)}`)
                    .join('&');
            }
            return `${encodeURIComponent(key)}=${encodeURIComponent(val)}`;
        })
        .join('&');
}

/**
 * Handles specific error reasons from the server and returns whether to display the error like default
 * @param {*} opts options passed into makeApiRequestToEndpoint
 * @param {*} responseJson parsed json of response body
 */
function handleServerError(endpoint, responseJson) {
    if (!endpoint.silentlyHandleErrors && responseJson.reason === 'SESSION_NOT_FOUND') {
        redirectToLoginWhenSessionRequired();
        return true;
    }
    return false;
}

export function transformObjectToSearchParamString(obj) {
    return transformEntriesListToSearchParamString(Object.entries(obj));
}

export function transformIterableToSearchParamString(map) {
    return transformEntriesListToSearchParamString([ ...map.entries() ]);
}

class HandledError extends Error { }