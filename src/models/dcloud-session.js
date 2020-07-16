/**
This loads the session.xml file that is created by the dCloud topology
**/

const fs = require('fs')
const parser = require('./parsers')

let session = {}

const sessionFile = process.env.DCLOUD_SESSION_XML || '/dcloud/session.xml'

function readSessionFile () {
  // console.log('reading dCloud session information from file', sessionFile)
  // read the dcloud session file and return the contents of the DIDs section
  try {
    data = fs.readFileSync(sessionFile, 'utf8')
    // parse xml to json object
    const json = parser.xml2js(data)
    // extract the relevant info
    session = json.session
    // console.log('successfully parsed dCloud session information file into JSON')
  } catch (e) {
    console.error('failed to read and parse dCloud session information file', sessionFile, ':', e)
    return
  }
}

// read session file now
readSessionFile()

// re-read the session file every 5 minutes, to make sure we have the latest data
const interval = setInterval(readSessionFile, 1000 * 60 * 5)

module.exports = {
  get () {
    return session
  }
}
