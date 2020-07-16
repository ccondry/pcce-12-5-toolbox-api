const express = require('express')
const router = express.Router()
const sms = require('../models/sms')

router.post('/', async function (req, res) {
  console.log(`getting request from ${req.user.username} to send SMS`)
  try {
    const response = await sms.send(req)
    return res.status(201).send(response)
  } catch (e) {
    console.log('failed to send SMS', e.message)
    return res.status(500).send(e.message)
  }
})

module.exports = router
