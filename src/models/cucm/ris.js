// CUCM RIS status library
const cucmRis = require('cucm-ris')

const ris = new cucmRis({
  host: process.env.AXL_HOST,
  user: process.env.AXL_USER,
  pass: process.env.AXL_PASS,
  version: process.env.AXL_VERSION
})

module.exports = ris
