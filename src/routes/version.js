const express = require('express')
const router = express.Router()
const pkg = require('../../package.json')

// echo the name and version of this project/package
router.get('/', function (req, res, next) {
  return res.send({
    name: pkg.name,
    version: pkg.version
  })
})

module.exports = router
