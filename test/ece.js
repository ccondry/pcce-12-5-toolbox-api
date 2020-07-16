require('dotenv').config()
const provision = require('../src/models/provision/index.js')

// const departmentName = '0325'
// const chatMrdId = 5004
// const chatScriptSelectorId = 5065

// provision.ece.client.queue.create({
//   departmentName,
//   callIdentifier: departmentName,
//   queueName: 'chat',
//   scriptSelectorId: chatScriptSelectorId,
//   mrdId: chatMrdId,
//   maxTaskLimit: 5000
// }).then(results => {
//   console.log('create ECE queue results:', JSON.stringify(results, null, 2))
// }).catch(e => console.log('error creating ECE queue:', e.message))

// provision.ece.client.queue.find({
//   queueName: 'chat',
//   departmentName: '0325'
// }).then(results => {
//   console.log('find ECE queue results:', JSON.stringify(results, null, 2))
// }).catch(e => console.log('error finding ECE queue:', e.message))

provision.ece.client.department.find({
  name: 1121
})
.then(results => {
  console.log('find ECE department results:', JSON.stringify(results, null, 2))
})
.catch(e => console.log('error finding ECE department:', e.message))
