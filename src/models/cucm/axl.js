const cucmAxl = require('cucm-axl')

const axl = new cucmAxl({
  host: process.env.AXL_HOST,
  user: process.env.AXL_USER,
  pass: process.env.AXL_PASS,
  version: process.env.AXL_VERSION
})

module.exports = axl
