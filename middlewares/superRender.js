function superRender(req, res, next) {
    res.superRender = function (view, locals, callback) {
        locals = {
            ...locals,
            ...{
                csrfToken: req.csrfToken(),
                nonce: res.locals.nonce
            }
        }

        res.render(view, locals, callback);
    }

    next();
}

module.exports = superRender;