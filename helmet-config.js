const helmetConfig = {
    referrerPolicy: true,
    frameguard: { action: 'deny' },
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'none'"],
            styleSrc: [
                "'self'",
                'stackpath.bootstrapcdn.com',
                (req, res) => `'nonce-${res.locals.nonce}'`],
            scriptSrc: [
                "'self'",
                (req, res) => `'nonce-${res.locals.nonce}'`
            ],
            connectSrc: ["'self'"],
            imgSrc: ["'self'"],
        }
    }
}

module.exports = helmetConfig;