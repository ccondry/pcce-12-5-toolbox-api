const express = require('express')
const router = express.Router()
const hydra = require('../hydra2')

// retrieve list of camelot phones
router.get('/phone', async function (req, res, next) {
  try {
    const response = await hydra({
      service: process.env.hydra_lab_config_service,
      path: 'camelot/phone',
      method: 'get'
    })
    return res.status(200).send(response)
  } catch (e) {
    console.log('failed to get list of camelot phones:', e.message)
    return res.status(500).send(e.message)
  }
})

// add to list of camelot phones
router.post('/phone', async function (req, res, next) {
  try {
    const response = await hydra({
      service: process.env.hydra_lab_config_service,
      path: 'camelot/phone',
      method: 'post',
      data: req.body
    })
    return res.status(201).send(response)
  } catch (e) {
    console.log('failed to add phone to list of camelot phones:', e.message)
    return res.status(500).send(e.message)
  }
})

// remove phone from camelot phones
router.delete('/phone/:line', async function (req, res, next) {
  try {
    const response = await hydra({
      service: process.env.hydra_lab_config_service,
      path: 'camleot/phone/' + req.params.line,
      method: 'delete'
    })
    return res.status(202).send(response)
  } catch (e) {
    console.log('failed to delete phone from list of camelot phones:', e.message)
    return res.status(500).send(e.message)
  }
})

module.exports = router
