const express = require('express')
const router = express.Router()
const finesse = require('../models/finesse')

// get team layout for this user
router.get('/team/layout', async function (req, res, next) {
  console.log(`received request to get Finesse Team layout for ${req.user.username}`)
  try {
    // find team ID for this username
    const allTeams = await finesse.list('Team')
    console.log('allTeams', allTeams)
    if (allTeams.statusCode < 200 || allTeams.statusCode >= 300) {
      return res.status(allTeams.statusCode).send(allTeams.error)
    }
    // console.log('allTeams', allTeams)
    const userTeam = allTeams.body.find(v => v.name === req.user.username)
    if (userTeam) {
      console.log('userTeam found:', userTeam)
      // get team data for requesting user's primary team
      const response = await hydra({
        service: process.env.hydra_lab_config_service,
        path: `finesse/Team/${userTeam.id}/${req.params.type}`,
        query: req.query
      })
      console.log(`GET finesse team ${req.params.type} response`, response)
      if (response.results) {
        return res.status(200).send(response.body)
      } else {
        const error = `Failed to get ${req.params.type} for team ${userTeam.id}`
        console.log(error)
        return res.status(500).send(error)
      }
    } else {
      const error = `Couldn't find team with name = ${req.user.username}`
      console.log(error)
      return res.status(400).send(error)
    }
  } catch (error) {
    console.log(error.message)
    return res.status(500).send(error.message)
  }
})

router.put('/Team/:type', async function (req, res, next) {
  console.log(`received request to PUT Finesse Team ${req.params.type} for ${req.user.username}`)
  try {
    // find team ID for this username
    const allTeams = await hydra({
      service: process.env.hydra_lab_config_service,
      path: `finesse/Team`
    })
    // console.log('allTeams', allTeams)
    if (allTeams.statusCode < 200 || allTeams.statusCode >= 300) {
      return res.status(allTeams.statusCode).send(allTeams.error)
    }
    const userTeam = allTeams.results.find(v => v.name === req.user.username)
    if (userTeam) {
      console.log('userTeam found:', userTeam)
      // PUT team data for requesting user's primary team
      const response = await hydra({
        service: process.env.hydra_lab_config_service,
        path: `finesse/Team/${userTeam.id}/${req.params.type}`,
        method: 'put',
        body: req.body,
        query: req.query
      })
      console.log(`PUT finesse team ${req.params.type} response`, response)
      if (response.statusCode >= 200 || response.statusCode < 300) {
        return res.status(201).send()
      } else {
        const error = `Failed to PUT ${req.params.type} for team ${userTeam.id}`
        console.log(error)
        return res.status(500).send({error})
      }
    } else {
      const error = `Couldn't find team with name = ${req.user.username}`
      console.log(error)
      return res.status(400).send({error})
    }
  } catch (error) {
    console.log(error)
    return res.status(500).send({error})
  }
})

module.exports = router
