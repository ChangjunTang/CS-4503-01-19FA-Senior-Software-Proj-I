const log = require('./loggers').log;
const express = require('express');
const session = require('express-session');
const app = express();
const port = 3000;

var config = {
    apiKey: "AIzaSyDcPUV7GN5aLzWnUrst7-pU0WHNxta0Qbs",
    authDomain: "jjbp-bot.firebaseapp.com",
    databaseURL: "https://jjbp-bot.firebaseio.com",
    projectId: "jjbp-bot",
    storageBucket: "jjbp-bot.appspot.com",
    messagingSenderId: "757073654109"
};
// initialize the firebase app
var firebase = require("firebase");
firebase.initializeApp(config);
// save the firebase database to a variable
var database = firebase.database();

/*
​
firebase.auth().createUserWithEmailAndPassword(email, password).then(function(){
    // Success
})
.catch(function(error) {
    // Failed
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
});
​
*/


// Logs all requests to the console
app.use(function (req, res, next) {
    log(`${req.ip} ${req.method} ${req.originalUrl}`);
    next();
});
app.use(session({
    // Will need to change these settings later
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('static'));

app.get('/', function (req, res) {
    if (req.session.loggedin) {
        res.send(`Welcome back ${req.session.username}`);
    }
    else {
        res.sendFile(`${__dirname}/views/index.html`);
    }
});

app.get('/login', function (req, res) {
    res.sendFile(`${__dirname}/views/signIn.html`);
});

app.post('/login', function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

	firebase.auth().signInWithEmailAndPassword(username, password).then(function(){
		//Success
		req.session.loggedin = true;
		req.session.username = username;
		res.redirect('/');
	})
	.catch(function() {
		//Failed
		res.send('Incorrect username and/or password!');
	});

});

app.listen(port, function () {
    console.log(`Listening on port ${port}`);
});