const request = require('request-promise-native')

// try 2 servers for getting data

// get data from primary baseUrl1, and fall back to baseUrl2 if there is an error
async function getConfig (url, baseUrl1, baseUrl2, qs) {
  const options = {
    baseUrl: baseUrl1,
    url,
    qs,
    json: true,
    timeout: 10000
  }

  let response
  try {
    // get verticals from primary
    return await request(options)
  } catch (e) {
    console.log('failed to get verticals list from', baseUrl1, e.message)
    try {
      // get verticals from secondary
      options.baseUrl = baseUrl2
      // set timeout to 30 seconds for secondary
      options.timeout = 30000
      return await request(options)
    } catch (e2) {
      console.log('failed to get verticals list from', baseUrl2, e2.message)
      // failed both
      throw e2
    }
  }
}

module.exports = {
  // get all verticals
  list: function () {
    return getConfig('verticals', process.env.CS_MANAGER_API_1, process.env.CS_MANAGER_API_2)
  },
  // get single vertical by ID
  get: function (id) {
    return getConfig('verticals/' + id, process.env.CS_MANAGER_API_1, process.env.CS_MANAGER_API_2)
  }
}
