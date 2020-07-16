const express = require('express')
const router = express.Router()
const cuic = require('../models/cuic')

router.post('/user/sync', async function (req, res, next) {
  console.log(`starting CUIC supervisor sync`)
  try {
    const response = await cuic.syncCceSupervisors({
      host: process.env.CUIC_HOST,
      username: process.env.CUIC_USERNAME,
      password: process.env.CUIC_PASSWORD
    })
    return res.status(202).send()
  } catch (error) {
    console.log(error)
    return res.status(500).send({error})
  }
})

module.exports = router
