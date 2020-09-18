const fetch = require('node-fetch')

module.exports = {
  async get (id) {
    try {
      const url = 'https://mm.cxdemo.net/api/v1/gcp/credentials/' + id
      const options = {
        headers: {
          Authorization: 'Bearer ' + process.env.MM_JWT
        }
      }
      const response = await fetch(url, options)
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