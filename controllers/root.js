const express = require('express');
const auth = require('../middlewares/auth');
const users = require('../models/users');
const router = express.Router();

router.use(require('csurf')());
router.use(require('../middlewares/superRender'));
router.use(function (err, req, res, next) {
    if (err.code !== 'EBADCSRFTOKEN') return next(err);

    res.redirect('/login?error=csrf');
});

router.get('/', auth, function (req, res) {
    res.superRender('homepage', {
        pageTitle: 'Home',
        username: req.session.username
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

router.get('/passwordStorage', function (req, res) {
    res.superRender('passwordStorage');
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
            .catch(function () {
                res.redirect('/forgotPass?error=incorrect_user');
            });
    });

router.get('/restTest', function (req, res) {
    res.superRender('restTest');
})

router.get('/signout', function (req, res) {
    req.session.destroy(() => res.redirect('/login'));
});

module.exports = router;