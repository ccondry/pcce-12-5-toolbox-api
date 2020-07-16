const express = require('express')
const router = express.Router()
const hydra = require('../hydra')

router.get('/', async function (req, res, next) {
  console.log(`getting permissions`)
  try {
    const response = await hydra({
      service: process.env.hydra_lab_config_service,
      path: 'permissions',
      query: req.query
    })
    // console.log(response)
    return res.status(response.statusCode).send(response.results)
  } catch (error) {
    return res.status(500).send({error})
  }
})

router.put('/', async function (req, res, next) {
  if (req.user.admin) {
    const body = req.body
    console.log(`PUT permissions by admin user ${req.user.username}`, body)
    try {
      const response = await hydra({
        method: 'put',
        service: process.env.hydra_lab_config_service,
        path: 'permissions',
        query: req.query,
        body
      })
      return res.status(response.statusCode).send(response.results)
    } catch (error) {
      return res.status(500).send({error})
    }
  } else {
    console.log(`403 not allowed - PUT permissions by non-admin user ${req.user.username}`)
    return res.status(403).send()
  }
})

module.exports = router
