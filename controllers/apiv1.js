const express = require('express');
const router = express.Router();

router.use(require('../middlewares/apiAuth'));

router.route('/passwords')
    // Add a new password for a user
    .post(function (req, res) {
        res.json({
            status: 'success',
            message: ''
        });
    })
    // Delete a password for a user
    .delete(function (req, res) {
        res.json({
            status: 'success',
            message: ''
        });
    })
    // Fetch passwords for a user
    .get(function (req, res) {
        res.json({
            status: 'success',
            message: ''
        });
    });

module.exports = router;