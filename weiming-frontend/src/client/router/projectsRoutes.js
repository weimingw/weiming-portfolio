const ProjectsBase = () => import('../base/MainContent.vue');
const ProjectList = () => import('../pages/projects/list/ProjectList.vue');
const Hexagrid = () => import('../pages/projects/hexagrid/Hexagrid.vue');

import endpoints from '../../common/endpoints';

export default {
    path: endpoints.projects.url,
    component: ProjectsBase,
    children: [{
        path: endpoints.projects.pages.list.fullUrl,
        component: ProjectList,
    }, {
        path: endpoints.projects.pages.hexagrid.fullUrl,
        component: Hexagrid
    }]        
}