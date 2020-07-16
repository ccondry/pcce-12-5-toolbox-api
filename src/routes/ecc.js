const express = require('express')
const router = express.Router()
const hydra = require('../hydra')
const util = require('util')

// list current agents for current user
router.get('/', async function (req, res, next) {
  console.log(`getting ECC variables list for ${req.user.username}`)
  try {
    // get list of ECC variables
    const response = await hydra({
      service: process.env.hydra_lab_config_service,
      path: 'cce/expandedCallVariable'
    })
    return res.status(response.statusCode).send(response.results)
  } catch (error) {
    console.log(error)
    return res.status(500).send({error})
  }
})

module.exports = router
