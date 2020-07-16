const express = require('express')
const router = express.Router()
const hydra = require('../hydra')

router.get('/:type', async function (req, res, next) {
  console.log(`getting ${req.params.type} templates list`)
  try {
    const response = await hydra({
      method: 'get',
      service: process.env.hydra_lab_config_service,
      path: `templates/${req.params.type}`,
      query: req.query
    })
    return res.status(response.statusCode).send(response.results)
  } catch (error) {
    return res.status(500).send({error})
  }
})

router.post('/:type', async function (req, res, next) {
  console.log('user', req.user.username, 'requesting POST', req.params.type, 'template', req.body.name)
  // allow admins to save user templates without changing the ownership
  try {
    // find current data
    const response1 = await hydra({
      method: 'get',
      service: process.env.hydra_lab_config_service,
      path: `templates/${req.params.type}`,
      query: {name: req.body.name}
    })
    if (response1.statusCode === 200 && response1.results.length) {
      // existing template
      if (req.user.admin) {
        console.log('admin user', req.user.username, 'updating existing', req.params.type, 'template', req.body.name)
        // use current template username if user is admin
        req.body.username = response1.results[0].username
      } else {
        console.log('user', req.user.username, 'updating existing', req.params.type, 'template', req.body.name)
        // use request username to template data if not admin
        req.body.username = req.user.username
      }
    } else {
      console.log('user', req.user.username, 'saving new', req.params.type, 'template', req.body.name)
      // new template - set username using request username
      req.body.username = req.user.username
    }
  } catch (e) {
    // just set username using request data
    req.body.username = req.user.username
  }


  try {
    const response = await hydra({
      method: 'post',
      service: process.env.hydra_lab_config_service,
      path: `templates/${req.params.type}`,
      body: req.body
    })
    console.log('hydra response for saving', req.params.type, 'template', response)
    if (response.statusCode >= 200 && response.statusCode < 300) {
      console.log('user', req.user.username, 'successfully saved', req.params.type, 'template', req.body.name)
      // success
      return res.status(response.statusCode).send(response.body)
    } else {
      // error
      console.log('user', req.user.username, 'failed to save', req.params.type, 'template', req.body.name)
      return res.status(response.statusCode).send(response.body)
    }
  } catch (error) {
    console.log('user', req.user.username, 'encountered error saving', req.params.type, 'template', req.body.name, error.message)
    return res.status(500).send(error.message)
  }
})

module.exports = router
