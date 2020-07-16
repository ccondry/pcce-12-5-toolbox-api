const db = require('./db')

async function get (query) {
  try {
    const data = await db.find('toolbox', 'routing', query)
    if (data !== null) {
      return data
    } else {
      throw new Error(`No routing configurations found for ${query}`)
    }
  } catch (error) {
    // error during processing
    console.log('failed to get routing info:', error.message)
    throw error
  }
}

async function save (body) {
  if (!body.contact || !body.userId) {
    throw new Error('input body must contain the following properties: contact, userId')
  }
  try {
    // insert record
    const result = await db.insert('toolbox', 'routing', {
      userId,
      contact
    })
    console.log(`successfully added routing information to local toolbox db`)
    // respond CREATED
    return
  } catch (error) {
    throw error
  }
}
//
// async function remove (req, res) {
//   console.log(`received request to DELETE from ${collection}`)
//   if (!req.query.contact || !req.query.userId) {
//     return res.status(400).send({error: 'request query parameters required: contact, userId'})
//   }
//   try {
//     // delete record
//     const result = await db.remove(collection, req.query)
//     console.log(`successfully deleted ${req.query.contact} from ${collection}`)
//     // respond ACCEPTED
//     return res.sendStatus(202)
//   } catch (error) {
//     // some other error
//     console.log(`failed to delet ${req.query.contact} from ${collection}`, error.message)
//     return res.status(500).send({error: error.message})
//   }
// }

module.exports = {
  get,
  save
  // delete: remove
}
