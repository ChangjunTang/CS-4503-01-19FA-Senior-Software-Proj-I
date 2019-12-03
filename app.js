const express = require('express');
const app = express();

require('./firebase-config');

require('nunjucks').configure('views', {
    autoescape: true,
    express: app
});
app.set('view engine', 'njk');
app.set('views', `${__dirname}/views`);

app.use(require('express-session')(require('./session-config')));
app.use(express.urlencoded({ extended: true }));
app.use(require('./middlewares/routeLogger'));
app.use(require('./middlewares/scriptNonce'));
app.use(require('helmet')(require('./helmet-config')));
app.use(require('./middlewares/keepSessionAlive'));
app.use(express.static('static'));
app.use(require('./controllers'));

const port = 3000;
app.listen(port, function () {
    console.log(`Listening on port ${port}`);
});