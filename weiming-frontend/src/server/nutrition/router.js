/* Any endpoints that pertain to the nutrition pages */
import express from 'express';

import { handlePromiseWithResponse } from '../utils/responseUtil';
import nutritionService from './nutritionService';
import endpoints from '../../common/endpoints';

export function createNutritionRouter() {
    const router = express.Router();

    setupRouter(router);

    return router;
}

function setupRouter(router) {
    const nutritionAppEndpoints = endpoints.nutrition.app;
    
    /**
     * Expect GET parameters:
     *   term - search term
     *   page - the page to get results for
     */
    router.get(nutritionAppEndpoints.searchFoods.partialUrl, (req, res) => {
        let {
            term = '',
            page = 0,
        } = req.query;

        return handlePromiseWithResponse(nutritionService.search(term, page), req, res);
    });

    /**
     * Expect GET parameters:
     *   fdcId - the number for the food item
     *   
     */
    router.get(nutritionAppEndpoints.getNutritionFacts.partialUrl, (req, res) => {
        let {
            fdcIds,
        } = req.query;
        // is a GET, so single item list is interpreted as single value
        // make a list, but only have distinct values
        fdcIds = [
            ... new Set(Array.isArray(fdcIds) ? fdcIds : [ fdcIds ]).values()
        ]; 

        const payloadsPromise = Promise.all(
            fdcIds.map(fdcId => nutritionService.getNutritionFacts(fdcId))
        ).then(payloads => ({ data: payloads }));
        return handlePromiseWithResponse(payloadsPromise, req, res);
    });
}