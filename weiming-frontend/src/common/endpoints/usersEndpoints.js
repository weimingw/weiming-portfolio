import { createHandyMap } from '../extensions';
import { prepareEndpoints } from './helpers';

const endpoints = {
    url: '/user',
    label: 'User Profile',
    showInSidebar: false,
    pages: createHandyMap([
        ['login', {
            url: '',
        }],
        ['create', {
            url: '/create',
        }],
        ['update', {
            url: '/update',
        }],
        ['verify', {
            url: '/verify',
        }],
        ['logout', {
            url: '/logout',
        }],
    ]),
    api: {
        login: {
            url: '/login',
            method: 'POST',
        },
        logout: {
            url: '/logout',
            method: 'POST',
        },
        create: {
            url: '',
            method: 'POST',
        },
        edit: {
            url: '',
            method: 'PUT',
        },
        validate: {
            url: '/verify',
            omitSession: true,
        },
        verifySession: {
            url: '/verify_session',
            method: 'POST',
            silentlyHandleErrors: true,
        }
    }
};

prepareEndpoints(endpoints);

export default endpoints;