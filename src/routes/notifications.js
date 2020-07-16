const express = require('express')
const router = express.Router()
const hydra = require('../hydra')

async function sendNotification (req, res) {
  console.log(`getting request from ${req.user.username} to send push notification`)
  try {
    const response = await hydra({
      service: 'push-service',
      path: `notifications/${req.params.id}/send`,
      method: 'post',
      // body: req.body,
      query: req.query
    })
    if (response.statusCode !== 201) {
      console.error('failed to send push notification:', response)
      return res.status(response.statusCode).send({error: response.error})
    } else {
      return res.status(201).send()
    }
  } catch (error) {
    console.error('failed to send push notification:', error)
    return res.status(500).send({error})
  }
}

async function getNotifications (req, res) {
  console.log(`getting request from ${req.user.username} to list notifications`)
  try {
    const response = await hydra({
      service: 'push-service',
      path: 'notifications',
      method: 'get',
      // body: req.body,
      query: req.query
    })
    if (response.statusCode !== 200) {
      console.error('failed to get push notifications:', response)
      return res.status(response.statusCode).send({error: response.error})
    } else {
      return res.status(200).send(response.results)
    }
  } catch (error) {
    console.error('failed to get push notification:', error)
    return res.status(500).send({error})
  }
}

async function savePushNotification (req, res) {
  console.log(`getting request from ${req.user.username} to add push notification`)
  const body = req.body
  // add username to body, for ownership marking
  body.username = req.user.username
  body.creator = req.user.username
  try {
    const response = await hydra({
      service: 'push-service',
      path: 'notifications',
      method: 'post',
      body
      // query: req.query
    })
    if (response.statusCode !== 201) {
      console.error('failed to add push notification:', response)
      return res.status(response.statusCode).send({error: response.error})
    } else {
      return res.status(201).send()
    }
  } catch (error) {
    console.error('failed to add push notification:', error)
    return res.status(500).send({error})
  }
}

router.post('/:id/send', sendNotification)
router.post('/', savePushNotification)
router.get('/', getNotifications)

module.exports = router
