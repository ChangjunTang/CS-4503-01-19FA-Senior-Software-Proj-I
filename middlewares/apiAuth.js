function apiAuth(req, res, next) {
    if (!req.session.loggedin) {
        res.status(401)
            .json({
                status: 'fail',
                message: 'unauthorized'
            });
    }
    else {
        next();
    }
}

module.exports = apiAuth;