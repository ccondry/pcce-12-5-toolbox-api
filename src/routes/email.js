const express = require('express')
const router = express.Router()
const email = require('../models/email')

function sendEceEmail (req, res, next) {
  return sendEmail(req, res, next, process.env.email_to_ece)
}

function sendEgainEmail (req, res, next) {
  return sendEmail(req, res, next, process.env.email_to_egain)
}

async function sendEmail (req, res, next, defaultTo) {
  const mailOptions = {
    from: `"${req.body.name || ''}" <${req.body.email}>`, // sender address
    to: req.body.to ? `${req.body.to}@dcloud.cisco.com` : defaultTo, // list of receivers
    subject: req.body.subject || '', // Subject line
    text: req.body.text || '', // plain text body
    html: req.body.html || '' // html body
  }
  try {
    const info = await email.send(mailOptions)
    console.log(info)
    return res.set("Content-type", "application/json; charset=utf-8")
    .send(JSON.stringify(info, null, 2))
  } catch (error) {
    console.log(error)
    return res.status(500)
    .send(JSON.stringify(error, null, 2))
  }
}

router.post('/egain', sendEgainEmail)
router.post('/ece', sendEceEmail)
router.post('/', sendEmail)

module.exports = router
