import Home from '../base/Home.vue';
import PageNotFound from '../base/404.vue';
import Success from '../base/Success.vue';

import endpoints from '../../common/endpoints';
import personalsRoutes from './personalsRoutes';
import projectsRoutes from './projectsRoutes';
import usersRoutes from './usersRoutes';
import nutritionRoutes from './nutritionRoutes';

import VueRouter from 'vue-router';


export const routes = [
    personalsRoutes, 
    projectsRoutes,
    usersRoutes,
    nutritionRoutes,
    {
        path: '/', 
        component: Home,
    }, {
        path: endpoints.success.url,
        component: Success,
    },{
        path: '*',
        component: PageNotFound,
    }
];

const router = new VueRouter({
    routes,
    mode: 'history'
})

export default router;