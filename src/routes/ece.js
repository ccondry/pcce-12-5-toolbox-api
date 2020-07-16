const express = require('express')
const router = express.Router()
const ece = require('../models/ece')

router.post('/agents/:agent/modify', ece.modifyAgent)
router.post('/agents/:agent/license/add', ece.addAgentLicense)
router.post('/agents/:agent/role/add', ece.addAgentRole)
// list ECE queues that agent is in
router.get('/queues', ece.getUserQueues)
// set concurrent task limit
router.post('/concurrent-task-limit', ece.setConcurrentTaskLimit)
router.get('/role', ece.findRole)
router.post('/agents', ece.addIcmAgent)
router.patch('/agents/:agent', ece.modifyAgent)

module.exports = router
