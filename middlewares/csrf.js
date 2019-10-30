const crypto = require('crypto');

const defaultOptions = {
    ignoredMethods: ['GET', 'HEAD', 'OPTIONS']
}

function csrf(options = defaultOptions) {
    return function (req, res, next) {
        const ignoredMethods = new Set(options.ignoredMethods);

        req.getToken = function () {
            return hash(req.sessionID);
        }

        csrfToken = req.body._csrf || req.headers['csrf-token'];

        if (!ignoredMethods.has(req.method) && csrfToken !== hash(req.sessionID)) {
            if (req.originalUrl.includes('api')) {
                res.json({
                    error: {
                        message: 'No CSRF token'
                    }
                });
            }
            else {
                res.redirect('/login?error=csrf');
            }
        }
        else {
            next();
        }
    }
}

function hash(str) {
    return crypto
        .createHash('sha256')
        .update(str)
        .digest('base64');
}

module.exports = csrf;