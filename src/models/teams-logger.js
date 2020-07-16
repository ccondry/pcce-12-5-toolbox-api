const request = require('request-promise-native')
const package = require('../../package.json')
const os = require('os')
const dcloudSession = require('./dcloud-session')

// find env hostname
const hostname = os.hostname()

// trim message to 7439 bytes for Webex to accept it
function trimMessage (message) {
  // does message exceed max text size for Webex?
  if (Buffer.byteLength(message, 'utf8') > 7439) {
    // make a buffer of the message
    const buf1 = Buffer.from(message, 'utf8')
    // allocate max size buffer
    const buf2 = Buffer.allocUnsafe(7439)
    // copy to the max size buffer
    buf1.copy(buf2, 0, 0, 7439)
    // set message value to truncated message
    message = buf1.toString('utf8')
  }
  return message
}

// main log method
async function log () {
  let text = ''
  let markdown = ''

  if (!arguments.length) {
    // no arguments
    return
  }
  // has arguments
  for (const args of arguments) {
    if (typeof args === 'string') {
      // user passed a string
      text += trimMessage(args) + ' '
    } else if (typeof args === 'object') {
      // user passed an object
      // save trimmed text
      text += trimMessage(args.text || '')  + ' '
      // trim markdown, if exists
      if (args.markdown) {
        markdown += trimMessage(args.markdown) + ' '
      }
    }
  }
  // trim again
  text = trimMessage(text)
  markdown = trimMessage(markdown)

  if (!text && !markdown) {
    // empty or no log message, so do nothing
    console.log('empty log message passed to Teams Logger. noop.')
    return
  }

  if (!markdown) {
    // if no markdown set yet, add text as markdown
    markdown = text
  }

  // define text prefix for this service
  // const packageName = process.env.npm_package_name
  const packageName = package.name
  // const packageVersion = process.env.npm_package_version
  const packageVersion = package.version
  const sessionXml = dcloudSession.get()
  const session = sessionXml.id
  const datacenter = sessionXml.datacenter
  const textPrefix = `${packageName} ${packageVersion} on ${hostname} in ${datacenter} ${session}: `
  const markdownPrefix = `**${packageName} ${packageVersion}** on **${hostname}** in **${datacenter} ${session}**: `
  // add prefix to plaintext
  text = textPrefix + text
  // add prefix to markdown
  markdown = markdownPrefix + markdown

  // send message to room
  try {
    const response = await request({
      url: 'https://api.ciscospark.com/v1/messages',
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + process.env.WEBEX_LOG_BOT_TOKEN
      },
      body: {
        roomId: process.env.LOGS_ROOM_ID,
        text,
        markdown
      },
      json: true
    })
  } catch (e) {
    console.log('failed to log to Webex Teams room:', e.message)
  }
}

// define all levels as the same function for now
module.exports = {
  log,
  error: log,
  info: log,
  debug: log,
  warning: log
}
