const express = require('express')
const router = express.Router()
const model = require('../models/brand')

// get brand list
router.get('/', async function (req, res, next) {
  try {
    console.log('request to list brands...')
    // get verticals
    const response = await model.list()
    console.log('successfully listed brands')
    // return to client
    return res.status(200).send(response)
  } catch (e) {
    // failed
    console.log('failed to list brands:', e.message)
    return res.status(500).send(e.message)
  }
})

// get single brand
router.get('/:id', async function (req, res, next) {
  const id = req.params.id
  try {
    console.log('request to get brand', id, '...')
    // get vertical
    const response = await model.get(id)
    console.log('successfully got brand', id)
    // return to client
    return res.status(200).send(response)
  } catch (e) {
    // failed
    console.log('failed to get brand', id, ':', e.message)
    return res.status(500).send(e.message)
  }
})

module.exports = router
