require('dotenv').config();

const { PORT = 3000 } = process.env

const express = require('express');
const server = express();
const bodyParser = require('body-parser');
server.use(bodyParser.json());

const { client } = require('./db');

const apiRouter = require('./api');
server.use('/api', apiRouter);

/* ERROR HANDLING */

// 404
server.use('*', (req, res, next) => {
    res.status(404);
    res.send({ error: 'route not found' });
});

// 500
server.use((error, req, res, next) => {
    res.status(500);
    res.send(error);
});

// CLIENT CONNECT
server.listen(PORT, () => {
    console.log('server is up');
    client.connect();
});