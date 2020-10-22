const fetch = require('node-fetch')

const baseUrl = `https://${process.env.CCE_HOST}/unifiedconfig/config/campaign/`
const authString = Buffer.from(`${process.env.CCE_USER}:${process.env.CCE_PASS}`).toString('base64')

// make xml body to upload dialing record
function makeBody ({records, delimiter = ',', overwrite = false}) {
  return `<import>
  <fileContent>
      <![CDATA[
      ${records}
      ]]> 
  </fileContent>
  <delimiter>${delimiter}</delimiter>
  <overwriteData>${overwrite}</overwriteData>
</import>`
}

// get an array of actual data from CCE REST response data
function getArray (data, key) {
  try {
    const d = data[key + 's'][0][key]
    if (Array.isArray(d)) {
      return d
    } else {
      return [d]
    }
  } catch (e) {
    return []
  }
}

async function getData (id, startIndex, resultsPerPage) {
  const options = {
    headers: {
      Authorization: 'Basic ' + authString,
      Accept: 'application/json'
    }
  }
  try {
    const url = baseUrl + `${id}/import?startIndex=${startIndex}&resultsPerPage=${resultsPerPage}`
    const response = await fetch(url, options)
    const json = await response.json()
    if (!response.ok) {
      throw Error(`${response.status} ${response.statusText} ${JSON.stringify(json)}`)
    }
    return json
  } catch (e) {
    throw e
  }
}

module.exports = {
  async list (query) {
    // list campaigns
    let url = baseUrl
    if (query) {
      url += '?q=' + encodeURIComponent(query)
    }
    const options = {
      headers: {
        Authorization: 'Basic ' + authString,
        Accept: 'application/json'
      }
    }
    const response = await fetch(url, options)
    const json = await response.json()
    if (response.ok) {
      return json
    } else {
      throw Error(`${response.status} ${response.statusText} ${JSON.stringify(json)}`)
    }
  },
  async get (id) {
    try {
      // get campaign details
      const url = baseUrl + `${id}`
      const options = {
        headers: {
          Authorization: 'Basic ' + authString,
          Accept: 'application/json'
        }
      }
      const response = await fetch(url, options)
      const json = await response.json()
      if (response.ok) {
        return json
      } else {
        throw Error(`${response.status} ${response.statusText} ${JSON.stringify(json)}`)
      }
    } catch (e) {
      throw e
    }
  },
  async uploadRecords (id, records, overwrite) {
    console.log('uploadRecords', id, records, overwrite)
    // insert call records
    const url = baseUrl + `${id}/import/`
    const options = {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + authString,
        'Content-Type': 'application/xml',
        Accept: 'application/json'
      },
      body: makeBody({records, overwrite})
    }
    const response = await fetch(url, options)
    if (response.ok) {
      return
    } else {
      const json = await response.json()
      const error = Error(`${response.status} ${JSON.stringify(json.apiError[0].errorDetail.error.errorMessage)}`)
      error.json = json
      error.status = response.status
      throw error
    }
  },
  async listRecords (id) {
    try {
      // sort = 'firstName asc'
      // list call records
      let resultsPerPage = 100
      let startIndex = 0
      // use 101 to start the while loop 
      let totalResults = 101
      let ret = []

      while (startIndex + resultsPerPage < totalResults) {
        const json = await getData(id, startIndex, resultsPerPage)
        startIndex = json.pageInfo.startIndex
        resultsPerPage = json.pageInfo.resultsPerPage
        totalResults = json.pageInfo.totalResults
        if (totalResults == 0) {
          // no data
          break
        }
        const list = getArray(json, 'importContact')
        for (const record of list) {
          ret.push(record)
        }
      }

      return ret
    } catch (e) {
      throw e
    }
  },
  async deleteRecords (id) {
    console.log('deleteRecord', id)
    // delete call records
    const url = baseUrl + `${id}/import`
    const options = {
      method: 'DELETE',
      headers: {
        Authorization: 'Basic ' + authString,
        Accept: 'application/json'
      }
    }
    const response = await fetch(url, options)
    if (response.ok) {
      return
    } else {
      const json = await response.json()
      throw Error(`${response.status} ${response.statusText} ${JSON.stringify(json)}`)
    }
  }
}
