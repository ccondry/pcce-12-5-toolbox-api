require('dotenv').config()
const provision = require('../src/models/provision/index')
// CCE client
const cce = require('../src/models/cce')
NODE_EXTRA_CA_CERTS='extra-CAs.pem'

// go
// findTeamId('CumulusUWF')
// .then(r => console.log('found team ID:', r))
// .catch(e => console.log(e.message))

// cceGet({
//   type: 'agent',
//   query: '',
//   find (v) {
//     // console.log(v)
//     return v.person.userName === 'rbarrows0325@dcloud.cisco.com'
//   }
// })
// .then(r => console.log('found agent:', JSON.stringify(r, null, 2)))
// .catch(e => console.log(e.message))

provision.cceGetId({
  type: 'skillGroup',
  query: 'globaldepartment:only',
  find (v) {
    return v.name === 'CumulusMCALChat'
  }
})
.then(r => console.log('found mcalChatSkillGroupId:', JSON.stringify(r, null, 2)))
.catch(e => console.log(e.message))


async function findTeamId (name) {
  const query = 'globaldepartment:only'
  const type = 'agentTeam'
  try {
    // search for CCE object
    let item = await cceGet({
      type,
      query,
      find (v) {return v.name === name}
    })
    // find anything?
    if (item) {
      console.log('found', type, query)
      // found item - return ID
      return getId(item)
    } else {
      console.log('did not find', type, query)
      return null
    }
  } catch (e) {
    throw e
  }
}

// get CCE object
async function cceGet ({type, query, find}) {
  try {
    console.log('searching for ' + type, query)
    // search for existing items
    const items = await cce.list(type, query)
    console.log(`cceGet found ${items.length} ${type} objects`)
    // get the 1 item we are looking for
    const item = items.find(find)
    let itemId
    if (item) {
      // return item
      return item
    } else {
      return null
    }
  } catch (e) {
    console.error('failed to cceGet', type, query, e.message)
    throw e
  }
}

// extract CCE object's ID (as a string)
function getId (item) {
  return item.refURL.split('/').pop()
}