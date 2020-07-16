const js2xmlparser = require('js2xmlparser')
const request = require('request-promise-native')
const parseXmlString = require('../../parse-xml')

const urlBase = `https://${process.env.FINESSE_HOST}/finesse/api/Team`

const options = {
  'auth': {
    'user': process.env.FINESSE_USER,
    'pass': process.env.FINESSE_PASSWORD,
    'sendImmediately': true
  }
}

async function getLayout (id) {
  const url = `${urlBase}/${id}/LayoutConfig`
  try {
    const data = await request({
      url,
      method: 'GET',
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/xml'
      },
      auth: {
        user: process.env.FINESSE_USER,
        pass: process.env.FINESSE_PASSWORD,
        sendImmediately: true
      }
    })
    return parseXmlString(data, {explicitArray: false})
  } catch (e) {
    throw e
  }
}

function updateLayout (id, data) {
  // console.log('updateLayout', data)
  const url = `${urlBase}/${id}/LayoutConfig`
  // create xml data from JSON input
  const xmlData = js2xmlparser.parse('TeamLayoutConfig', data.TeamLayoutConfig)
  // send request to Finesse
  return request({
    url,
    method: 'PUT',
    headers: {
      'Accept': 'application/xml',
      'Content-Type': 'application/xml'
    },
    auth: {
      user: process.env.FINESSE_USER,
      pass: process.env.FINESSE_PASSWORD
    },
    body: xmlData
  })
}

module.exports = {
  getLayout,
  updateLayout
}
