const log = require('./loggers').log;
const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('static'));

app.listen(port, function () {
    console.log(`Listening on port ${port}`);
});