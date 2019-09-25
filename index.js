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

app.get('/signup', function (req, res) {
    res.sendFile(`${__dirname}/views/signUp.html`);
});


app.post('/login', function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    firebase.auth().signInWithEmailAndPassword(username, password).then(function () {
        //Success
        req.session.loggedin = true;
        req.session.username = username;
        res.redirect('/');
    })
        .catch(function () {
            //Failed
            // res.send('Incorrect username and/or password!');
            res.redirect('/login?error=incorrect_user');
        });

});

app.post('/signup', function (req, res) {
    const new_username = req.body.username;
    const new_password = req.body.password;
    const new_password2 = req.body.password2;

    if (new_password == new_password2) {
        firebase.auth().createUserWithEmailAndPassword(new_username, new_password).then(function () {
            // Success
            res.send('New account created :) Please login');
            //res.sendFile(`${__dirname}/views/signIn.html`);
        })
            .catch(function (error) {
                // Failed
                var errorCode = error.code;
                var errorMessage = error.message;

                if (errorCode == 'auth/email-already-in-use') {
                    res.send('An account already exists for this email.');
                }
                else if (errorCode == 'auth/invalid-email') {
                    res.send('Invalid email!');
                }
                else if (errorCode == 'auth/weak-password') {
                    res.send('Weak password!');
                }
                else {
                    res.send('AHHHH SOMETHING WENT WRONG!!');
                }
            });
    }
    else {
        res.send('Passwords do not match!');
    }
});

app.listen(port, function () {
    console.log(`Listening on port ${port}`);
});