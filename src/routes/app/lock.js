const express = require('express')
const router = express.Router()
const ldap = require('../../models/ldap')

// lock a user account, from a request from the toolbox-login-api
router.post('/', async function (req, res) {
  console.log('request to POST /app/lock', 'by application', req.user.application)
  // validate token
  if (!req.user.application === 'toolbox-login-api' || !req.user.grant.includes('lock-user')) {
    // valid JWT, but wrong application/grant
    console.log('denied access to POST /app/lock for application', req.user.application)
    return res.status(403).send('You do not have permission to access this resource.')
  }

  // token is valid

  // validate data
  if (!req.query || !req.query.username || !req.query.lock) {
    console.log('invalid input for POST /app/lock for application', req.user.application, 'req.query was', req.query)
    return res.status(400).send('"username" and "lock" are required query parameters.')
  }

  try {
    console.log('sending lock account request to', process.env.hydra_lab_config_service)
    // reset the user password in LDAP
    await hydra({
      service: process.env.hydra_lab_config_service,
      method: 'post',
      path: '/ldap/lock',
      body: {
        username: req.query.username,
        lock: req.query.lock
      }
    })

    // return 202 ACCEPTED
    return res.status(202).send()
  } catch (e) {
    // error
    // redact password before logging
    console.error('failed to POST /app/lock by application', req.user.application, 'with query', req.query, ':', e)
    return res.status(e.statusCode).send(e.message)
  }
})

module.exports = router
