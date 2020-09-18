const express = require('express')
const router = express.Router()
const db = require('../models/db')
const vvb = require('../models/vvb')

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
    } else {
      // create config
      // copy request body
      const body = JSON.parse(JSON.stringify(req.body))
      // append user ID
      body.userId = userId
      await db.insertOne('toolbox', 'cumulus.config', body)
      console.log('Successfully created Cumulus configuration for user', userId)
    }
    // success
    res.status(202).send()
  } catch (e) {
    // failed
    console.error('failed to update Cumulus demo configuration for user', userId, ':', e.message)
    return res.status(500).send(e.message)
  }

  try {
    // get full vertical details
    const verticalConfig = await vertical.get(req.body.vertical)
    
    // get GCP key for this project ID from cumulus-api
    const key = await gcpCredential.get(verticalConfig.gcpProjectId)

    // create service account data object
    const serviceAccount = {
      name: verticalConfig.gcpProjectId,
      description: `${req.user.username} ${userId}`,
      key
    }

    // sync asr, tts, nlp service accounts
    createServiceAccount('asr', serviceAccount).then(e => {
      console.log('failed to sync VVB CVA ASR account:', e.message)
    })
    createServiceAccount('tts', serviceAccount).then(e => {
      console.log('failed to sync VVB CVA TTS account:', e.message)
    })
    createServiceAccount('nlp', serviceAccount).then(e => {
      console.log('failed to sync VVB CVA NLP account:', e.message)
    })
  } catch (e) {
    console.log('failed to sync VVB CVA service accounts:', e.message)
  }
})

async function createServiceAccount (type, serviceAccount) {
  let existing
  try {
    // look for existing account
    existing = await vvb.cva[type].getServiceAccount(serviceAccount.name)
  } catch (e) {
    // not found?
    if (e.message.startsWith('404')) {
      console.log(type + ' service account not found. creating it...')
      // create
      await vvb.cva[type].createServiceAccount(serviceAccount)
    }
  }
  // update existing NLP
  if (existing) {
    console.log('found existing ' + type + ' service account. updating it...')
    await vvb.cva[type].updateServiceAccount(serviceAccount)
  }
}

module.exports = router
