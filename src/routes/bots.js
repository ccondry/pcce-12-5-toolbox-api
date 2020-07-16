const express = require('express')
const router = express.Router()
const hydraRequest = require('../hydra/request')

router.get('/', hydraRequest(process.env.hydra_lab_config_service, 'bots'))

module.exports = router
