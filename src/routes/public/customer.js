const express = require('express')
const router = express.Router()
const logger = require('../../models/logger')
const tokens = require('../../models/tokens')
const routing = require('../../models/routing')

// check if a contact point is registered to this demo session as a customer
// contact point = email, phone, FB ID, etc.
router.get('/:contact', async function (req, res) {
  // prepare log data for log object
  const clientIp = req.clientIp
  const method = req.method
  const host = req.get('host')
  const path = req.originalUrl
  const url = req.protocol + '://' + host + path
  const operation = 'get customer'
  const query = req.query
  const params = req.params
  // const body = req.body

  console.log('client at IP', req.clientIp, 'requested', operation)

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
  const token = authorization
  if (!token) {
    // no token
    const details = 'You must provide an authorization token.'
    // log it to db
    logger.log({clientIp, host, path, url, method, operation, status: 403, details, query, params})
    // return 403 UNAUTHORIZED
    return res.status(403).send(details)
  }

  try {
    // validate token
    await tokens.get({token, type: 'customer', grant: 'exists'})
    // console.log('validToken', validToken)
  } catch (e) {
    // invalid token
    const details = 'Failed to validate authorization token: ' + e.message
    // log it to db
    logger.log({clientIp, host, path, url, method, operation, status: 403, details, query, params})
    console.log(details)
    // return 403 UNAUTHORIZED
    return res.status(403).send(details)
  }

  // token is valid

  // get data from params
  const contact = req.params.contact

  // validate data
  if (!contact) {
    const details = '"contact" is a required parameter.'
    // log it to db
    logger.log({clientIp, host, path, url, method, operation, status: 400, details, query, params})
    // return 400 BAD_REQUEST
    return res.status(400).send(details)
  }

  try {
    // get customer routing information for contact
    const response = await routing.get({contact})
    let exists
    if (response.length) {
      // contact point is registered
      exists = true
    } else {
      // not registered
      exists = false
    }
    // error
    console.log(operation, 'successful. exists = ', exists)
    // log it to db
    logger.log({clientIp, host, path, url, method, operation, status: 200, details: {exists}, query, params})
    // return 200 OK with data
    return res.status(200).send({exists})
  } catch (e) {
    // error
    console.error('failed to', operation, e.message)
    // log it to db
    logger.log({clientIp, host, path, url, method, operation, status: e.statusCode, details: e.message, query, params})
    // return status sent by hydra
    return res.status(500).send(e.message)
  }
})

// register a customer for an instant demo user
router.post('/', async function (req, res) {
  // prepare log data for log object
  const clientIp = req.clientIp
  const method = req.method
  const host = req.get('host')
  const path = req.originalUrl
  const url = req.protocol + '://' + host + path
  const operation = 'register customer'
  const query = req.query
  const body = req.body

  console.log('client at IP', req.clientIp, 'requested', operation)

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
    const details = 'You must provide an authorization token.'
    // log it to db
    logger.log({clientIp, host, path, url, method, operation, status: 403, details, query, body})
    // return 403 UNAUTHORIZED
    return res.status(403).send(details)
  }

  try {
    // validate token
    await tokens.get({token, type: 'customer', grant: 'create'})
    // console.log('validToken', validToken)
  } catch (e) {
    // invalid token
    const details = 'Failed to validate authorization token: ' + e.message
    // log it to db
    logger.log({clientIp, host, path, url, method, operation, status: 403, details, query, body})
    console.log(details)
    // return 403 UNAUTHORIZED
    return res.status(403).send(details)
  }

  // token is valid

  // get data from query or from body
  const userId = body.userId || query.userId
  const contact = body.contact || query.contact

  // validate data
  if (!userId || !contact) {
    const details = '"contact" and "userId" are required parameters.'
    // log it to db
    logger.log({clientIp, host, path, url, method, operation, status: 400, details, query, body})
    // return 400 BAD_REQUEST
    return res.status(400).send(details)
  }

  // validate user ID is a 4-digit number
  if (userId.length !== 4 || isNaN(userId)) {
    const details = '"userId" must be a 4-digit number.'
    // log it to db
    logger.log({clientIp, host, path, url, method, operation, status: 400, details, query, body})
    // return 400 BAD_REQUEST
    return res.status(400).send(details)
  }

  try {
    // add customer routing information into database
    await routing.save({userId, contact})
    // return 201 CREATED
    return res.status(201).send()
  } catch (e) {
    // error
    console.error('failed to', operation, e.message)
    if (e.name === 'MongoError' && e.code === 11000) {
      // duplicate key error
      // find the current value and return it to the poor user
      // const existing = await db.findOne(collection, {contact: req.body.contact})
      // const person = req.body.userId === existing.userId ? 'you' : existing.userId
      // return res.status(409).send({error: 'That contact is already registered to ' + person})
      console.log('That contact is already registered.')
      // log it to db
      logger.log({clientIp, host, path, url, method, operation, status: 409, details: 'That contact is already registered.', query, body})
      return res.status(409).send('That contact is already registered.')
    } else {
      // some other error
      console.log(error.message)
      // log it to db
      logger.log({clientIp, host, path, url, method, operation, status: 500, details: e.message, query, body})
      return res.status(500).send(error.message)
    }
  }
})

module.exports = router
