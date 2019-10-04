const PersonalsBase = () => import('../base/MainContent.vue');
const AboutMe = () => import('../pages/personals/aboutMe/AboutMe.vue');
const Resume = () => import('../pages/personals/resume/Resume.vue');

import endpoints from '../../common/endpoints';

export default {
    path: endpoints.personals.url,
    component: PersonalsBase,
    children: [{
        path: endpoints.personals.pages.about.fullUrl,
        component: AboutMe,
    }, {
        path: endpoints.personals.pages.resume.fullUrl,
        component: Resume,
    }]        
}