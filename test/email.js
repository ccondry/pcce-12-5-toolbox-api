const nodemailer = require('nodemailer')
require('dotenv').load()

// create reusable transporter object using the default SMTP transport
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'cispurplenile@gmail.com',
//     pass: 'egain@123'
//   }
// })

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: 'exch01.cdxdemo.net',
  port: '25',
  secure: false,
  // auth: {
  //   user: 'support',
  //   pass: 'Cisco123cisco'
  // }
})


const mailOptions = {
  from: `"Coty Condry" <ccondry@cisco.com>`,
  to: 'support@cdxdemo.net',
  subject: 'test',
  text: 'test', // plain text body
  html: '' // html body
}


// const mailOptions = {
//   from: `"Jimothy Timston" <jtimston@cdxdemo.net>`,
//   to: 'ccondry@cisco.com',
//   subject: 'test',
//   text: 'test', // plain text body
//   html: '' // html body
// }


// send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log('error: ', error)
  } else {
    console.log('Message %s sent: %s', info.messageId, info.response)
  }
})
