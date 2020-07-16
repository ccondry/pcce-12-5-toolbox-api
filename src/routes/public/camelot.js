const express = require('express')
const router = express.Router()
const tokens = require('../../models/tokens')
const model = require('../../models/camelot')

router.get('/phone', async function (req, res) {
  console.log('request to GET /public/camelot/phone', req.body)

  // look for the bearer token in the authorization header
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
    // no token
    return res.status(403).send({error: 'You must provide an authorization token.'})
  }

  try {
    // validate token
    const validToken = await tokens.get({token, type: 'camelot'})
    // console.log('validToken', validToken)
  } catch (e) {
    console.error('failed to validate token:', e.message)
    // invalid token
    return res.status(403).send(e.message)
  }

  // token is valid
  try {
    // get camelot phones list from database
    const phones = await model.getPhones()
    try {
      // check if client wants camelot server phonelist.txt format
      if (req.query.camelot.toLowerCase() === 'true') {
        // format for camelot server like this:
        // 10701234 file:///root/agent_audio_sandra.wav
        // 10721234 file:///root/agent_audio_josh.wav
        const formattedPhones = phones.map(v => `${v.extension}${v.audioUrl ? ' ' + v.audioUrl : ''}`).join('\r\n')
        return res.set('Content-Type', 'text/plain').status(200).send(formattedPhones)
      }
    } catch (e) {
      console.error('failed to format Camelot phones list:', e.message)
      return res.status(500).send(e.message)
    }
    // return phones to client as JSON
    return res.status(200).send(phones)
  } catch (e) {
    console.error('failed to get Camelot phones list:', e.message)
    return res.status(500).send(e.message)
  }
})

module.exports = router
