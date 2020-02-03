import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';

import state from './state';
import { actions, actionKeys, mutations } from './actions';

const vuexLocal = new VuexPersistence({
    storage: window.localStorage,
})

Vue.use(Vuex);

const store = new Vuex.Store({
    state,
    mutations,
    actions,
    plugins: [
        vuexLocal.plugin,
    ],
});

const useStore = function() {
    return store;
}

export default store;

export {
    actionKeys,
    useStore,
};

