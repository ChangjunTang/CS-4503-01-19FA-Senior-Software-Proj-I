const express = require('express');
const router = express.Router();

router.use('/api/v1', require('./apiv1'));
router.use('/', require('./root'));
router.use(function (req, res) {
    res.status(404).render('404', { nonce: res.locals.nonce });
});

module.exports = router;