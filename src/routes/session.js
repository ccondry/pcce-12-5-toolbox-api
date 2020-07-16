const express = require('express')
const router = express.Router()

const session = require('../models/dcloud-session')

// return the current environment's dCloud session ID and datacenter
router.get('/', async function (req, res, next) {
  try {
    const sessionInfo = await session.get()
    const datacenter = sessionInfo.datacenter
    const sessionId = sessionInfo.id
    return res.status(200).send({datacenter, sessionId})
  } catch (error) {
    return res.status(500).send({error})
  }
})

module.exports = router
