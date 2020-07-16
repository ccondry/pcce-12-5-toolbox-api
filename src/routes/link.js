const express = require('express')
const router = express.Router()
const hydra = require('../hydra')

router.get('/create', async function (req, res, next) {
  console.log(`GET create link`)
  try {
    const response = await hydra({
      service: 'short-link-service',
      method: 'post',
      body: req.query
    })
    console.log(response)
    if (response.statusCode >= 200 && response.statusCode < 300) {
      // generate short URL from environment var and the ID of the image
      const link = `${process.env.link_base}/${response.results.id}`
      return res.status(201).send({link})
    } else {
      return res.status(500).send(response.error)
    }
  } catch (error) {
    console.error(error)
    return res.status(500).send({error})
  }
})

router.get('/:id', async function (req, res, next) {
  console.log(`GET link`)
  try {
    const response = await hydra({
      service: 'short-link-service',
      query: {id: req.params.id}
    })
    if (response.statusCode >= 200 && response.statusCode < 300) {
      // return res.status(200).send(response.results)
      return res.redirect(301, response.results.longUrl)
    } else {
      return res.status(500).send(response.results)
    }
  } catch (error) {
    console.log(error)
    return res.status(500).send({error})
  }
})

router.post('/', async function (req, res, next) {
  console.log(`POST link`)
  try {
    const response = await hydra({
      service: 'short-link-service',
      method: 'post',
      body: req.body
    })
    if (response.statusCode >= 200 && response.statusCode < 300) {
      const link = `${process.env.link_base}/${response.results.id}`
      return res.status(201).send({link})
    } else {
      return res.status(500).send(response.results)
    }
  } catch (error) {
    return res.status(500).send({error})
  }
})

module.exports = router
