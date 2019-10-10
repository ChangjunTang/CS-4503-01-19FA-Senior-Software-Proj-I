const log = require('../loggers').log;

// Logs all requests to the console
function routeLogger(req, res, next) {
    log(`${req.ip} ${req.method} ${req.originalUrl} ${req.sessionID}`);
    next();
};

module.exports = routeLogger;