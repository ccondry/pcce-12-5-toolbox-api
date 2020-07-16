const db = require('./db')

module.exports = {
  get: async function (query) {
    // don't retrieve _id
    const projection = {_id: 0}
    // find one
    return db.findOne('toolbox', 'demos', query, {projection})
  },
  save: async function (query, data) {
    // make sure _id is not present
    delete data._id
    // upsert
    return db.upsert('toolbox', 'demos', query, data)
  }
}
