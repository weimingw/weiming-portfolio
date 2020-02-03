import throttle from 'lodash/throttle';
import rp from "request-promise-native";

import { NSDA_API_KEY } from '../secret';
import { createCachedFunction } from '../cache/index';
import { dailyRecommendations } from '../../common/app/nutrition/nutritionCommon';

const RECOMMENDED_NUTRIENTS = new Set([... dailyRecommendations.keys()]);

const FOODDATA_CENTRAL_URL = `https://${NSDA_API_KEY}@api.nal.usda.gov/fdc/v1`;

class NutritionService {
    /* === START Search related methods === */
    async search(searchTerm, page) {
        if (searchTerm.length) {
            const body = this.getSearchRequestBody(searchTerm, page);
            const response = await rp({ 
                method: 'POST',
                url: `${FOODDATA_CENTRAL_URL}/search`,
                headers: { 'Content-Type': 'application/json' },
                body,
                json: true,
            });
            const payload = this.createSearchResultPayload(response);
            return payload;
        } else {
            return Promise.resolve(this.createSearchResultPayload());
        }
    }

    getSearchRequestBody(searchTerm, page) {
        return {
            generalSearchInput: searchTerm,
            includeDataTypes: {
                "Survey (FNDDS)": false,
                "Foundation": false,
                "Branded": false,
                "SR Legacy": true,
                "Experimental": false
            },
            pageNumber: page,
            requireAllWords: true,
        };
    }

    createSearchResultPayload(results={ totalHits: 0 }) {
        let total = 0;
        let foods = [];
        let page = 0;
        let totalPages = 0;
        if (results.totalHits) {
            foods = results.foods.map(item => ({
                name: item.description,
                fdcId: item.fdcId,
            }));
            page = results.currentPage;
            total = results.totalHits;
            totalPages = results.totalPages;
        }
        return { total, foods, page, totalPages };
    }
    /* === END Search related methods === */

    /* === START Nutrition facts related methods === */
    getNutritionFacts = createCachedFunction(async (fdcId) => {
        if (fdcId) {                  
            const response = await rp({ 
                url: `${FOODDATA_CENTRAL_URL}/${fdcId}`,
                headers: { 'Content-Type': 'application/json' },
                json: true,
            });

            const payload = this.createNutritionFactPayload(response);
            return payload;
        } 
        throw new Error('An error occurred when trying to get nutritional information. Please try again.');
    }, 'getNutritionFacts', { maxSize: 100 })

    createNutritionFactPayload(foodData) {
        const nutrition = {
            fdcId: foodData.fdcId,
            nutrients: foodData.foodNutrients
                    .filter(item => RECOMMENDED_NUTRIENTS.has(item.nutrient.id))
                    .reduce((acc, item) => {
                        acc[item.nutrient.id] = {
                            label: item.nutrient.name,
                            amount: item.amount / 100,
                            unit: item.nutrient.unitName,
                        };
                        return acc;
                    }, {}),
            units: [
                { label: 'g', id: -1, gramWeight: 1 },
                ... foodData.foodPortions.map(p => ({
                    label: p.modifier,
                    id: p.id,
                    gramWeight: p.gramWeight,
                })),
            ],
        };
        return nutrition;
    }
    /* === END Nutrition facts related methods === */
}

export default new NutritionService();