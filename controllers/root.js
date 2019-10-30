const express = require('express');
const auth = require('../middlewares/auth');
const csrf = require('../middlewares/csrf')();
const users = require('../models/users');
const router = express.Router();

router.use(csrf);

router.get('/', auth, function (req, res) {
    res.render('homepage', {
        pageTitle: 'Home',
        username: req.session.username
    });
});

router.route('/login')
    .get(function (req, res) {
        res.render('signIn', {
            pageTitle: 'Login',
            csrfToken: req.getToken()
        });
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
        res.render('signUp', {
            pageTitle: 'Sign Up',
            csrfToken: req.getToken()
        });
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


router.get('/passwordStorage', function (req, res) {
    res.render('passwordStorage');
});

router.route('/forgotPass')
    .get(function (req, res) {
        res.render('forgotPass', {
            pageTitle: 'Forgot Password',
            csrfToken: req.getToken()
        });
    })
    .post(function (req, res) {
        users.password_reset(req.body.username)
            .then(function () {
                res.redirect('/login?success=email_sent');
            })
            .catch(function () {
                res.redirect('/forgotPass?error=incorrect_user');
            });
    });

router.get('/restTest', function (req, res) {
    res.render('restTest', {
        csrfToken: req.getToken()
    });
})

router.get('/signout', function (req, res) {
    req.session.destroy(() => res.redirect('/login'));
});

module.exports = router;