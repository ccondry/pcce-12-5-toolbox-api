const egainClient = require('egain-config')
const egainLib = require('./egain-lib')

// create egain client to eGain
const client = new egainClient({
  host: process.env.EGAIN_DB_HOST,
  username: process.env.EGAIN_DB_USERNAME,
  password: process.env.EGAIN_DB_PASSWORD
})

let roleIds = []
try {
  if (process.env.EGAIN_ROLE_IDS && process.env.EGAIN_ROLE_IDS.length) {
    roleIds = process.env.EGAIN_ROLE_IDS.split(',').map(v => v.trim())
  }
} catch (e) {
  roleIds = []
}

const ex = new egainLib({
  client,
  platform: 'eGain',
  licenseIds: process.env.EGAIN_LICENSE_IDS,
  roleIds
})

module.exports = ex
