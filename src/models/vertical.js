const fetch = require('node-fetch')

module.exports = {
  async get (id) {
    try {
      const response = await fetch('https://mm.cxdemo.net/api/v1/verticals/' + id)
      const text = await response.text()
      if (response.ok) {
        const json = JSON.parse(text)
        return json
      } else {
        throw Error(`${response.status} ${response.statusText} - ${text}`)
      }
    } catch (e) {
       throw e
    }
  }
}