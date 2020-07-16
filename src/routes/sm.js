const express = require('express')
const router = express.Router()
const hydra = require('../hydra')
const util = require('util')

// agent request api
router.post('/agent-request', async function (req, res, next) {
  console.log(`getting request from to start SocialMiner Agent Request API request`)
  try {
    const response = await hydra({
      service: process.env.hydra_lab_config_service,
      path: 'sm/agent-request',
      method: 'post',
      body: req.body
    })
    
    if (response.statusCode < 200 || response.statusCode >= 300) {
      console.error('failed to send agent request API request', response)
      return res.status(500).send(response.error)
    } else {
      return res.status(200).send(response.results)
    }
  } catch (error) {
    console.error('failed to send agent request API request', error)
    return res.status(500).send({error})
  }
})

// task request api
router.post('/task-request', async function (req, res, next) {
  console.log(`getting request to start SocialMiner Task Request`)
  try {
    const response = await hydra({
      service: process.env.hydra_lab_config_service,
      path: 'sm/task-request',
      method: 'post',
      body: req.body
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

module.exports = router
