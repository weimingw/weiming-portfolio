const UsersBase = () => import('../base/MainContent.vue');
const AboutPage = () => import('../pages/nutrition/about/NutritionAbout.vue');
const VisualizerPage = () => import('../pages/nutrition/visualizer/NutritionVisualizer.vue');
const TrackerPage = () => import('../pages/nutrition/tracker/NutritionTracker.vue');

import endpoints from '../../common/endpoints';

export default {
    path: endpoints.nutrition.url,
    component: UsersBase,
    children: [{
        path: endpoints.nutrition.pages.about.fullUrl,
        component: AboutPage,
    }, {
        path: endpoints.nutrition.pages.visualizer.fullUrl,
        component: VisualizerPage,
    }, {
        path: endpoints.nutrition.pages.tracker.fullUrl,
        component: TrackerPage,
    }],
}