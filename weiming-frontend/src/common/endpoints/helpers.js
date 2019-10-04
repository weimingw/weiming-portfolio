export const API_PREFIX = '/api';
export const APP_PREFIX = '/app';
export const GET = 'GET';
export const POST = 'POST';
export const PUT = 'PUT';
export const DELETE = 'DELETE';

export function prepareEndpoints(endpoints) {
    if (endpoints.pages) {
        [...endpoints.pages.values()].forEach(page => {
            page.fullUrl = `${endpoints.url}${page.url}`;
        });
    }
    
    if (endpoints.api) {
        Object.values(endpoints.api).forEach(api => {
            api.fullUrl = `${API_PREFIX}${endpoints.url}${api.url}`;
        });
    }

    if (endpoints.app) {
        Object.values(endpoints.app).forEach(app => {
            app.fullUrl = `${endpoints.url}${APP_PREFIX}${app.url}`;
            app.partialUrl = `${APP_PREFIX}${app.url}`;
        });
    }
}