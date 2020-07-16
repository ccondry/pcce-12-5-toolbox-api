const db = require('./db')

async function getPhones (req, res) {
  console.log(`received request to GET camelot phones`)
  try {
    // find all camelot phones
    const results = await db.find('toolbox', 'camelot.phones', {}, {_id: 0})
    if (results !== null) {
      return results
    } else {
      throw new Error('No camelot phones found')
    }
  } catch (error) {
    throw error
  }
}

module.exports = {
  getPhones
}
