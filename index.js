const log = require('./loggers').log;
const express = require('express');
const app = express();
const port = 3000;

// Logs all requests to the console
app.use(function (req, res, next) {
    log(`${req.ip} ${req.method} ${req.originalUrl} ${req.cookies || 'No cookies'}`);
    next();
});

app.use(express.static('static'));

app.listen(port, function () {
    console.log(`Listening on port ${port}`);
});