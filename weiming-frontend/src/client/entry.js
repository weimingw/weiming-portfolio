import 'normalize.css';
import './common/base.scss';
import 'idempotent-babel-polyfill';

import Vue from 'vue';
import VueCompositionApi from '@vue/composition-api';
import VueRouter from 'vue-router';
import vuex from './vuex'; 
import config from './config';

import router from './router';

const MainPage = () => import('./components/mainPage/MainPage.vue');
import mainPageAccessor from './components/mainPage/MainPageAccessor';

Vue.use(VueRouter);
Vue.use(VueCompositionApi);

const mainPage = new Vue({
    el: '#app',
    router,
    render(h) {
        return h(MainPage, {
            props: {
                
            }
        })
    }
});

router.beforeEach((to, from, next) => {
    mainPageAccessor.setLoading(true);
    next();
});

router.afterEach((to, from) => {
    mainPageAccessor.setLoading(false);
});