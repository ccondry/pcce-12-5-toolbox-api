const express = require('express')
const router = express.Router()
const sms = require('../../models/sms')
const tokens = require('../../models/tokens')

router.post('/', async function (req, res) {
  console.log('request to POST /public/sms - body = ', req.body)
  let authorization
  if (req.headers.authorization && req.headers.authorization.length) {
    const parts = req.headers.authorization.split(' ')
    if (parts.length === 2) {
      // has Bearer auth string for token
      authorization = parts[1]
    }
  }
  // find token
  const token = authorization || req.query.token || req.body.token
  if (!token) {
    return res.status(403).send({error: 'You must provide an authorization token.'})
  }

  if (!req.body.to) {
    // CVP is stupid and can't set the POST body properly. use query params.
    req.body.to = req.query.to
    req.body.from = req.query.from
    req.body.message = req.query.message
  }
  try {
    const type = 'send-sms'
    // validate token
    await tokens.get({token, type})
    // send sms
    return sms.send(req, res)
  } catch (e) {
    console.error(e)
    // invalid token
    return res.status(403).send({error: e})
  }
})

module.exports = router
