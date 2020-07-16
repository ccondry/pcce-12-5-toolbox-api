const hydraExpress = require('hydra-express')
const hydra = hydraExpress.getHydra()

// external hydra service we want to reach
const serviceName = process.env.hydra_lab_config_service

module.exports = {
  get: async function (id) {
    try {
      // create hydra message
      const message = hydra.createUMFMessage({
        to: `${serviceName}:[get]/users/${id}`,
        from: hydra.getServiceName() + ':/',
        body: {}
      })
      // make the API request through hydra
      return await hydra.makeAPIRequest(message)
    } catch (e) {
      throw e
    }
  },
  patch: async function (id, body, field) {
    try {
      // create hydra message
      const message = hydra.createUMFMessage({
        to: `${serviceName}:[patch]/users/${id}?field=${field}`,
        from: hydra.getServiceName() + ':/',
        body
      })
      // make the API request through hydra
      return await hydra.makeAPIRequest(message)
    } catch (e) {
      throw e
    }
  },
  put: async function (id, body) {
    try {
      // create hydra message
      const message = hydra.createUMFMessage({
        to: `${serviceName}:[put]/users/${id}`,
        from: hydra.getServiceName() + ':/',
        body
      })
      // make the API request through hydra
      return await hydra.makeAPIRequest(message)
    } catch (e) {
      throw e
    }
  }
}
