import { createHandyMap } from '../extensions';
import personalsEndpoints from './personalsEndpoints';
import projectsEndpoints from './projectsEndpoints';
import usersEndpoints from './usersEndpoints';
import nutritionEndpoints from './nutritionEndpoints';

/**
 * Endpoint object structure
    {
        url: String,
        label: String,
        showInSidebar: Boolean,
        icon: String,
        pages: {
            pageName: {
                url: String,
                label: String,
                icon: String,
                hidden: Boolean,
            }
        }
    }
 */



const endpoints = createHandyMap([
    ['success', {
        url: '/success'
    }],
    ['personals', personalsEndpoints],
    ['projects', projectsEndpoints],
    ['users', usersEndpoints],
    ['nutrition', nutritionEndpoints],
]);

export default endpoints;