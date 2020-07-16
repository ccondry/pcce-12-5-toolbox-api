const hydra = require('./index')

module.exports = async function (req, res, options) {
  try {
    const response = await hydra(options)
    // console.error('hydrarest response', response)
    if (response.statusCode < 200 || response.statusCode > 299) {
      // error
      return res.status(response.statusCode).send(response.error)
    } else {
      // success
      return res.status(response.statusCode).send(response.results)
    }
  } catch (e) {
    console.error('hydrarest error', e.message)
    if (e.response) {
      return res.status(e.response.status || 500).send(e.response.data || e.response)
    } else {
      return res.status(500).send(e || 'Unknown Server Error')
    }
  }
}
