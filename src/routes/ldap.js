const express = require('express')
const router = express.Router()
const model = require('../models/ldap')

// list ldap users
router.get('/users', async function (req, res, next) {
  // admins only
  if (!req.user.admin) {
    console.log('access denied getting ldap users list - user', req.user.username, `(${req.user.id})`, 'is not an admin')
    return res.status(403).send('only admins may use this API')
  }
  console.log(`getting ldap users list...`)
  try {
    const response = await model.listUsers()
    console.log(`ldap users list retrieved. length = ${response.length}`)
    return res.status(200).send(response)
  } catch (e) {
    console.log('failed to list ldap users:', e.message)
    return res.status(500).send(e.message)
  }
})

module.exports = router
