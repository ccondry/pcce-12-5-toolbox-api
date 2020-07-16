var express = require('express')
var router = express.Router()
var team = require('../models/finesse/team')
// var db = require('../mongodb')
// var user = require('src/models/user')
var ccesupervisor = require('../models/cce/supervisor')

// get team list
router.get('/', async function (req, res, next) {
  try {
    // find all teams
    const cceTeams = await hydra({
      service: process.env.hydra_cce_service,
      path: `agentTeam`
    })
    // console.log('cce teams:', cceTeams)

    if (req.user.admin) {
      // auth not enabled or user is admin - just list all teams
      return res.status(200).send(cceTeams)
    } else {
      // return teams in this user's department
      // find all departments
      const departments = await hydra({
        service: process.env.hydra_cce_service,
        path: `department`
      })

      // find my department
      const myDepartment = departments.find(v => {
        return v.name === req.user.username
      })

      const myTeams = cceTeams.filter(v => {
        return v.department.refURL === myDepartment.refURL
      })

      return res.status(200).send(myTeams)
    }
  } catch (e) {
    console.log(`error retrieving user's teams:`, e.message)
    return res.status(500).send(e.message)
  }
})

// get single team details
router.get('/:id', async function (req, res, next) {
  console.log('getting Finesse Team ' + req.params.id + ' details')
  if (isNaN(req.params.id)) {
    // id is name
    try {
      team.getByName(req.params.id, function (data) {
        console.log(data)
        res.json(data)
      })
    } catch (error) {
      console.log(error)
      return res.status(500).send({error})
    }
  } else {
    // id is numerical ID
    try {
      team.get(req.params.id, function (data) {
        console.log(data)
        res.json(data)
      })
    } catch (error) {
      console.log(error)
      return res.status(500).send({error})
    }
  }
})

// get single team layout config
router.get('/:id/layout', async function (req, res, next){
  // validate input
  if (isNaN(req.params.id)) {
    return res.status(400).send('team ID should be provided in the path. received ' + req.params.id)
  } else {
    // id is numerical ID
    console.log('getting Finesse Team layout config using team ID', req.params.id)
    try {
      const response = await team.getLayout(req.params.id)
      return res.status(200).send(response)
    } catch (e) {
      console.log('failed to get finesse team layout for team ID', req.params.id, e.message)
      return res.status(500).send(e.message)
    }
  }
})

// set team's layout config
router.put('/:id/layout', async function (req, res, next) {
  console.log('saving Finesse Team', req.params.id, 'Layout Config')
  // validate
  if (isNaN(req.params.id)) {
    return res.status(400).send('team ID is required and should be an integer. received' + req.params.id)
  }
  try {
    await team.updateLayout(req.params.id, req.body)
    return res.sendStatus(202)
  } catch (e) {
    console.log('failed to save finesse team layout config for team ID', req.params.id, e.message)
    return res.status(500).send(e.message)
  }
})
module.exports = router
