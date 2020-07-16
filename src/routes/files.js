const express = require('express')
const router = express.Router()
const { lstatSync, readdirSync, mkdirSync } = require('fs')
const { join } = require('path')
const formidable = require('formidable')

const getStats = source => {
  const getFileStats = name => {
    const stats = lstatSync(join(source, name))
    // console.log(stats)
    return {
      name,
      path: source,
      isFile: stats.isFile(),
      isDirectory: stats.isDirectory(),
      atimeMs: stats.atimeMs,
      mtimeMs: stats.mtimeMs,
      ctimeMs: stats.ctimeMs,
      birthtimeMs: stats.birthtimeMs,
      size: stats.size
    }
  }

  return readdirSync(source).map(getFileStats)
}

router.get('/', async function (req, res, next) {
  try {
    // allow subfolder path to be specified in url query param
    const path = ('/' + req.query.path) || ''
    console.log(`listing files for ${path}`)
    // don't allow listing paths above the defined user root path
    if (path.indexOf('..') >= 0) {
      const error = {
        message: `You may not use '..' to reference directories in this API.`
      }
      return res.status(403).send({error})
    }
    // get file names and stats
    const files = getStats(process.env.WEB_FILES_DIR + path)
    // return files list
    return res.status(200).send(files)
  } catch (error) {
    console.error(error)
    return res.status(500).send({error})
  }
})

router.post('/upload', async function (req, res, next) {
  try {
    // allow subfolder path to be specified in url query param
    const path = req.query.path || ''
    console.log(`uploading files to ${process.env.WEB_FILES_DIR}/${path}`)
    // verify that user owns folder
    if (!req.user.admin && path.indexOf(req.user.username) !== 0 && path.indexOf(`/${req.user.username}`) !== 0 && path.indexOf(`//${req.user.username}`) !== 0) {
      const error = {
        message: `You may only upload files into your own user directory.`,
        details: `You tried to upload file(s) to ${path}, which is not a folder you own. Please set path to a value starting with /${req.user.username}`
      }
      return res.status(403).send({error})
    }
    // don't allow listing paths above the defined user root path
    if (path.indexOf('..') >= 0) {
      const error = {
        message: `You may not use '..' to reference directories in this API.`
      }
      return res.status(403).send({error})
    }
    // creates a new incoming form.
    let form = new formidable.IncomingForm()
    // parse a file upload
    form.parse(req)
    form.on('fileBegin', function (name, file){
      console.log('form - fileBegin')
      file.path = `${process.env.WEB_FILES_DIR}/${path}/${file.name}`
    })

    form.on('file', function (name, file){
      console.log(`Uploaded new file as ${file.path}`)
    })
    form.on('end', function () {
      console.log('form end')
      // return CREATED
      return res.status(201).send()
    })
  } catch (error) {
    console.error(error)
    return res.status(500).send({error})
  }
})

router.post('/mkdir', async function (req, res, next) {
  try {
    // allow subfolder path to be specified in url query param
    const path = req.query.path || ''
    console.log(`${req.user.username} requested to create directory ${process.env.WEB_FILES_DIR}/${path}`)
    // verify that user owns folder
    if (!req.user.admin && // user is not admin
      path !== `/${req.user.username}` && // path is not /username
      // path !== `//${req.user.username}` && // path is not /username
      // path.indexOf(req.user.username) !== 0 &&
      path.indexOf(`/${req.user.username}/`) !== 0 // path doesn't start with /username/
      // path.indexOf(`//${req.user.username}`) !== 0
    ) {
      const error = {
        message: `You may only upload files into your own user directory.`,
        details: `You tried to create directory ${path}, which is not in a folder you own. Please set path to a value starting with /${req.user.username}`
      }
      return res.status(403).send({error})
    }
    // don't allow listing paths above the defined user root path
    if (path.indexOf('..') >= 0) {
      const error = {
        message: `You may not use '..' to reference directories in this API.`
      }
      return res.status(403).send({error})
    }
    // make directory
    mkdirSync(`${process.env.WEB_FILES_DIR}/${path}`)
    // return CREATED
    return res.status(201).send()
  } catch (error) {
    console.error(error)
    return res.status(500).send({error})
  }
})

module.exports = router
