const express = require('express')
const router = express.Router()
const hydra = require('../hydra')

router.get('/', async function (req, res, next) {
  console.log(`getting routing configs for ${req.user.id}`)
  try {
    const response = await hydra({
      service: process.env.hydra_lab_config_service,
      path: 'routing',
      query: {userId: req.user.id}
    })
    // console.log('got routing configs', response)
    return res.status(200).send(response.body)
  } catch (error) {
    // console.log(error)
    return res.status(500).send({error})
  }
})

router.post('/', async function (req, res, next) {
  console.log(`POST routing by user ${req.user.id}`)
  const body = {
    userId: req.user.id,
    contact: req.body.contact.toLowerCase()
  }
  try {
    const response = await hydra({
      method: 'post',
      service: process.env.hydra_lab_config_service,
      path: 'routing',
      body
    })
    // any hydra REST code goes here
    return res.status(response.statusCode).send(response.results || response.error)
  } catch (error) {
    // exceptions
    return res.status(500).send({error})
  }
})

router.delete('/', async function (req, res, next) {
  console.log(`DELETE routing contact ${req.query.contact} by user ${req.user.id}`)
  const query = {
    userId: req.user.id,
    contact: req.query.contact
  }
  try {
    const response = await hydra({
      method: 'delete',
      service: process.env.hydra_lab_config_service,
      path: 'routing',
      query
    })
    // any hydra REST status code goes here
    return res.status(response.statusCode).send(response.results || response.error)
  } catch (error) {
    // exceptions
    return res.status(500).send({error})
  }
})

module.exports = router
