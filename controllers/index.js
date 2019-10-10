const express = require('express');
const router = express.Router();

router.use('/', require('./root'));
router.use('/api/v1', require('./apiv1'));
router.use(function (req, res) {
    res.status(404).render('404');
});

module.exports = router;