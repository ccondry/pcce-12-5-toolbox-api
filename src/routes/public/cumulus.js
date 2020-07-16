const express = require('express')
const router = express.Router()
const tokens = require('../../models/tokens')
const routing = require('../../models/routing')
const cumulus = require('../../models/cumulus')

router.get('/:userId', async function (req, res) {
  let userId = req.params.userId
  console.log('request to GET user Cumulus demo config on /public/cumulus for', userId)

  // // look for the bearer token in the authorization header
  // let authorization
  // if (req.headers.authorization && req.headers.authorization.length) {
  //   const parts = req.headers.authorization.split(' ')
  //   if (parts.length === 2) {
  //     // has Bearer auth string for token
  //     authorization = parts[1]
  //   }
  // }

  // // find token
  // const token = authorization || req.query.token || req.body.token
  // if (!token) {
  //   // no token
  //   return res.status(403).send({error: 'You must provide an authorization token.'})
  // }

  // try {
  //   // validate token
  //   const validToken = await tokens.get({token, type: 'mm', grant: 'get-user-config'})
  //   // console.log('validToken', validToken)
  // } catch (e) {
  //   console.error('failed to validate token:', e.message)
  //   // invalid token
  //   return res.status(403).send(e.message)
  // }

  // token is valid
  try {
    // is userId not a 4-digit user ID?
    if (userId.length > 4) {
      // maybe it's a facebook ID or phone number. look it up in contacts first
      const contact = await routing.get({contact: userId})
      console.log('found contacts', contact)
      if (contact.length) {
        // set userId with contact data
        console.log('updating userId from', userId, 'to', contact[0].userId)
        userId = contact[0].userId
      }
    }
    console.log('getting local cumulus config for userId', userId)
    // get cumulus user config
    const config = await cumulus.get(userId)
    // return phones to client as JSON
    return res.status(200).send(config)
  } catch (e) {
    console.error('failed to get cumulus config:', e.message)
    return res.status(500).send(e.message)
  }
})

module.exports = router
