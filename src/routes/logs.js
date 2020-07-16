var express = require('express')
var router = express.Router()
var db = require('../mongodb')

// get logs
router.get('/:collection', function (req, res, next){
  console.log('getting logs for collection ' + req.params.collection)
  try {
    db.get(req.params.collection, data => {
      res
      .set("Content-type", "application/json; charset=utf-8")
      .send(JSON.stringify(data, null, 2));
    })
  } catch (e) {
    console.log('db error:', e)
    res.json(e)
  }
})

module.exports = router
