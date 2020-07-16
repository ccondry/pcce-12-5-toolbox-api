const request = require('request-promise-native')

async function send (req) {
  const options = {
    method: 'POST',
    baseUrl: 'https://198.19.253.32',
    url: '/api/v1/sms',
    body: req.body,
    qs: req.query,
    json: true
  }
  try {
    // try primary
    console.log('trying to send SMS using cs-manager-1...')
    // go
    const response = await request(options)
    // success
    console.log('successfully sent SMS on cs-manager-1')
    // return response to client with 201 CREATED
    return response
  } catch (e) {
    console.error('failed to send SMS on cs-manager-1:', response)
  }

  try {
    // try secondary
    // set base URL to cs-manager-2
    options.baseUrl = 'https://198.19.253.49'
    console.log('trying to send SMS using cs-manager-2...')
    // go
    const response = await request(options)
    // success
    console.log('successfully sent SMS on cs-manager-2')
    // return response to client with 201 CREATED
    return response
  } catch (e) {
    console.error('failed to send SMS on cs-manager-2:', response)
    // throw secondary error
    throw e
  }
}

module.exports = {
  send
}
