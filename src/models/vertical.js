const fetch = require('./fetch')
const urlBase = 'https://mm.cxdemo.net/api/v1/verticals'

module.exports = {
  async get (id) {
    const options = {
      query: {
        summary: true
      }
    }
    return fetch(urlBase + '/' + id, options)
  },
  async list (owner) {
    return fetch(urlBase , {
      query: {
        owner,
        summary: true
      }
    })
  }
}