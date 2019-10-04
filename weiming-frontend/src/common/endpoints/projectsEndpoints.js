import { createHandyMap } from '../extensions';
import { prepareEndpoints } from './helpers';

const endpoints = {
    url: '/projects',
    label: 'Projects',
    icon: 'code',
    showInSidebar: true,
    pages: createHandyMap([
        ['list', {
            url: '/',
            label: 'Project List',
            icon: 'list',
        }],
        ['hexagrid', {
            url: '/hexagrid',
            label: 'Hexagrid',
            icon: 'music',
        }]
    ])
};

prepareEndpoints(endpoints);

export default endpoints;