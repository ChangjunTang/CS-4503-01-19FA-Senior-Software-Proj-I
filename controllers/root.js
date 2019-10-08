const express = require('express');
const users = require('../models/users');
const router = express.Router();

router.get('/', function (req, res) {
    if (req.session.loggedin) {
        res.sendFile(`HomePage.html`, { root: `${__dirname}/../views` });
    }
    else {
        res.redirect('/login');
    }
});

router.route('/login')
    .get(function (req, res) {
        res.sendFile(`signIn.html`, { root: `${__dirname}/../views` });
    })
    .post(function (req, res) {
        users.authenticate(req.body.username, req.body.password)
            .then(function () {
                req.session.loggedin = true;
                req.session.username = req.body.username;
                res.redirect('/');

            })
            .catch(function () {
                res.redirect('/login?error=incorrect_user');
            });
    });

router.route('/signup')
    .get(function (req, res) {
        res.sendFile(`signUp.html`, { root: `${__dirname}/../views` });
    })
    .post(function (req, res) {
        users.create(req.body.username, req.body.password, req.body.password2)
            .then(function () {
                res.redirect('/login?success=account_created');
            })
            .catch(function (err) {
                if (err.code === 'auth/email-already-in-use') {
                    res.redirect('/signup?error=email_already_in_use');
                }
                else if (err.code === 'auth/invalid-email') {
                    res.redirect('/signup?error=invalid_email');
                }
                else if (err.code === 'auth/weak-password') {
                    res.redirect('/signup?error=weak_password');
                }
                else if (err.code === 'mismatched_pws') {
                    res.redirect('/signup?error=mismatched_pws');
                }
                else {
                    res.redirect('/signup?error=unexpected_err');
                }
            });
    });

router.get('/signout', function (req, res) {
    req.session.destroy(() => res.redirect('/login'));
});

module.exports = router;