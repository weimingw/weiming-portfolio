import fetch from 'node-fetch';
import url from 'url';

import { BACKEND_URL } from '../secret';
import { sendGeneralFailureForError } from '../utils/responseUtil';

class ApiService {

    /**
     * @param {*} req request object 
     * @param {*} res endpoint response sender
     */
    async makeApiCall(req, res) {
        const {
            path,
            method,
            body,
        } = req;

        const requestParams = {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: method !== 'GET' ? JSON.stringify(body) : undefined,
        };
        const fullPath = method !== 'GET' ?
            path :
            path + url.parse(req.url).search;
        
        try {
            const response = await fetch(`${BACKEND_URL}${fullPath}`, requestParams)
            const json = await response.json();
            res.status(response.status).json(json);
        } catch (error) {
            sendGeneralFailureForError(req, res, error);
        }
    }
}

export default new ApiService();
