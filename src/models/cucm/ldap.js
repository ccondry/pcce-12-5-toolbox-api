const express = require('express')
const router = express.Router()
const axl = require('./axl')

module.exports = {
  startSync: async function (directory = process.env.CUCM_LDAP_DIRECTORY) {
    try {
      // get directory name
      console.log(`starting CUCM LDAP sync for directory`, directory, '...')
      // start sync specified LDAP directory
      await axl.doLdapSync(directory)
      // done
      return
    } catch (e) {
      // error during processing
      console.log('failed to do LDAP sync in CUCM for directory', directory, ':', e.message)
      throw e
    }
  },
  getSyncStatus: async function (directory = process.env.CUCM_LDAP_DIRECTORY) {
    try {
      // get directory name
      console.log(`getting CUCM LDAP directory sync status for`, directory, '...')
      // start sync specified LDAP directory
      const body = await axl.getLdapSyncStatus(directory)
      // return the body
      return body
    } catch (e) {
      // error during processing
      console.log('failed to get CUCM LDAP sync status for directory', directory, ':', e.message)
      throw e
    }
  }
}
