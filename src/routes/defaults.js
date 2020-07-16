const express = require('express')
const router = express.Router()
const model = require('../models/defaults')

router.get('/', async function (req, res, next) {
  console.log('getting defaults for', req.query, '...')
  try {
    const response = await model.get(req.query)
    if (!response) {
      // not found
      return res.status(404).send('defaults not found for ' + JSON.stringify(req.query))
    }
    // found data
    console.log('successfully got defaults for', req.query)
    // return the data
    return res.status(200).send(response)
  } catch (e) {
    console.log('failed to get defaults for', req.query, e.message)
    return res.status(500).send(e.message)
  }
})

router.put('/', async function (req, res, next) {
  // only admins can use this
  if (!req.user.admin) {
    console.log('access denied - request to save defaults for', req.query, 'denied because user is not an admin!')
    return res.status(403).send('only admins may use this API')
  }
  const body = {
    type: req.query.type,
    demos: req.body
  }
  console.log('saving defaults for', req.query, '...')
  try {
    const response = await model.save(req.query, body)
    // successfully saved data
    console.log('successfully saved defaults for', req.query)
    return res.status(response.statusCode).send(response.results)
  } catch (e) {
    if(e.codeName === 'DuplicateKey') {
      // conflict
      console.log('failed to save defaults - duplicate key error:', e.message)
      return res.status(409).send(e.message)
    }
    // any other error
    console.log('failed to save defaults:', e.message)
    return res.status(500).send(e.message)
  }
})

module.exports = router
