const express = require('express')
const router = express.Router()
// const provision = require('../models/provision')
const dcloud = require('../models/provision/dcloud')
const db = require('../models/db')

// get provision status
router.get('/', async function (req, res) {
  try {
    // console.log('request to get provision status for', req.user.username, `(${req.user.id})...`)
    const username = req.user.username
    const userId = req.user.id
    // get provision status
    // const body = await provision.getStatus({username, userId})
    // const body = {
    //   provisioned: true
    // }
    // get provision info from local db, matching either username or userId
    const query = { $or: [ {username}, {userId} ] }
    const projection = { _id: 0 }
    const body = (await db.findOne('toolbox', 'provision', query, {projection})) || {}
    // console.log('successfully got provision status for', req.user.username, `(${req.user.id})`)
    // return OK with body
    return res.status(200).send(body)
  } catch (e) {
    // error during processing
    console.log('failed to get provision status for', req.user.username, `(${req.user.id}):`, e.message)
    return res.status(500).send({body: e.message})
  }
})

// provision user for dcloud
router.post('/', async function (req, res) {
  console.log(`starting provision for ${req.user.username} (${req.user.id})...`)
  // is admin user using switch-user?
  const isSu = req.user.suJwt
  // get ldap account password from body
  let password = req.body.password
  // validate input
  // ignore password when admin using switch-user
  if (!password && !isSu) {
    console.log(`failed to provision ${req.user.username} (${req.user.id}): request body did not contain password.`)
    return res.status(400).send('Request body should have property "password"')
  }
  try {
    // when admin using switch-user, set password null to skip the ldap user
    // creation step. this allows admin to re-provision user without changing
    // or setting the user password
    if (isSu) {
      password = null
    }
    // start provision and continue
    const results = await dcloud(req.user, password)
    // log when provision async task is complete
    console.debug(`successfully finished provision for ${req.user.username} (${req.user.id}). results:`, results)
    // update provision database for user
    const query = {
      userId: req.user.id
    }
    // add userId to data that we are saving to database
    results.userId = req.user.id

    try {
      await db.upsert('toolbox', 'provision', query, results)
    } catch (e) {
      console.log('failed to add provision flag to database:', e.message)
    }
    // try to insert first, if user's cumulus config does not exist
    try {
      // make sure _id is not set
      delete results._id
      await db.upsert('toolbox', 'cumulus.config', query, results)
      console.log('successfully created user', req.user.id, 'cumulus config')
    } catch (e) {
      console.log('user', req.user.id, 'cumulus config exists. updating it...')
      // update user demo config for cumulus/branding website
      try {
        // make sure _id is not set
        delete results._id
        await db.updateOne('toolbox', 'cumulus.config', query, {
          $set: results
        })
        console.log('successfully updated cumulus config for user', req.user.id, ':', results)
      } catch (e) {
        console.log('failed to update cumulus config for user', req.user.id, ':', e.message)
      }
    }

    // return ACCEPTED now. user should check the status asynchronously.
    return res.status(202).send()
  } catch (e) {
    // error during processing
    console.log(`failed to finish provision ${req.user.username} (${req.user.id}):`, e.message)
    return res.status(500).send(e.message)
  }
})

module.exports = router
