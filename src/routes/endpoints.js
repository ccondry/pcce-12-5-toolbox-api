const express = require('express')
const router = express.Router()
const endpoints = require('../models/endpoints')

router.get('/', async function (req, res, next) {
  try {
    console.log(`GET endpoints`)
    return res.status(200).send(endpoints)
  } catch (error) {
    console.log('GET endpoints failed:', error.message)
    return res.status(500).send(error.message)
  }
})

module.exports = router
