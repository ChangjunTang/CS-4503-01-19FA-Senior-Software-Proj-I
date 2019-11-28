const sessionConfig = {
    // Will need to change these settings later
    secret: 'secret',
    name: 'SID',
    resave: false,
    saveUninitialized: true,
    cookie: {
        sameSite: true,
        maxAge: 300000
    }
}

module.exports = sessionConfig;