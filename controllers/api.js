const express = require('express');
const router = express.Router();

router.post('/add', function (req, res) {
    res.json({
        status: 'success',
        message: ''
    });
});

router.delete('/delete', function (req, res) {
    res.json({
        status: 'success',
        message: ''
    });
});

router.get('/get', function (req, res) {
    res.json({
        status: 'success',
        message: ''
    });
});

module.exports = router;