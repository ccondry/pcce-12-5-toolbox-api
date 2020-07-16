const express = require('express')
const router = express.Router()
const hydra = require('../hydra')
const util = require('util')

// list ECE queues that agent is in
router.get('/queues', async function (req, res, next) {
  console.log(`getting request from ${req.user.username} for queues list for username ${req.query.username} in eGain`)
  // TODO validate user owns agent?
  try {
    // get list of agents for this user by searching based on user's ID
    const response = await hydra({
      service: process.env.hydra_lab_config_service,
      path: 'egain/queues',
      query: {username: req.query.username}
    })
    if (response.statusCode < 200 || response.statusCode >= 300) {
      return res.status(500).send(response.results)
    } else {
      return res.status(200).send(response.results)
    }
  } catch (error) {
    return res.status(500).send({error})
  }
})

// set concurrent task limit
router.post('/concurrentTaskLimit', async function (req, res, next) {
  // TODO validate user owns agent
  const userId = req.body.userId
  const queueId = req.body.queueId
  const concurrentTaskLimit = req.body.concurrentTaskLimit

  try {
    // verify user owns agent ID specified
    console.log(`received request from ${req.user.username} to set concurrent task limit for user ID ${userId} in queue ID ${req.body.queueId} in eGain`)
    const response = await hydra({
      service: process.env.hydra_lab_config_service,
      path: 'egain/concurrent-task-limit',
      method: 'post',
      body: {userId, queueId, concurrentTaskLimit}
    })
    return res.status(response.statusCode).send(response.results)
  } catch (error) {
    return res.status(500).send({error})
  }
})

module.exports = router
