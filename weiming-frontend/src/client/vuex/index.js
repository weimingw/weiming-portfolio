import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';

import state from './state';
import { actions, actionKeys, mutations } from './actions';

const vuexLocal = new VuexPersistence({
    storage: window.localStorage,
})

Vue.use(Vuex);

export default new Vuex.Store({
    state,
    mutations,
    actions,
    plugins: [
        vuexLocal.plugin,
    ],
});

export {
    actionKeys,
};