function apiAuth(req, res, next) {
    if (!req.session.loggedin) {
        res.status(401)
            .json({
                error: { message: 'Unauthorized' }
            });
    }
    else {
        next();
    }
}

module.exports = apiAuth;