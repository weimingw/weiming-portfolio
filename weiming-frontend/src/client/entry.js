import 'normalize.css';
import './common/base.scss';
import 'idempotent-babel-polyfill';

import Vue from 'vue';
import VueRouter from 'vue-router';
import vuex from './vuex'; 

import router from './router';

const MainPage = () => import('./components/mainPage/MainPage.vue');

Vue.use(VueRouter);

new Vue({
    el: '#app',
    router,
    render(h) {
        return h(MainPage, {
            props: {
                
            }
        })
    }
})