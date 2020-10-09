require('dotenv').config()
const deprovision = require('../src/models/deprovision')
// const db = require('../src/models/db')

main({id: '1706'}).catch(e => console.log(e))

// async function getProvision (user) {
//   const username = user.username
//   const userId = user.id
//   const query = { $or: [ {username}, {userId} ] }
//   const provision = await db.findOne('toolbox', 'provision', query)
//   // return empty object if provision is null (not found)
//   return provision || {}
// }

async function main (user) {
  // delete CCE agents
  await deprovision.departmentItems('agent', user.id)
  // delete CCE campaigns
  await deprovision.campaigns(user.id)
  // get user's provision info
  // const provision = await getProvision(user)
  // console.log(provision)
  // delete all user's PQs
  await deprovision.departmentItems('precisionQueue', user.id)

  await deprovision.departmentItems('skillGroup', user.id)
  // delete PQ attributes
  await deprovision.departmentItems('attribute', user.id)
  // delete CCE teams
  await deprovision.departmentItems('agentTeam', user.id)
  // delete call type
  await deprovision.departmentItems('callType', user.id)
  // delete dialed numbers
  await deprovision.dialedNumbers(user.id)
  // await deprovision.departmentItems('dialedNumber', user.id)
  // delete department admin
  await deprovision.departmentAdmin(user.id)
  // delete department
  await deprovision.department(user.id)
  // done
  console.log('deprovision user', user.id, 'done')
  process.exit(0)
}
