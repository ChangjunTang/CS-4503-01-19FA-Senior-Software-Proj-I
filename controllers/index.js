const express = require('express');
const router = express.Router();

router.use('/', require('./root'));
router.use('/api/v1', require('./apiv1'));

module.exports = router;