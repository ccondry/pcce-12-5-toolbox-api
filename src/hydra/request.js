const hydra = require('./index')

function doHydra (service, path) {
  return async function (req, res) {
    console.log(`getting bots`)
    try {
      const response = await hydra({
        service,
        path,
        query: req.query
      })
      if (response.statusCode < 200 || response.statusCode >= 300) {
        console.error(`failed to find ${path}:`, response)
        return res.status(500).send(response.error)
      } else {
        return res.status(200).send(response.results)
      }
    } catch (error) {
      console.error(`error getting ${path}:`, response)
      return res.status(500).send({error})
    }
  }
}

module.exports = doHydra
