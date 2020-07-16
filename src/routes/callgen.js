const express = require('express')
const router = express.Router()
const hydra = require('../hydra')

// get Callgen config for specified username
async function getConfig (req, res, next) {
  try {
    // authorize
    if (req.params.username === req.user.username || req.user.admin) {
      // get data from hydra microservice
      const response = await hydra({
        service: process.env.hydra_lab_config_service,
        path: 'callgen/config',
        query: {
          username: req.params.username
        }
      })
      console.log(`${req.user.username} successful GET of callgen config for ${req.params.username}`)
      // return relevant response data from hydra to client
      return res.status(response.statusCode).send(response.results)
    } else {
      // no permission
      console.log(`${req.user.username} tried to GET callgen config for ${req.params.username} and was denied access.`)
      const error = `You don't have permission to view this resource.`
      return req.status(403).send({error})
    }
  } catch (error) {
    // server error
    console.log(`${req.user.username} tried to GET callgen config for ${req.params.username} but there was a server error:`, error)
    return res.status(500).send({error})
  }
}

async function saveConfig (req, res, next) {
  const username = req.params.username || req.body.username
  if (username === req.user.username || req.user.admin) {
    // authorized
    console.log(`${req.user.username} requested ${req.method} callgen config for ${username}`)
    try {
      const response = await hydra({
        method: 'put',
        service: process.env.hydra_lab_config_service,
        path: 'callgen/config/' + username,
        body: req.body
      })
      return res.status(response.statusCode).send(response.results)
    } catch (error) {
      return res.status(500).send({error})
    }
  } else {
    // not authorized
    console.log(`${req.user.username} tried to ${req.method} callgen config for ${username} and was denied access.`)
    const error = `You don't have permission to view this resource.`
    return req.status(403).send({error})
  }
}

async function getTemplates (req, res, next) {
  console.log(`getting branding templates list`)
  try {
    const response = await hydra({
      service: process.env.hydra_lab_config_service,
      path: 'callgen/templates',
      query: req.query
    })
    return res.status(response.statusCode).send(response.results)
  } catch (error) {
    return res.status(500).send({error})
  }
}

async function saveTemplate (req, res, next) {
  // get name parameter from either PUT URL or POST body
  const name = req.params.name || req.body.name
  console.log(`saving callgen template ${name}`)
  // allow admins to save user templates without changing the ownership
  // find current data
  try {
    const response1 = await hydra({
      service: process.env.hydra_lab_config_service,
      path: 'callgen/templates',
      query: {name}
    })
    if (response1.statusCode === 200 && response1.results.length) {
      // existing template
      if (req.user.admin) {
        // use current template username if user is admin
        req.body.username = response1.results[0].username
      } else {
        // use request username to template data if not admin
        req.body.username = req.user.username
      }
    } else {
      // new template - set username using request username
      req.body.username = req.user.username
    }
  } catch (e) {
    // just set username using request data
    req.body.username = req.user.username
  }


  try {
    const response = await hydra({
      method: 'put',
      service: process.env.hydra_lab_config_service,
      path: 'callgen/templates/' + name,
      body: req.body
    })
    if (response.statusCode >= 200 && response.statusCode < 300) {
      console.log(`successfully saved branding template ${name}`)
      // success
      return res.status(response.statusCode).send(response.results)
    } else {
      // error
      console.log(`error saving branding template ${name}`)
      return res.status(response.statusCode).send(response.error)
    }
  } catch (error) {
    console.log('error saving template', error)
    return res.status(500).send({error})
  }
}

router.get('/config/:username', getConfig)
router.post('/config', saveConfig)
router.put('/config/:username', saveConfig)

router.get('/templates', getTemplates)
router.post('/templates', saveTemplate)
router.put('/templates/:name', saveTemplate)

module.exports = router
