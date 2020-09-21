require('dotenv').config()
process.env.NODE_EXTRA_CA_CERTS = 'extra-CAs.pem'
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
const vertical = require('../src/models/vertical')
const gcpCredential = require('../src/models/gcp-credential')
const vvb = require('../src/models/vvb')


async function main (verticalId, username, userId) {
  // get vertical
  const verticalConfig = await vertical.get(verticalId)
  console.log('got vertical')
  
  // get GCP key for this project ID from cumulus-api
  const key = await gcpCredential.get(verticalConfig.gcpProjectId)

  // create service account data object
  const serviceAccount = {
    name: verticalConfig.gcpProjectId,
    description: `${username} ${userId}`,
    key
  }
  // create or update asr, tts, nlp service accounts
  await create('asr', serviceAccount)
  await create('tts', serviceAccount)
  await create('nlp', serviceAccount)
}

async function create (type, serviceAccount) {
  let existing
  try {
    // look for existing account
    existing = await vvb.cva[type].getServiceAccount(serviceAccount.name)
  } catch (e) {
    // not found?
    if (e.message.startsWith('404')) {
      console.log(type + ' service account not found. creating it...')
      // create
      await vvb.cva[type].createServiceAccount(serviceAccount)
    }
  }
  // update existing NLP
  if (existing) {
    console.log('found existing ' + type + ' service account. updating it...')
    await vvb.cva[type].updateServiceAccount(serviceAccount)
  }
}

main('mgianni-dcloud')
.catch(e => console.log(e))