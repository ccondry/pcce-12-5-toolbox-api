const express = require('express')
const router = express.Router()
const ldap = require('../../models/ldap')

// reset a user password, from a request from the toolbox-login-api
router.post('/', async function (req, res) {
  console.log('request to POST /app/password', 'by application', req.user.application)
  // validate token
  if (!req.user.application === 'toolbox-login-api' || !req.user.grant.includes('reset-password')) {
    // valid JWT, but wrong application/grant
    console.log('denied access to POST /app/pasword for application', req.user.application)
    return res.status(403).send('You do not have permission to access this resource.')
  }

  // token is valid

  // validate data
  if (!req.body || !req.body.username || !req.body.password) {
    return res.status(400).send('"username" and "password" are required JSON properties in the request body')
  }

  try {
    // reset the user password in LDAP
    await ldap.resetPassword({
      username: req.body.username,
      newPassword: req.body.password
    })

    // return 202 ACCEPTED
    return res.status(202).send()
  } catch (e) {
    // error
    // redact password before logging
    if (req.body && req.body.password) {
      req.body.password = '(redacted)'
    }
    console.error('failed to POST /app/customer by application', req.user.application, 'with request body', req.body, ':', e)
    return res.status(e.statusCode).send(e.message)
  }
})

module.exports = router
