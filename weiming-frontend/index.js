import Main from './src/server/main';

const server = new Main({
    port: process.env.PORT || 5000,
});
server.run();