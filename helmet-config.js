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
                'https://code.jquery.com/',
                'https://cdnjs.cloudflare.com/ajax/libs/',
                'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/',
                (req, res) => `'nonce-${res.locals.nonce}'`
            ],
            connectSrc: ["'self'"],
            imgSrc: [
                "'self'",
                'https://i.stack.imgur.com/dDQbw.png'
            ],
        }
    }
}

module.exports = helmetConfig;