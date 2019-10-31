const uuidv4 = require('uuid/v4')

function scriptNonce(req, res, next) {
    res.locals.nonce = uuidv4()
    next()
}

module.exports = scriptNonce;