const egainClient = require('egain-config')
const egainLib = require('./egain-lib')

// create egain client to ECE
const client = new egainClient({
  host: process.env.ECE_DB_HOST,
  username: process.env.ECE_DB_USERNAME,
  password: process.env.ECE_DB_PASSWORD
})

let roleIds = []
try {
  if (process.env.ECE_ROLE_IDS && process.env.ECE_ROLE_IDS.length) {
    roleIds = process.env.ECE_ROLE_IDS.split(',').map(v => v.trim())
  }
} catch (e) {
  roleIds = []
}

const lib = new egainLib({
  client,
  platform: 'ECE',
  licenseIds: process.env.ECE_LICENSE_IDS,
  roleIds
})

module.exports = lib
