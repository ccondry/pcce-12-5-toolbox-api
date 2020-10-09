const fetch = require('node-fetch')

module.exports = async function (url, options) {
  try {
    const response = await fetch(url, options)
    const text = await response.text()
    if (response.ok) {
      try {
        const json = JSON.parse(text)
        return json
      } catch (e) {
        return text
      }
    } else {
      // not ok
      try {
        const json = JSON.parse(text)
        throw Error(`${response.status} ${response.statusText} - ${json.message}`)
      } catch (e) {
        throw Error(`${response.status} ${response.statusText} - ${text}`)
      }
    }
  } catch (e) {
    throw e
  }
}