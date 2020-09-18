const client = require('vvb-client')

const url = process.env.VVB_URL
const username = process.env.VVB_USERNAME
const password = process.env.VVB_PASSWORD

const vvb = new client({
  url,
  username,
  password
})

module.exports = vvb