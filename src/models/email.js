const nodemailer = require('nodemailer')

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.email_host,
  port: process.env.email_port,
  secure: process.env.email_secure === 'true'
})

module.exports = {
  send: (mailOptions, datacenter, sessionId) => {
    return new Promise((resolve, reject) => {
      // send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('error: ', error)
          reject(error)
        } else {
          console.log('Message %s sent: %s', info.messageId, info.response)
          resolve(info)
        }
      })
    })
  }
}
