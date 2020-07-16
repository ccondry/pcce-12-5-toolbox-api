// these APIs don't require JWT, instead implement their own auth token processing

const express = require('express')
const router = express.Router()

router.use('/sms', require('./sms'))
router.use('/camelot', require('./camelot'))
router.use('/cumulus', require('./cumulus'))
router.use('/customer', require('./customer'))

module.exports = router
