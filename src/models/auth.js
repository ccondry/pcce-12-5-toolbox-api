// var db = require('src/mongodb')
var hat = require('hat')

module.exports = {
  authenticate ({user, pass, success, fail}) {
    //TODO add real authentication and JWT
    // create token
    const token = hat()
    // return the token
    success(token)
  }
}
