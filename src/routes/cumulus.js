const express = require('express')
const router = express.Router()
const db = require('../models/db')

// get current user Cumulus configuration
router.get('/', async (req, res, next) => {
  const userId = req.user.id
  try {
    console.log('request to get Cumulus configuration for', userId)
    // get session config
    let response = await db.findOne('toolbox', 'cumulus.config', {userId})
    response = response || {
      vertical: 'finance'
    }
    // return config to client
    return res.status(200).send(response)
  } catch (e) {
    // failed
    console.error('failed to get Cumulus configuration for', userId, ':', e.message)
    return res.status(500).send(e.message)
  }
})

// update user's Cumulus configuration (vertical)
router.post('/', async (req, res, next) => {
  const userId = req.user.id
  try {
    console.log('POST request to configure Cumulus for user', userId)
    // does config for user exist?
    const exists = await db.findOne('toolbox', 'cumulus.config', {userId})
    if (exists) {
      // update config
      await db.updateOne('toolbox', 'cumulus.config', {userId}, {$set: req.body})
      console.log('Successfully updated Cumulus configuration for user', userId)
      return res.status(202).send()
    } else {
      // create config
      // copy request body
      const body = JSON.parse(JSON.stringify(req.body))
      // append user ID
      body.userId = userId
      await db.insertOne('toolbox', 'cumulus.config', body)
      console.log('Successfully created Cumulus configuration for user', userId)
      return res.status(202).send()
    }
  } catch (e) {
    // failed
    console.error('failed to update Cumulus demo configuration for user', userId, ':', e.message)
    return res.status(500).send(e.message)
  }
})

module.exports = router
