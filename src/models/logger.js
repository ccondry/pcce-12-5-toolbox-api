const pkg = require('../../package.json')
const db = require('./logger-db')

async function log (data) {
  // set timestamp if not set
  data.datetime = data.datetime || new Date().toJSON()
  // set package name and version
  data.app = pkg.name
  data.version = pkg.version
  // default to info level
  data.level = data.level || 'info'
  return db.insertOne(data)
}

async function get (query, queryOptions) {
  return db.find(query, queryOptions)
}


module.exports = {
  log,
  get
}
