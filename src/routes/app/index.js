const express = require('express')
const router = express.Router()
const password = require('./password')
const lock = require('./lock')

// remotely set user password from toolbox-login-api
router.use('/password', password)
// remotely lock/unlock user account from toolbox-login-api
router.use('/lock', lock)

module.exports = router
