/**
 * This will be used whenever I need to make requests for my single-pager projects
 */
import express from 'express';

export function createProjectsRouter() {
    const router = express.Router();
    setupRouter(router);
    return router;
}

function setupRouter(router) {
    
}
