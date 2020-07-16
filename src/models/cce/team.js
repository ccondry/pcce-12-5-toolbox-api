var unirest = require('unirest')
const parsers = require('../parsers')

var urlBase = `https://${process.env.CCE_HOST}/unifiedconfig/config/agentteam`

module.exports = {
  list: () => {
    return new Promise((resolve, reject) => {
      //TODO add support for more than 100 results
      unirest.get(urlBase)
      .auth({
        user: process.env.CCE_USER,
        pass: process.env.CCE_PASS
      })
      .query({
        // summary: true,
        resultsPerPage: 100
      })
      .end(function (response) {
        if (response.status >= 200 && response.status < 300) {
          // parse XML to JSON
          try {
            const result = parsers.xml2js(response.body)
            const teams = result.results.agentTeams.agentTeam
            for (const team of teams) {
              // set team ID using refURL
              team.id = team.refURL.substring(team.refURL.lastIndexOf('/') + 1)
            }
            // done
            resolve(teams)
          } catch (e) {
            reject(e)
          }
        } else {
          console.log('error - ', response)
          if (response) {
            reject(response)
          } else {
            resolve('no response returned from CCE get team list API')
          }
        }
      })
    })
  },
  get: function (id, callback) {
    var url = `${urlBase}/${id}`
    unirest.get(url)
    .end(function (response) {
      // console.log(response.body)
      callback(response.body)
    })
  }
}
