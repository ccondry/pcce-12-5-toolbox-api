const db = require('./db')

const defaults = {
  vertical: 'finance'
}

// get user's Cumulus config from database
async function get (userId) {
  try {
    const projection = {_id: 0}
    // look up user config in database
    const config = await db.findOne('toolbox', 'cumulus.config', {userId}, {projection})
    // return config if it exists
    if (config) return config
    // return default config since user config did not exist
    else return defaults
  } catch (e) {
    // rethrow errors
    throw e
  }
}

// insert or replace user config in database
function save (userId, config) {
  config.userId = userId
  return db.upsert('toolbox', 'cumulus.config', {userId}, config)
}

module.exports = {
  get,
  save
}
