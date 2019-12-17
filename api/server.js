const express = require('express');

const sessions = require('express-session');
const KnexSessionStore = require('connect-session-knex')(sessions);

const apiRouter = require('./api-router.js');
const knex = require('../database/dbConfig');

const configureMiddleware = require('./configure-middleware.js');

const server = express();

const sessionConfig = {
    name: 'wannaCookie',
    secret: 'Keep it secret, keep it safe',
    saveUninitialized: true,
    resave: false,

    store: new KnexSessionStore({
        knex,
        tablename: 'sessions',
        createtable: true,
        sidfieldname: 'sid',
        clearInterval: 5000 * 60 * 10 
    }),

    cookie: {
        maxAge: 5000 * 60 * 10,
        secure: false,
        httpOnly: true,
    }
}

configureMiddleware(server);
server.use(sessions(sessionConfig));

server.use('/api', apiRouter);

module.exports = server;
