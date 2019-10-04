import 'idempotent-babel-polyfill';
import path from 'path';
import express from 'express';

import { createApiRouter } from './api/router';
import { createNutritionRouter } from './nutrition/router';

import endpoints from '../common/endpoints';
import { API_PREFIX } from '../common/endpoints/helpers';

class Main {
    constructor(config={}) {
        this.config = config;
        this.server = express();

        this.server.use(express.json());

        /* Keep API router last */
        this.setupNutritionRouter();
        this.setupApiRouter();

        this.setupStaticRouter();
        this.setupFrontendRouter();

        this.server.set('port', config.port);
    }

    run() {
        let server = this.server;
        server.listen(server.get('port'), function() {
          console.log('Express app is running on port', server.get('port'));
        });
    }

    setupApiRouter() {
        this.server.use(API_PREFIX, createApiRouter());
        console.log('Express serving api endpoints at ', API_PREFIX);
    }

    setupNutritionRouter() {
        this.server.use(endpoints.nutrition.url, createNutritionRouter());
        console.log('Express serving nutrition endpoints at ', endpoints.nutrition.url);
    }

    /**
     * Serves up all static files
     */
    setupStaticRouter() {
        this.server.use(express.static('./public'));
        console.log('Express serving static at', 'public');
    }

    /**
     * Handles all calls not mapped to a backend call
     */
    setupFrontendRouter() {
        this.server.use('/', (req, res) => {
            res.sendFile('src/client/index.html', { root: './' });
        });
        console.log('Express serving frontend');
    }
}

const server = new Main({
    port: process.env.PORT || 5000,
});
server.run();