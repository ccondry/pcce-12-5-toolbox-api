const MongoClient = require('mongodb').MongoClient
// make sure environment file is loaded
require('dotenv').config()

const url = process.env.LOGGER_DB_URL
const clientOptions = { useNewUrlParser: true, poolSize: 5 }

// connection pool reference
let client

// create connection pool
function connect () {
  return new Promise((resolve, reject) => {
    if (!url) {
      reject('process.env.MONGO_URL is not defined. please add this to the .env file.')
    }
    try {
      MongoClient.connect(url, clientOptions, function(connectError, dbClient) {
        if (connectError) {
          reject(connectError)
        } else {
          console.log('cloud mongo db connected')
          client = dbClient
          resolve(dbClient)
        }
      })
    } catch (e) {
      reject(e)
    }
  })
}

function find (db, collection, query = {}, projections) {
  return new Promise((resolve, reject) => {
    try {
      client.db(db).collection(collection).find(query).project(projections)
      .toArray(function (queryError, doc) {
        // check for error
        if (queryError) reject(queryError)
        // success
        else resolve(doc)
      })
    } catch (e) {
      reject(e)
    }
  })
}

function insertOne (db, collection, data) {
  return new Promise((resolve, reject) => {
    try {
      client.db(db).collection(collection).insertOne(
        data,
        function(queryError, doc) {
          if (queryError) reject(queryError)
          else resolve(doc)
        }
      )
    } catch (e) {
      reject(e)
    }
  })
}

module.exports = {
  client,
  connect,
  find,
  insertOne
}
