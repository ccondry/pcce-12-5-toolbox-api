const express = require('express')
const router = express.Router()

const session = require('../models/dcloud-session')

router.get('/', async function (req, res, next) {
  try {
    const sessionInfo = await session.get()
    const dids = sessionInfo.dids.did
    // return just the DIDs
    return res.status(200).send({dids})
  } catch (error) {
    return res.status(500).send({error})
  }
})

module.exports = router
