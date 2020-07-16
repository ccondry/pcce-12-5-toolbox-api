const hydraExpress = require('hydra-express')
const hydra = hydraExpress.getHydra()
const queryString = require('query-string')

module.exports = async function ({
  service,
  method = 'get',
  path = '',
  query = {},
  body = {}
}) {
  try {
    // stringify query string object
    const qs = queryString.stringify(query)
    let to = `${service}:[${method}]/${path}`
    if (qs.length) {
      to += `?${qs}`
    }
    // console.log('hydra call to', to)
    // create hydra message
    const message = hydra.createUMFMessage({
      to,
      from: hydra.getServiceName() + ':/',
      body
    })
    // make the API request through hydra
    return await hydra.makeAPIRequest(message)
  } catch (e) {
    throw e
  }
}
