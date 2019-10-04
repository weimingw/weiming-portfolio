import { createHandyMap } from '../extensions';
import { prepareEndpoints, GET, POST, PUT, DELETE } from './helpers';

const NUTRITION_DAY_URL = '/days';

const endpoints = {
    url: '/nutrition',
    label: 'Nutrition Tracker',
    showInSidebar: true,
    icon: 'vegetables',
    pages: createHandyMap([
        ['about', {
            url: '/',
            label: 'About',
            icon: 'carrot',
        }],
        ['visualizer', {
            url: '/visualizer',
            label: 'Visualizer',
            icon: 'polarChart',
            hidden: true,
        }],
        ['tracker', {
            url: '/tracker',
            label: 'Nutrition Tracker',
            icon: 'polarChart',
        }],
    ]),
    app: {
        searchFoods: {
            url: '/searchFoods',
        },
        getNutritionFacts: {
            url: '/nutritionFacts',
        },
    },
    api: {
        getDays: {
            url: NUTRITION_DAY_URL,
            method: GET,
        },
        createDay: {
            url: NUTRITION_DAY_URL,
            method: POST,
        },
        updateDay: {
            url: NUTRITION_DAY_URL,
            method: PUT,
        },
        deleteDay: {
            url: NUTRITION_DAY_URL,
            method: DELETE,
        }
    }
};

prepareEndpoints(endpoints);

export default endpoints;