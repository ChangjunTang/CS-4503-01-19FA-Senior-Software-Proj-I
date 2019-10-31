const express = require('express');
const passwords = require('../models/passwords');
const router = express.Router();

router.use(require('csurf')({ ignoreMethods: [] }));
router.use(require('../middlewares/apiAuth'));
router.use(function (err, req, res, next) {
    if (err.code !== 'EBADCSRFTOKEN') return next(err);

    res.json({ error: { message: 'No CSRF token' } });
});

router.route('/passwords')
    // Add a new password for a user
    .post(function (req, res) {
        json = {
            method: 'passwords.post'
        }

        try {
            passwords.add(
                req.session.username,
                req.body.title,
                req.body.username,
                req.body.password);
        }
        catch (e) {
            json.error = { message: e.message }
        }

        res.json(json);
    })
    // Delete a password for a user
    .delete(function (req, res) {
        json = {
            method: 'passwords.delete'
        };

        try {
            passwords.remove(
                req.session.username,
                req.body.title,
                req.body.username);
        }
        catch (e) {
            json.error = { message: e.message }
        }

        res.json(json);
    })
    // Fetch passwords for a user
    .get(function (req, res) {
        let items = passwords.get(req.session.username);

        res.json({
            method: 'passwords.get',
            data: { items }
        });
    });

router.use(function (req, res) {
    res.status(404)
        .json({
            error: { message: 'Endpoint Not Found' }
        });
});

module.exports = router;