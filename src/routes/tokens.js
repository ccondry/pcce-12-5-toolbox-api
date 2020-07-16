var express = require('express')
var router = express.Router()
const hydra = require('../hydra2')
const moment = require('moment')

// admin API to create API tokens
router.post('/', async function (req, res, next) {
  if (!req.user.admin) {
    return res.status(403).send({error: 'Only administrators may use this API.'})
  }
  try {
    console.log('create token request received.')
    const body = req.body
    // set username
    body.creator = req.user.username
    // generate custom token
    const tokenRequest = await hydra({
      service: process.env.hydra_lab_config_service,
      path: 'tokens/generate',
      method: 'post',
      body
    })
    return res.status(201).send(tokenRequest)
  } catch (error) {
    console.error('failed to create API token:', e.message)
    return res.status(500).send(e.message)
  }
})

// admin API to get existing API tokens
router.get('/', async function (req, res, next) {
  if (!req.user.admin) {
    return res.status(403).send({error: 'Only administrators may use this API.'})
  }
  try {
    console.log('get tokens request received.')
    // get tokens
    const tokenRequest = await hydra({
      service: process.env.hydra_lab_config_service,
      path: 'tokens',
      method: 'get'
    })
    return res.status(200).send(tokenRequest)
  } catch (error) {
    console.error('failed to get API tokens:', e.message)
    return res.status(500).send(e.message)
  }
})

module.exports = router
