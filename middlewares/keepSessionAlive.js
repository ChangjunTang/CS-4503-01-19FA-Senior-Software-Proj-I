function keepSessionAlive(req, res, next) {
    req.session._garbage = Date();
    next();
}

module.exports = keepSessionAlive;