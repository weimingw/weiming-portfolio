import uuid from 'uuid/v4';
import { stateFields } from './state';

export const actionKeys =  {
    SET_USER: 'SET_USER',
    SET_SESSION: 'SET_SESSION',
    CLEAR_SESSION: 'CLEAR_SESSION',
    SET_HEXAGRID_VOLUME: 'SET_HEXAGRID_VOLUME',
    ADD_ERROR_MESSAGE: 'ADD_ERROR_MESSAGE',
    REMOVE_ERROR_MESSAGE: 'REMOVE_ERROR_MESSAGE',
    ADD_INFO_MESSAGE: 'ADD_INFO_MESSAGE',
    REMOVE_DISPLAY_MESSAGE: 'REMOVE_DISPLAY_MESSAGE',
};

export const mutations = {
    alterState(state, payload) {
        state[payload.field] = payload.value;
    },
}

export const actions = {
    [actionKeys.SET_USER] ({ commit }, email) {
        commit('alterState', {
            field: stateFields.USER,
            value: email
        });
    },
    [actionKeys.SET_SESSION] ({ commit }, session) {
        commit('alterState', {
            field: stateFields.SESSION, 
            value: session
        });
    },
    [actionKeys.CLEAR_SESSION] ({ commit }) {
        commit('alterState', { field: stateFields.SESSION, value: null });
        commit('alterState', { field: stateFields.USER, value: null });
    },
    [actionKeys.SET_HEXAGRID_VOLUME] ({ commit }, volume) {
        commit('alterState', { 
            field: stateFields.HEXAGRID_VOLUME, 
            value: volume 
        });
    },
    [actionKeys.ADD_ERROR_MESSAGE] ({ dispatch, commit, state }, message) {
        const id = uuid();
        commit('alterState', {
            field: stateFields.NOTIFICATION_MESSAGES, 
            value: [ 
                ...state[stateFields.NOTIFICATION_MESSAGES],
                { id, message, type: 'ERROR' }
            ],
        });
    },
    [actionKeys.ADD_INFO_MESSAGE] ({ dispatch, commit, state }, message) {
        const id = uuid();
        commit('alterState', {
            field: stateFields.NOTIFICATION_MESSAGES, 
            value: [ 
                ...state[stateFields.NOTIFICATION_MESSAGES],
                { id, message, type: 'INFO' }
            ],
        });
    },
    [actionKeys.REMOVE_NOTIFICATION_MESSAGE] ({ commit, state }, msgId) {
        commit('alterState', { 
            field: stateFields.NOTIFICATION_MESSAGES,
            value: state[stateFields.NOTIFICATION_MESSAGES].filter(msg => msg.id !== msgId),
        });
    },
}