const express = require('express')
const router = express.Router()
const hydra = require('../hydra2')

router.get('/config', async function (req, res, next) {
  console.log(`GET Mobile Connect config`)
  try {
    const response = await hydra({
      service: process.env.hydra_mobile_connect_service,
      path: 'config'
    })
    return res.status(200).send(response)
  } catch (error) {
    console.log('Failed to get Mobile Connect config:', error.message)
    return res.status(500).send(error.message)
  }
})

router.get('/brands', async function (req, res, next) {
  console.log(`GET mobile connect brands`)
  try {
    const response = await hydra({
      service: process.env.hydra_mobile_connect_service,
      path: 'brands',
      query: req.query
    })
    return res.status(200).send(response)
  } catch (error) {
    console.log('Failed to get Mobile Connect brands:', error.message)
    return res.status(500).send(error.message)
  }
})

// admin - set brands
router.post('/brands', async function (req, res, next) {
  console.log(`POST mobile-connect brands by user ${req.user.username}`)
  const body = req.body
  // add request username to data
  body.username = req.user.username
  try {
    const response = await hydra({
      method: 'post',
      service: process.env.hydra_mobile_connect_service,
      path: 'brands',
      body
    })
    return res.status(202).send(response)
  } catch (error) {
    console.log('Failed to save Mobile Connect brands:', error.message)
    return res.status(500).send(error.message)
  }
})

router.get('/localizations', async function (req, res, next) {
  console.log(`GET mobile connect localizations`)
  try {
    const response = await hydra({
      service: process.env.hydra_mobile_connect_service,
      path: 'localizations',
      query: req.query
    })
    return res.status(200).send(response)
  } catch (error) {
    console.log('Failed to get Mobile Connect localizations:', error.message)
    return res.status(500).send(error.message)
  }
})

// set localizations
router.post('/localizations', async function (req, res, next) {
  console.log(`POST mobile-connect localizations by user ${req.user.username}`)
  const body = req.body
  // add request username to data
  body.username = req.user.username
  try {
    const response = await hydra({
      method: 'post',
      service: process.env.hydra_mobile_connect_service,
      path: 'localizations',
      body
    })
    return res.status(202).send(response)
  } catch (error) {
    console.log('Failed to save Mobile Connect localizations:', error.message)
    return res.status(500).send(error.message)
  }
})

module.exports = router
