const cceteam = require('./team')
// const util = require('util')

module.exports = {
  // retrieve supervised teams list for provided supervisor username
  getTeams: supervisor => {
    console.log('request to get CCE teams for supervisor with username = ' + supervisor)
    return new Promise((resolve, reject) => {
      // get full teams list
      cceteam.list()
      .then(data => {
        // console.log('cceteam.list =', util.inspect(data, false, null))
        // filter teams using the specified supervisor username
        var filteredData = data.filter(v => {
          // console.log('v = ', v)
          // does this element have any supervisors?
          if (v.supervisors && v.supervisors.supervisor) {
            // has supervisors list
            let list = v.supervisors.supervisor
            // is list an array or an object?
            if (!Array.isArray(list)) {
              // object - single supervisor returned
              let index = list.userName.indexOf('@')
              if (index >= 0) {
                return list.userName.substring(0, index) === supervisor
              } else {
                return list.userName === supervisor
              }
              return list.userName === supervisor
            } else {
              // array - list of supervisors returned
              // console.log('supervisor list =', util.inspect(list, false, null))
              // include this element if the specified supervisor is in the supervisors list
              return list.filter(x => {
                let index = x.userName.indexOf('@')
                if (index >= 0) {
                  return x.userName.substring(0, index) === supervisor
                } else {
                  return x.userName === supervisor
                }
              }) !== undefined
            }
          } else {
            // no supervisors on this team, so we can't be one of them
            return false
          }
        })
        resolve(filteredData)
      })
      .catch(e => {
        console.log('failed to get team list from CCE unifiedconfig')
        reject(e)
      })
    })
  }
}
