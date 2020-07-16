const express = require('express')
const router = express.Router()
const hydra = require('../hydra2')

router.get('/', async function (req, res, next) {
  console.log(`getting demo selectors for user ID ${req.user.id}`)
  // set user ID into query
  req.query.userId = req.user.id
  try {
    // send request to hydra service
    const response = await hydra({
      service: process.env.hydra_lab_config_service,
      path: 'demo-selectors',
      query: req.query
    })
    // return hydra response to HTTP client
    return res.status(200).send(response)
  } catch (e) {
    console.log(`error getting demo selectors for user ID ${req.user.id}`, e.message)
    return res.status(500).send(e.message)
  }
})

router.post('/', async function (req, res, next) {
  console.log(`saving demo selectors for user ID ${req.user.id}`)
  // copy req.query to use for for request body
  try {
    // send request
    const response = await hydra({
      method: 'post',
      service: process.env.hydra_lab_config_service,
      path: 'demo-selectors',
      body: {
        type: req.body.type,
        dnis: req.body.dnis,
        userId: req.user.id,
        data: req.body.data
      }
    })
    // return 202 ACCEPTED
    return res.status(202).send()
  } catch (e) {
    console.log(`error saving demo selectors for user ID ${req.user.id}`, e.message)
    return res.status(500).send(e.message)
  }
})

module.exports = router
