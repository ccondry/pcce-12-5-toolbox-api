const express = require('express')
const router = express.Router()
const ldap = require('../models/ldap')

// reset password
router.post('/', async function (req, res) {
  try {
    // ldap username cannot be more than 20 characters
    let username = req.user.username
    if (username.length > 20) {
      username = req.user.username.slice(0, 20)
    }
    // set user VPN password in LDAP
    await ldap.resetPassword({
      adminDn: process.env.LDAP_ADMIN_DN,
      adminPassword: process.env.LDAP_ADMIN_PASSWORD,
      newPassword: req.body.password,
      username
    })
    return res.status(200).send()
  } catch (e) {
    console.log('failed to reset password for', req.user.username, `(${req.user.id}):`, e.message)
    return res.status(500).send({message: e.message})
  }
})

module.exports = router