const express = require('express');
const auth = require('../middlewares/auth');
const users = require('../models/users');
const date = require('../utilities/date');
const router = express.Router();

router.use(require('csurf')());
router.use(require('../middlewares/superRender'));
router.use(function (err, req, res, next) {
    if (err.code !== 'EBADCSRFTOKEN') return next(err);

    res.redirect('/login?error=csrf');
});

router.get('/', auth, function (req, res) {
    res.superRender('homepage', {
        pageTitle: `${req.session.username} Passwords`,
    });
});

router.route('/login')
    .get(function (req, res) {
        res.superRender('signIn', {
            pageTitle: 'Login',
        });
    })
    .post(function (req, res) {
        users.authenticate(req.body.username, req.body.password)
            .then(function () {
                req.session.loggedin = true;
                req.session.username = req.body.username;

                if (req.body.remember) {
                    req.session.cookie.expires = date.addMonths(new Date(), 1);
                }
                else {
                    req.session.cookie.maxAge = 300000;
                }

                res.redirect('/');

            })
            .catch(function () {
                res.redirect('/login?error=incorrect_user');
            });
    });

router.route('/signup')
    .get(function (req, res) {
        res.superRender('signUp', {
            pageTitle: 'Sign Up',
        });
    })
    .post(function (req, res) {
        users.create(req.body.username, req.body.password, req.body.password2)
            .then(function () {
                res.redirect('/login?success=account_created');
            })
            .catch(function (err) {
                res.redirect(`/signup?error=${err}`);
            });
    });

router.route('/forgotPass')
    .get(function (req, res) {
        res.superRender('forgotPass', {
            pageTitle: 'Forgot Password',
        });
    })
    .post(function (req, res) {
        users.password_reset(req.body.username)
            .then(function () {
                res.redirect('/login?success=email_sent');
            })
            .catch(function (err) {
                res.redirect(`/forgotPass?error=${err}`);
            });
    });

router.get('/signout', function (req, res) {
    req.session.destroy(() => res.redirect('/login'));
});

module.exports = router;