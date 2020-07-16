const cceClient = require('cce-unified-config')

const cce = new cceClient({
  host: process.env.CCE_HOST,
  username: process.env.CCE_USER,
  password: process.env.CCE_PASS
})

module.exports = cce
