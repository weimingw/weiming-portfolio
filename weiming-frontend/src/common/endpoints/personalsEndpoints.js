import { createHandyMap } from '../extensions';
import { prepareEndpoints } from './helpers';

const endpoints = {
    url: '/me',
    label: 'Me',
    icon: 'male',
    showInSidebar: true,
    pages: createHandyMap([
        ['about', {
            url: '/',
            label: 'About Me',
            icon: 'user-circle',
        }],
        ['resume', {
            url: '/resume',
            label: 'Resume',
            icon: 'file-alt',
        }],
    ])
};

prepareEndpoints(endpoints);

export default endpoints;