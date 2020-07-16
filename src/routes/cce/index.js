const express = require('express')
const router = express.Router()
const cce = require('../../models/cce')

// get
router.get('/:type/:id', async function (req, res) {
  console.log(`received request to get CCE object ${req.params.type} ${req.params.id}`)
  try {
    const results = await cce.get(req.params.type, req.params.id)
    console.log(`successfully got CCE object ${req.params.type} ${req.params.id}`)
    return res.status(200).send(results)
  } catch (e) {
    // error during processing
    console.log(`failed to get CCE object ${req.params.type} ${req.params.id}`, e.message)
    return res.status(500).send(e.message)
  }
})

// search
router.get('/:type', async function (req, res) {
  console.log(`received request to get list of CCE ${req.params.type} with q = ${req.query.q}`)
  try {
    const results = await cce.list(req.params.type, req.query.q)
    console.log(`successfully got list of CCE ${req.params.type}. results.length = ${results.length}`)
    return res.send(results)
  } catch (e) {
    console.log(`error listing CCE ${req.params.type}`, e.message)
    return res.status(500).send(e.message)
  }
})

// update
router.put('/:type/:id', async function (req, res, next) {
  try {
    console.log(`${req.user.username} request to PUT ${req.params.type} ${req.params.id}`)
    // is user allowed to update this object?
    // see if the object is in the user's department
    // get current object
    const response1 = await cce.get(req.params.type, req.params.id)
    let current = response1.results
    // if (typeof current === 'string') {
    //   current = JSON.parse(current)
    // }
    // check if current object has department name === this user's username
    let authorized
    try {
      if (req.params.type === 'campaign') {
        console.log('current', current)
        // for outbound campaigns, check the department of the assigned skillgroup
        authorized = current.skillGroupInfos.skillGroupInfo.skillGroup.department.name === req.user.username
      } else {
        console.log('current', current)
        authorized = current.department.name === req.user.username
      }
    } catch (e) {
      console.log(e.message)
      authorized = false
    }

    if (!authorized) {
      // not authorized
      return res.status(403).send({error: `You don't have write permission on that object.`})
    } else {
      // authorized
      // force the department to be current department (according to server data)
      // unless it is an outbound campaign, which won't return a department on the root object
      if (req.params.type !== 'campaign') {
        req.body.department = {
          refURL: current.department.refURL
        }
      }
      // strip any xml stuff
      delete req.body.$
      // delete req.body['xmlns:xsi']
      // delete req.body['xsi:type']
      // update the thing
      const results = await cce.modify(req.params.type, req.params.id, req.body)
      console.log(`successfully modified ${req.params.type} ${req.params.id}`)
      return res.status(202).send(results)
    }
  } catch (e) {
    console.error(`error during request to PUT CCE object`, e.message)
    return res.status(500).send(e.message)
  }
})

// create
router.post('/:type', async function (req, res, next) {
  try {
    // get user's department
    const response1 = await cce.list('department', {})
    const department = response1.results.find(v => v.name === req.user.username)
    // force the department to be user's department
    req.body.department = {
      refURL: department.refURL
    }
    // create object
    const response2 = await cce.create(req.params.type, req.body)
    const id = response2.location.split('/').pop()
    // return the new ID
    return res.status(201).send(id)
  } catch (e) {
    // error
    return res.status(e.statusCode || 500).send(e.error)
  }
})

module.exports = router
