const hydraExpress = require('hydra-express')
const hydra = hydraExpress.getHydra()

// external hydra service we want to reach
const serviceName = process.env.hydra_lab_config_service

module.exports = {
  get: async function ({instance, type}, body) {
    console.log(`${serviceName}:[get]/demos`)
    try {
      // create hydra message
      const message = hydra.createUMFMessage({
        to: `${serviceName}:[get]/demos`,
        from: hydra.getServiceName() + ':/',
        body: {}
      })
      // make the API request through hydra
      return await hydra.makeAPIRequest(message)
    } catch (e) {
      throw e
    }
  },
  put: async function ({instance, type}, body) {
    console.log(`${serviceName}:[put]/demos`)
    try {
      // create hydra message
      const message = hydra.createUMFMessage({
        to: `${serviceName}:[put]/demos`,
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
