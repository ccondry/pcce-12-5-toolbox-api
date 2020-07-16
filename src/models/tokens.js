const moment = require('moment')
const db = require('./db')

const findToken = async function (query) {
  try {
    const projection = {_id: 0}
    const results = await db.findOne('toolbox', 'tokens', query, {projection})
    if (results) {
      // token found - return results
      return results
    } else {
      // token not found
      throw new Error('Token not found.')
    }
  } catch (error) {
    // ... error checks
    console.log(`failed to get token`, error.message)
    throw error
  }
}

async function get (query) {
  // console.log(`looking up token`, query)
  const token = await findToken(query)
  // token found - now check expiry
  let diff = moment(token.expiry).diff(moment())
  // console.log('expiry diff', diff)
  if (diff < 0) {
    // expired token
    console.log('expired token:', token)
    throw Error('Token has expired.')
  }
  return token
}

module.exports = {get}
