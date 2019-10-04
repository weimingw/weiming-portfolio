/* All endpoints that go to the backend, mostly a relay with minimal processing */
import express from 'express';

import apiService from './apiService';

export function createApiRouter() {
    const router = express.Router();

    setupRouter(router);

    return router;
}

function setupRouter(router) {
    router.all('/*', (req, res) => {
        apiService.makeApiCall(req, res);
    });
}