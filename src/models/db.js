/*
This provides some simple async methods for using a mongo database
*/
const MongoClient = require('mongodb').MongoClient

if (!process.env.MONGO_URL) {
  console.error('pcce-12-5-api - process.env.MONGO_URL is not defined. Please configure this variable in .env file.')
} else {
  try {
    const redacted = process.env.MONGO_URL.split('@').pop()
    console.log('process.env.MONGO_URL =', redacted)
  } catch (e) {
    console.log('process.env.MONGO_URL is set, but failed to redact the password from that URL, so not displaying it here.')
  }
}

// Connection URL
const url = process.env.MONGO_URL
const connectOptions = {
  useNewUrlParser: true,
  poolSize: 5,
  useUnifiedTopology: true
}

// get authenticated mongo client
function getClient () {
  return new Promise(function (resolve, reject) {
    // connect to mongo and then return the client
    MongoClient.connect(url, connectOptions, function (err, client) {
      // check for error
      if (err) {
        return reject(err)
      } else {
        resolve(client)
      }
    })
  })
}

function find (db, collection, query = {}, projections) {
  return new Promise((resolve, reject) => {
    // get mongo client
    getClient()
    .then(client => {
      client.db(db).collection(collection)
      .find(query).project(projections)
      .toArray(function (queryError, doc) {
        // close the client connection
        client.close()
        // check for error
        if (queryError) reject(queryError)
        // success
        else resolve(doc)
      })
    })
    .catch(e => {
      // failed to get client
      reject(e)
    })
  })
}

// mongo find one (returns object)
function findOne (db, collection, query, options) {
  return new Promise((resolve, reject) => {
    // get mongo client
    getClient()
    .then(client => {
      // find one!
      client.db(db).collection(collection).findOne(query, options, function (err, result) {
        // close the client connection
        client.close()
        // check for error
        if (err) reject(err)
        // success
        else resolve(result)
      })
    })
    .catch(e => {
      // failed to get client
      reject(e)
    })
  })
}

// mongo insert
function insertOne (db, collection, data) {
  return new Promise((resolve, reject) => {
    // get mongo client
    getClient()
    .then(client => {
      // insert!
      client.db(db).collection(collection).insertOne(data, function (err, result) {
        // close the client connection
        client.close()
        // check for error
        if (err) reject(err)
        // success
        else resolve(result)
      })
    })
    .catch(e => {
      // failed to get client
      reject(e)
    })
  })
}

// mongo upsert (update existing or insert new if not exist)
function upsert (db, collection, query, data) {
  return new Promise((resolve, reject) => {
    // get mongo client
    getClient()
    .then(client => {
      // upsert!
      client.db(db).collection(collection).findOneAndReplace(query, data, { upsert: true }, function (err, result) {
        // close the client connection
        client.close()
        // check for error
        if (err) reject(err)
        // success
        else resolve(result)
      })
    })
    .catch(e => {
      // failed to get client
      reject(e)
    })
  })
}

// mongo updateOne (update one existing record)
function updateOne (db, collection, filter, query) {
  return new Promise((resolve, reject) => {
    // get mongo client
    getClient()
    .then(client => {
      // update one
      client.db(db).collection(collection).updateOne(filter, query, function (err, result) {
        // close the client connection
        client.close()
        // check for error
        if (err) reject(err)
        // success
        else resolve(result)
      })
    })
    .catch(e => {
      // failed to get client
      reject(e)
    })
  })
}

function removeOne (db, collection, query) {
  return new Promise((resolve, reject) => {
    // get mongo client
    getClient()
    .then(client => {
      // go
      client.db(db).collection(collection).removeOne(query, function (err, result) {
        // close the client connection
        client.close()
        // check for error
        if (err) reject(err)
        // success
        else resolve(result)
      })
    })
    .catch(e => {
      // failed to get client
      reject(e)
    })
  })
}

module.exports = {
  find,
  findOne,
  insertOne,
  removeOne,
  updateOne,
  upsert
}
