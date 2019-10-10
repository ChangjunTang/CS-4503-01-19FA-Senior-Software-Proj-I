const express = require('express');
const app = express();

require('./firebase-config');

require('nunjucks').configure('views', {
    autoescape: true,
    express: app
});
app.set('view engine', 'njk');
app.set('views', `${__dirname}/views`);

app.use(require('express-session')({
    // Will need to change these settings later
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));
app.use(express.urlencoded({ extended: true }));
app.use(require('./middlewares/routeLogger'));
app.use(express.static('static'));
app.use(require('./controllers'));

const port = 3000;
app.listen(port, function () {
    console.log(`Listening on port ${port}`);
});