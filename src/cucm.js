const express = require('express')
const router = express.Router()
const hydra = require('../hydra')
const util = require('util')

// retrieve list of phones (devices) from CUCM for current user
router.get('/phone', async function (req, res, next) {
  try {
    const response = await hydra({
      service: process.env.hydra_cucm_service,
      path: 'phones',
      method: 'get',
      query: {
        // send the userid because AXL and RIS search patterns are different
        // but both rely on the lab user id
        userid: req.user.id
      }
    })
    return res.status(response.statusCode).send(response.results)
  } catch (e) {
    console.error(e)
    if (e.response) {
      return res.status(e.response.status || 500).send(e.response.data || e.response)
    } else {
      return res.status(500).send(e || 'Unknown Server Error')
    }
  }
})

// retrieve list of lines (dialed numbers) from CUCM for current user
router.get('/line', async function (req, res, next) {
  try {

    const response = await hydra({
      service: process.env.hydra_cucm_service,
      path: 'lines',
      method: 'get',
      query: {
        userid: req.user.id
      }
    })
    return res.status(response.statusCode).send(response.results)
  } catch (e) {
    console.error(e)
    if (e.response) {
      return res.status(e.response.status || 500).send(e.response.data || e.response)
    } else {
      return res.status(500).send(e || 'Unknown Server Error')
    }
  }
})

// create a phone for the current user
router.post('/phone', async function (req, res, next) {
  // default alertingName to the user's full name (pulled from LDAP)
  req.body.alertingName = req.body.alertingName || req.user.name
  req.body.username = req.user.username
  req.body.userid = req.user.id
    try {
      // create phone
      const response = await hydra({
        service: process.env.hydra_cucm_service,
        path: 'phones/create',
        method: 'post',
        body: req.body
      })
      return res.status(response.statusCode).send(response.results)
    } catch (e) {
      console.error(e)
      if (e.response) {
        return res.status(e.response.status || 500).send(e.response.data || e.response)
      } else {
        return res.status(500).send(e || 'Unknown Server Error')
      }
    }
  // }
})

// delete a user's dialed number (by dn pattern)
// will also automatically delete the associated phone
router.delete('/phone/:pattern', async function (req, res, next) {
  // validate the request
  const pattern = req.params.pattern
  // validate the DN pattern - it should be 8 digits and end with the 4-digit user ID
  if (!pattern || pattern.length !== 8 || req.user.id !== pattern.slice(4)) {
    // invalid DN pattern
    const error = `invalid request to delete phone. "pattern" is required, must be 8 digits, and must end with '${req.user.id}'.`
    console.log(error)
    return res.status(403).send({error})
  } else {
    // delete phone
    const response = await hydra({
      service: process.env.hydra_cucm_service,
      path: `phones/${pattern}`,
      method: 'delete'
    })
    // send hydra response to HTTP client
    return res.status(response.statusCode).send(response.results)
  }
})

module.exports = router
