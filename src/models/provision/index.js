// mongo DB client
const db = require('../db')
// CCE client
const cce = require('../cce')
// cucm AXL and RIS client
const cucm = require('../cucm')

const adminModel = require('./demo-user/administrator')
const departmentModel = require('./demo-user/department')
const callTypeModel = require('./demo-user/call-type')
const teamModel = require('./demo-user/agent-team')
const baModel = require('./demo-user/boolean-attribute')
const paModel = require('./demo-user/proficiency-attribute')
const pqModel = require('./demo-user/precision-queue')
const certPqModel = require('./demo-user/certification-precision-queue')
const sgModel = require('./demo-user/skill-group')
const agentModel = require('./demo-user/agent')
const dnModel = require('./demo-user/dialed-number')
const roleModel = require('./demo-user/role')
const demoSelectors = require('./demo-user/demo-selectors')

// CUIC client
const cuic = require('../cuic')

// ECE client
const ece = require('../ece')

// eGain client
const egain = require('../egain')

// Camelot TCL client
// const camelot = require('../camelot')

// finesse lib
const finesse = require('../finesse')

// ldap lib
const ldap = require('../ldap')

// email account creation lib
const createEmail = require('./create-email')

// string constants
console.log('process.env.CCE_MRD_VOICE', process.env.CCE_MRD_VOICE)
console.log('process.env.CCE_MRD_EMAIL', process.env.CCE_MRD_EMAIL)
console.log('process.env.CCE_MRD_CHAT', process.env.CCE_MRD_CHAT)
// console.log('process.env.CCE_MRD_TASK', process.env.CCE_MRD_TASK)
const CCE_MRD_VOICE = process.env.CCE_MRD_VOICE || '1'
const CCE_MRD_EMAIL = process.env.CCE_MRD_EMAIL || '5000'
const CCE_MRD_CHAT = process.env.CCE_MRD_CHAT || '5002'
// const CCE_MRD_TASK = process.env.CCE_MRD_TASK || '5003'

// max retries for CCE operations to get 401 error
const maxRetries = 50

// const departmentAdminUsernameSuffix = '_admin'
async function getCceDepartment (username) {
  try {
    const departments = await retryCceList('department', {q: username})
    // return the department object, or null if not found
    return departments.find(v => v.name === username) || null
  } catch (e) {
    throw e
  }
}

// extract CCE object's ID (as a string)
function getId (item) {
  return item.refURL.split('/').pop()
}

// search for CCE object and return the ID, or if not found create it and then
// return the ID
// return cceCreateOrGetId({
//   type: 'department',
//   query: {q: userId},
//   data: departmentModel({name: userId}),
//   find (v) {return v.name === userId}
// })
async function cceCreateOrGetId ({type, query, find, data, update = false}) {
  try {
    // search for CCE object
    let item = await cceGet({type, query, find})
    // find anything?
    if (item) {
      // found item
      // console.log('found', type, query)
      // get item ID
      const id = getId(item)
      // if update flag set, update item to original data
      if (update) {
        // update item to make sure it is valid/updated
        await cceModify({type, id, item, data})
      }
      // return item ID
      return id
    } else {
      // console.log('did not find', type, query)
      // not found - create and return the ID
      return cceCreate({type, data})
    }
  } catch (e) {
    throw e
  }
}

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
      // console.log('found', type, query)
      // found item - return ID
      return getId(item)
    } else {
      // console.log('did not find', type, query)
      return null
    }
  } catch (e) {
    throw e
  }
}
async function retryCceCreate (type, data) {
  return retryCce('create', type, data)
}
async function retryCceList (type, query) {
  return retryCce('list', type, query)
}
async function retryCceModify (type, id, data) {
  return retryCce('modify', type, id, data)
}

async function retryCce (operation, type, data1, data2) {
  let lastError
  let count = 0
  for (let i = 0; i < maxRetries; i++) {
    try {
      items = await cce[operation](type, data1, data2)
      if (count > 0) {
        console.log(`retryCce ${operation} ${type} success after ${count} retries`)
      }
      return items
    } catch (e) {
      lastError = e
      if ([401, 503].includes(e.response.status)) {
        count++
        continue
      } else {
        throw e
      }
    }
  }
  throw lastError
}

// create CCE object and return the ID
async function cceCreate ({type, data}) {
  try {
    // console.debug('creating', type, JSON.stringify(data, null, 2), '...')
    // console.log('creating', type, '...')
    // create new item and get that new ID
    const newItem = await retryCceCreate(type, data)
    // console.log('newItem =', newItem)
    itemId = newItem.split('/').pop()
    // console.log(type, 'created.', type, 'ID =', itemId)
    // return item ID
    return itemId
  } catch (e) {
    if (e.response && e.response.data) {
      console.error('failed to create CCE', type, e.message, e.response.data)
    } else {
      console.error('failed to create CCE', type, e.message, e)
    }

    throw e
  }
}


// get CCE object
async function cceGet ({type, query, find}) {
  try {
    const items = await retryCceList(type, query)
    // return the 1 item we are looking for
    const item = items.find(find)
    if (item) {
      // return item
      return item
    } else {
      return null
    }
  } catch (e) {
    throw Error(`failed to cceGet ${type} ${query}: ${e.message}`)
  }
}

// find CCE object and return its ID
async function cceGetId ({type, query, find}) {
  try {
    const item = await cceGet({type, query, find})
    // get the 1 item we are looking for
    let itemId
    if (item) {
      // get ID of existing item
      itemId = getId(item)
      // console.log(type + ' found:', itemId)
      // return item ID
      return itemId
    } else {
      return null
    }
  } catch (e) {
    console.error('failed to cceGetId ' + type, query, e.message)
    throw e
  }
}

// update CCE object
async function cceModify ({type, id, item, data}) {
  // console.log('cceModify', type, id, 'item =', item)
  // console.log('cceModify', type, id, 'data =', data)
  // copy data so we don't modify original data object
  const dataCopy = JSON.parse(JSON.stringify(data))
  // set changestamp
  dataCopy.changeStamp = item.changeStamp
  try {
    // update CCE object
    await retryCceModify(type, id, dataCopy)
  } catch (e) {
    // failed to update CCE object. log and rethrow.
    console.error('failed to update CCE ' + type, id, e.message)
    throw e
  }
}

async function getStatus ({
  username,
  userId
}) {
  try {
    // construct department admin username
    // const adminUsername = username + departmentAdminUsernameSuffix

    // query to filter CCE searches to only items in the user's department
    const query = {q: `globaldepartment:none departments:(${userId})`}

    // console.log('getting provision status for', username, userId)
    const status = {
      // ldapAccount: null,
      // ldapAccountEnabled: null,
      departmentAdminLdapAccount: null,
      departmentAdminLdapAccountEnabled: null,
      supervisorLdapAccount: null,
      supervisorLdapAccountEnabled: null,
      agent1LdapAccount: null,
      agent1LdapAccountEnabled: null,
      agent2LdapAccount: null,
      agent2LdapAccountEnabled: null,
      department: null,
      departmentAdmin: null,
      callTypes: [],
      teams: [],
      booleanAttributes: [],
      proficiencyAttributes: [],
      // mrds: [],
      voicePqs: [],
      chatPqs: [],
      emailPqs: [],
      taskPqs: [],
      skillGroups: [],
      agents: [],
      supervisors: [],
      eceAgents: [],
      // outboundAgentDialedNumbers: [],
      // outboundIvrDialedNumbers: [],
      contactPoints: [],
      demos: null
    }

    // get contact points (user routing)
    status.contactPoints = await db.find('toolbox', 'routing', {username})

    // console.log('getting CCE department admin ldap user', username)
    try {
      const user = await ldap.getUser(username)
      // console.log('found CCE department admin user LDAP account matching', username)
      // user found - already provisioned for this part
      status.departmentAdminLdapAccount = user
      // is user enabled in LDAP?
      status.departmentAdminLdapAccountEnabled = (user.userAccountControl & 2) != 2
    } catch (e) {
      if (e.statusCode === 404) {
        console.log('CCE department admin user LDAP account not found matching', username)
      } else {
        console.log('error searching for CCE department admin LDAP account:', e)
      }
    }

    try {
      const name = 'sjeffers' + userId
      // console.log('getting CCE supervisor ldap user for', name)
      const user = await ldap.getUser(name)
      // console.log('found CCE supervisor user LDAP account matching', name)
      // user found - already provisioned for this part
      status.supervisorLdapAccount = user
      // is user enabled in LDAP?
      status.supervisorLdapAccountEnabled = (user.userAccountControl & 2) != 2
    } catch (e) {
      if (e.statusCode === 404) {
        console.log('CCE supervisor user LDAP account not found matching', 'sjeffers' + userId)
      } else {
        console.log('error searching for CCE supervisor LDAP account:', e)
      }
    }

    try {
      const name = 'jopeters' + userId
      // console.log('getting CCE agent 1 ldap user for', name)
      const user = await ldap.getUser(name)
      // console.log('found CCE agent 1 user LDAP account matching', name)
      // user found - already provisioned for this part
      status.agent1LdapAccount = user
      // is user enabled in LDAP?
      status.agent1LdapAccountEnabled = (user.userAccountControl & 2) != 2
    } catch (e) {
      if (e.statusCode === 404) {
        console.log('CCE agent 1 user LDAP account not found matching', 'jopeters' + userId)
      } else {
        console.log('error searching for CCE agent 1 LDAP account:', e)
      }
    }

    try {
      const name = 'hliang' + userId
      // console.log('getting CCE agent 2 ldap user for', name)
      const user = await ldap.getUser(name)
      // console.log('found CCE agent 2 user LDAP account matching', name)
      // user found - already provisioned for this part
      status.agent2LdapAccount = user
      // is user enabled in LDAP?
      status.agent2LdapAccountEnabled = (user.userAccountControl & 2) != 2
    } catch (e) {
      if (e.statusCode === 404) {
        console.log('CCE agent 2 user LDAP account not found matching', 'hliang' + userId)
      } else {
        console.log('error searching for CCE agent 2 LDAP account:', e)
      }
    }



    // don't do this next step any more, because we want main username to be department admin

    // look for the department administrator LDAP account
    // console.log('getting department administrator LDAP account for', username)
    // const departmentAdmin = await hydra({
    //   service: process.env.hydra_ldap_service,
    //   method: 'get',
    //   path: 'user',
    //   query: {username: adminUsername}
    // })

    // if (departmentAdmin.statusCode === 200) {
    //   // user found - already provisioned for this part
    //   status.departmentAdminLdapAccount = departmentAdmin.body
    //   // is user enabled in LDAP?
    //   status.departmentAdminLdapAccountEnabled = (departmentAdmin.body.userAccountControl & 2) != 2
    // }

    status.department = await getCceDepartment(userId)

    // let departmentId

    // only get the rest if the department exists
    if (status.department) {
      // console.log('department', userId, 'found')
      // department ID
      // departmentId = status.department.refURL.split('/').pop()

      // department admin account in CCE
      status.departmentAdmin = await cceGet({
        type: 'administrator',
        query: username,
        find (v) {return v.userName === username}
      })

      // CCE Teams
      status.teams = await retryCceList('agentTeam', query)

      // Call Types
      status.callTypes = await retryCceList('callType', query)

      // PQ Attributes
      const attributes = await retryCceList('attribute', query)

      // Boolean PQ Attributes
      status.booleanAttributes = attributes.filter(v => v.dataType === '3')

      // proficiency PQ Attribute
      status.proficiencyAttributes = attributes.filter(v => v.dataType === '4')

      // Precision Queues
      const myPqs = await retryCceList('precisionQueue', query)

      // extract voice, chat, email, task PQs
      status.voicePqs = myPqs.filter(v => {
        return v.mediaRoutingDomain.refURL.split('/').pop() === CCE_MRD_VOICE
      })
      status.chatPqs = myPqs.filter(v => {
        return v.mediaRoutingDomain.refURL.split('/').pop() === process.env.CCE_MRD_CHAT
      })
      status.emailPqs = myPqs.filter(v => {
        return v.mediaRoutingDomain.refURL.split('/').pop() === CCE_MRD_EMAIL
      })
      status.taskPqs = myPqs.filter(v => {
        return v.mediaRoutingDomain.refURL.split('/').pop() === process.env.CCE_MRD_TASK
      })

      // get outbound skillgroups
      status.skillGroups = await retryCceList('skillGroup', query)

      // get agents
      const agents = await retryCceList('agent', query)

      // regular agents
      status.agents = agents.filter(v => v.supervisor == false || v.supervisor === 'false')

      // supervisor agents
      status.supervisors = agents.filter(v => v.supervisor == true || v.supervisor === 'true')

      // get dialed numbers in department
      // const dialedNumbers = await retryCceList('dialedNumber', query)

      // outbound agent campaign dialed numbers
      // status.outboundAgentDialedNumbers = dialedNumbers.filter(v => v.callType.refURL.split('/').pop() === process.env.cce_agent_campaign_ct_id)
      // outbound IVR campaign dialed numbers
      // status.outboundIvrDialedNumbers = dialedNumbers.filter(v => v.callType.refURL.split('/').pop() === process.env.cce_ivr_campaign_ct_id)

      // get demo selector configs for user
      status.demos = await getDemoSelectors(userId)

      // get ECE agents matching the CCE agents
      status.eceAgents = await getEceAgents(agents)

      // get eGain agents matching the CCE agents
      status.egainAgents = await getEgainAgents(agents)
    }

    // return OK with status in body
    return status
  } catch (e) {
    // error during processing
    console.log('failed to get provisioning status:', e)
    throw  e
  }
}

async function createLdapUser (body) {
  try {
    // search for the user first
    const user = await ldap.getUser(body.username)
    // console.log('LDAP user', body.username, 'already exists.')
    // set password on the existing user
    await ldap.resetPassword({
      adminDn: process.env.LDAP_ADMIN_DN,
      adminPassword: process.env.LDAP_ADMIN_PASSWORD,
      newPassword: body.password,
      username: body.username
    })
    // return the existing user
    return user
  } catch (e) {
    // not found - create it
    console.log('creating LDAP user', body.username)
    // create user
    await ldap.createUser(body)
    // search for the user now
    const user = await ldap.getUser(body.username)
    console.log('Found new LDAP user', body.username)
    return user
  }
}

async function createLdapCceAdminUser (user, password) {
  // trim username to 20 characters for sAMAccountName limitation
  let username
  if (user.username.length > 20) {
    username = user.username.slice(0, 20)
  }
  // construct body for request
  const body = {
    firstName: user.firstName,
    lastName: user.lastName,
    username,
    commonName: username,
    domain: process.env.LDAP_DOMAIN,
    physicalDeliveryOfficeName: user.id,
    telephoneNumber: '44' + user.id,
    userId: user.id,
    mail: user.email,
    description: 'CCE department administrator',
    usersDn: process.env.LDAP_CCE_ADMINS_DN
  }
  // log body without password
  // console.log('creating department admin user with body =', body)
  // add password to body
  body.password = password
  // create user in LDAP
  return createLdapUser(body)
}

function createAgentLdapUser ({
  firstName,
  lastName,
  username,
  userId,
  telephoneNumber,
  password
}) {
  // console.log('creating LDAP user in group', process.env.LDAP_CCE_AGENTS_GROUP_DN)
  // construct body for request
  const body = {
    firstName,
    lastName,
    username,
    domain: process.env.LDAP_DOMAIN,
    physicalDeliveryOfficeName: userId,
    telephoneNumber,
    userId,
    mail: username + '@' + process.env.LDAP_DOMAIN,
    usersDn: process.env.LDAP_CCE_AGENTS_DN
    // memberOf: process.env.ldap_cce_agents_group_dn
  }
  // log body without password
  // console.log('creating LDAP user. body:', body)
  // add password to body
  body.password = password
  //  create user in LDAP
  return createLdapUser(body)
}

// create or get CCE Department
async function createOrGetDepartment (userId, update) {
  // console.log('create or get CCE department for', userId)
  return cceCreateOrGetId({
    type: 'department',
    query: userId,
    data: departmentModel({name: userId}),
    find (v) {return v.name === userId},
    update
  })
}

// create CCE department admin
function createOrGetDepartmentAdmin ({
  departmentId,
  username,
  roleId,
  update
}) {
  // console.log('create or get CCE department administrator for', username)
  return cceCreateOrGetId({
    type: 'administrator',
    query: username,
    data: adminModel({
      userName: username,
      departmentId,
      roleId
    }),
    find (v) {
      return v.userName === username
    },
    update
  })
}

// return CCE search query object to filter objects to those in user's department
function getDepartmentQuery (userId) {
  // return {q: `globaldepartment:none departments:(${userId})`}
  return userId
}

// create or get Call Type for the user
function createOrGetCallType ({name, departmentId, userId, update, survey}) {
  return cceCreateOrGetId({
    type: 'callType',
    query: getDepartmentQuery(userId),
    data: callTypeModel({name, departmentId, survey}),
    find (v) {return v.name === name},
    update
  })
}


// create or get Team for the user
function createOrGetTeam ({departmentId, name, userId, update}) {
  return cceCreateOrGetId({
    type: 'agentTeam',
    query: getDepartmentQuery(userId),
    data: teamModel({
      name,
      departmentId
    }),
    find (v) {return v.name === name},
    update
  })
}

// create or get Boolean PQ Attribute for the user
function createOrGetBooleanAttribute (departmentId, userId, update) {
  return cceCreateOrGetId({
    type: 'attribute',
    query: getDepartmentQuery(userId),
    data: baModel({name: 'User_' + userId, departmentId}),
    find (v) {return v.dataType === '3'},
    update
  })
}

// create or get Proficiency PQ Attribute for the user
function createOrGetProficiencyAttribute (update) {
  const name = 'Cumulus'
  return cceCreateOrGetId({
    type: 'attribute',
    query: 'globaldepartment:only',
    data: paModel({name}),
    find (v) {return v.dataType === '4' && v.name === name},
    update
  })
}

// create or get Voice PQ for the user
function createOrGetVoicePq ({
  departmentId,
  userId,
  booleanAttributeId,
  proficiencyAttributeId,
  update
}) {
  return cceCreateOrGetId({
    type: 'precisionQueue',
    query: getDepartmentQuery(userId),
    data: pqModel({
      departmentId,
      mrdId: CCE_MRD_VOICE,
      name: `Cumulus_${userId}`,
      booleanAttributeId,
      proficiencyAttributeId
    }),
    find (v) {
      return getId(v.mediaRoutingDomain) === CCE_MRD_VOICE
      && v.name === `Cumulus_${userId}`
    },
    update
  })
}

// create or get UWF Voice PQ for the user
function createOrGetUwfPq ({
  departmentId,
  userId,
  booleanAttributeId,
  proficiencyAttributeId,
  update
}) {
  return cceCreateOrGetId({
    type: 'precisionQueue',
    query: getDepartmentQuery(userId),
    data: pqModel({
      departmentId,
      mrdId: CCE_MRD_VOICE,
      name: `CumulusUWF_${userId}`,
      booleanAttributeId,
      proficiencyAttributeId
    }),
    find (v) {
      return getId(v.mediaRoutingDomain) === CCE_MRD_VOICE
      && v.name === `CumulusUWF_${userId}`
    },
    update
  })
}

// create or get Skill Group for the user
function createOrGetSkillGroup({
  userId,
  name,
  departmentId,
  mrdId = CCE_MRD_VOICE,
  update
}) {
  return cceCreateOrGetId({
    type: 'skillGroup',
    userId,
    query: name,
    data: sgModel({
      name,
      mrdId,
      departmentId
    }),
    find (v) {
      return v.name === name
    },
    update
  })
}

// create or get Certification PQ for the user
function createOrGetCertificationPq ({
  departmentId,
  userId,
  booleanAttributeId,
  proficiencyAttributeId,
  update
}) {
  return cceCreateOrGetId({
    type: 'precisionQueue',
    query: getDepartmentQuery(userId),
    data: certPqModel({
      departmentId,
      mrdId: CCE_MRD_VOICE,
      name: `CumulusCertification_${userId}`,
      booleanAttributeId,
      proficiencyAttributeId
    }),
    find (v) {
      // console.log('v', v)
      return getId(v.mediaRoutingDomain) === CCE_MRD_VOICE
      && v.name === `CumulusCertification_${userId}`
    },
    update
  })
}

// create or get Chat PQ for the user
async function createOrGetChatPq ({
  departmentId,
  userId,
  booleanAttributeId,
  proficiencyAttributeId,
  update
}) {
  return cceCreateOrGetId({
    type: 'precisionQueue',
    query: getDepartmentQuery(userId),
    data: pqModel({
      departmentId,
      mrdId: process.env.CCE_MRD_CHAT,
      name: `CumulusChat_${userId}`,
      booleanAttributeId,
      proficiencyAttributeId
    }),
    find (v) {
      return getId(v.mediaRoutingDomain) === process.env.CCE_MRD_CHAT
    },
    update
  })
}

// create or get Email PQ for the user
async function createOrGetEmailPq ({
  departmentId,
  userId,
  booleanAttributeId,
  proficiencyAttributeId,
  update
}) {
  return cceCreateOrGetId({
    type: 'precisionQueue',
    query: getDepartmentQuery(userId),
    data: pqModel({
      departmentId,
      mrdId: CCE_MRD_EMAIL,
      name: `CumulusEmail_${userId}`,
      booleanAttributeId,
      proficiencyAttributeId
    }),
    find (v) {
      return getId(v.mediaRoutingDomain) === CCE_MRD_EMAIL
    },
    update
  })
}

// create or get Task Routing PQ for the user
function createOrGetTaskPq ({
  departmentId,
  userId,
  booleanAttributeId,
  proficiencyAttributeId,
  update
}) {
  return cceCreateOrGetId({
    type: 'precisionQueue',
    query: getDepartmentQuery(userId),
    data: pqModel({
      departmentId,
      mrdId: process.env.CCE_MRD_TASK,
      name: `CumulusTask_${userId}`,
      booleanAttributeId,
      proficiencyAttributeId
    }),
    find (v) {
      return getId(v.mediaRoutingDomain) === process.env.CCE_MRD_TASK
    },
    update
  })
}

// create or get Agent for the user
function createOrGetAgent ({
  departmentId,
  userId,
  booleanAttributeId,
  proficiencyAttributeId,
  teamId,
  skillGroupIds,
  firstName,
  lastName,
  userName,
  agentId,
  supervisor,
  password,
  ssoEnabled,
  deskSettingsId,
  ecePerson,
  loginEnabled,
  screenName,
  supervisorTeamIds,
  update
}) {
  // build attributes array for creating agents
  const attributes = [
    {id: booleanAttributeId, value: true},
    {id: proficiencyAttributeId, value: 10}
  ]
  // create JSON body for REST
  const data = agentModel({
    departmentId,
    firstName,
    lastName,
    userName,
    agentId,
    ssoEnabled,
    teamId,
    password,
    supervisor,
    skillGroupIds,
    attributes,
    deskSettingsId,
    ecePerson,
    loginEnabled,
    screenName,
    supervisorTeamIds
  })

  // create agent
  return cceCreateOrGetId({
    type: 'agent',
    query: getDepartmentQuery(userId),
    data,
    find (v) {return v.person.userName === userName},
    update
  })
}

// get user demo selector configs
function buildDemoSelectors ({
  callTypeId,
  userId,
  voicePqId,
  certificationPqId,
  chatPqId,
  emailPqId,
  taskPqId
}) {
  return demoSelectors({
    callTypeId,
    callTypeName: 'Cumulus_' + userId,
    voicePqId,
    certificationPqId,
    chatPqId,
    emailPqId,
    taskPqId
  })
}

// update the demo selectors database with provided demos data
// this changes what happens when a user calls in to a specific phone number
function setDemoSelectors ({userId, demos}) {
  // for each type
  for (const type of Object.keys(demos)) {
    // for each dnis of this type
    for (const dnis of Object.keys(demos[type])) {
      // add to database
      // set up db query
      const query = { userId, type, dnis }
      // set up the data to store in the db
      const data = {userId, type, dnis, data: demos[type][dnis]}
      // add or update demo selectors object in the database
      db.upsert('toolbox', 'demo.selectors', query, data)
    }
  }
}

// update the demo selectors database with provided demos data
// this changes what happens when a user calls in to a specific phone number
async function getDemoSelectors (userId) {
  try {
    // set up db query
    const query = { userId }
    // find demo selectors for user
    const results = await db.find('toolbox', 'demo.selectors', query)
    // console.log('found getDemoSelectors results', results)
    const demos = {}
    for (const d of results) {
      // make sure the type exists
      if (!demos[d.type]) {
        demos[d.type] = {}
      }
      // add data
      Object.assign(demos[d.type], d.dnis, d.data)
    }
    // extract relevant data to return
    return demos
  } catch (e) {
    console.log('failed to get demo selectors for', userId, e.message)
    throw e
  }
}

async function createOrGetEceSupervisor ({
  username,
  firstName,
  lastName,
  skillTargetId,
  departmentName
}) {
  return createOrGetEceAgent({
    username,
    firstName,
    lastName,
    skillTargetId,
    departmentName
  })
}

async function createOrGetEceAgent ({
  username,
  firstName,
  lastName,
  skillTargetId,
  departmentName
}) {
  try {
    const response = await ece.findAgent({skillTargetId})
    let agent
    if (response) {
      // found
      // console.log('found ECE agent', skillTargetId)
      agent = response
    } else {
      // not found
      // console.log('did not find ECE agent', skillTargetId)
      // console.log('creating ECE agent', skillTargetId)
      // create agent
      await ece.addIcmAgent ({
        username,
        firstName,
        lastName,
        skillTargetId,
        departmentName
      })
      // console.log('created ECE ICM agent')
      // add roles to agent
      await ece.addRoles({skillTargetId})
      // console.log('added ECE agent roles')
      // find that new agent and return the object
      agent = await ece.findAgent({skillTargetId})
      // console.log('found newly-created ECE agent', username)
    }
    // extract usable user ID int
    const userId = Array.isArray(agent.USER_ID) ? agent.USER_ID[0] : agent.USER_ID
    // increase concurrent task limits for agent for chat queue
    // queue ID 1009 is chat queue
    await ece.setConcurrentTaskLimit({
      userId,
      queueId: process.env.ECE_CHAT_QUEUE_ID || 1009,
      concurrentTaskLimit: process.env.ECE_CHAT_QUEUE_CONCURRENT_TASKS || 5
    })
    // increase concurrent task limits for agent for email queue
    // queue ID 1010 is email queue
    await ece.setConcurrentTaskLimit({
      userId,
      queueId: process.env.ECE_EMAIL_QUEUE_ID || 1010,
      concurrentTaskLimit: process.env.ECE_EMAIL_QUEUE_CONCURRENT_TASKS || 5
    })
    // return the agent we found or created
    return agent
  } catch (e) {
    throw e
  }
}

async function createOrGetEgainSupervisor ({
  username,
  firstName,
  lastName,
  skillTargetId
}) {
  return createOrGetEgainAgent({
    username,
    firstName,
    lastName,
    skillTargetId
  })
}

async function createOrGetEgainAgent ({
  username,
  firstName,
  lastName,
  skillTargetId,
  departmentName = 'Service'
}) {
  try {
    // try to find agent first
    const response = await egain.findAgent({skillTargetId})
    if (response) {
      // egain agent found - return it
      // console.log('found ECE agent', skillTargetId, response)
      return response
    } else {
      // egain agent not found
      // console.log('did not find eGain agent', skillTargetId)
      // create agent
      await egain.addIcmAgent({username, firstName, lastName, skillTargetId, departmentName})
      // add roles to agent
      await egain.addRoles({skillTargetId})
      // find that new agent and return the object
      return await egain.findAgent({skillTargetId})
    }
  } catch (e) {
    throw e
  }
}

// get list of ECE agents that match input CCE agent objects in input array
async function getEceAgents (cceAgents) {
  try {
    const eceAgents = []
    // iterate over each CCE agent, retrieving the matching ECE agent
    for (agent of cceAgents) {
      const skillTargetId = getId(agent)
      const eceAgent = await ece.findAgent({skillTargetId})
      // if found, add to return array
      if (eceAgent) {
        eceAgents.push(eceAgent)
      }
    }
    // return array of ECE agents
    return eceAgents
  } catch (e) {
    throw e
  }
}

// get list of eGain agents that match input CCE agent objects in input array
async function getEgainAgents (cceAgents) {
  try {
    const egainAgents = []
    // iterate over each CCE agent, retrieving the matching eGain agent
    for (agent of cceAgents) {
      const skillTargetId = getId(agent)
      const egainAgent = await egain.findAgent({skillTargetId})
      // if found, add to return array
      if (egainAgent) {
        egainAgents.push(egainAgent)
      }
    }
    // return array of eGain agents
    return egainAgents
  } catch (e) {
    throw e
  }
}

function syncCuicCceSupervisors () {
  return cuic.syncCceSupervisors({
    host: process.env.CUIC_HOST,
    username: process.env.CUIC_USERNAME,
    password: process.env.CUIC_PASSWORD
  })
}


async function doCucmLdapSync () {
  console.log('syncing CUCM LDAP directory to add new users to CUCM...')
  return cucm.ldap.startSync()
}

async function getCucmLdapSync () {
  console.log('checking status of CUCM LDAP directory sync...')
  return cucm.ldap.getSyncStatus()
}

// create a phone on CUCM
async function createPhone (body) {
  // console.log('creating user phone', body)
  try {
    return await cucm.phones.create(body)
  } catch (e) {
    // check for phone exists error
    try {
      if (e.indexOf('already exists') >= 0) {
        // console.log('phone already exists:', body)
        // continue
        return
      } else {
        // other error - rethrow
        throw e
      }
    } catch (e2) {
      // failed to do e.indexOf - rethrow the original error
      throw e
    }
  }
}

async function phones ({
  alertingName,
  username,
  userid,
  counter,
  mobileAgent = false,
  audioUrl = 'file:///root/agent_audio_sandra.wav'
}) {
  if (mobileAgent) {
    // console.log('provisioning mobile agent LCP phone for', username)
    // mobile agent local phone
    try {
      await createPhone({
        pattern: '109' + counter + userid,
        lcpPattern: '109' + counter + userid,
        type: 'mobileAgentLocal',
        alertingName,
        username,
        userid
      })
    } catch (e) {
      console.log('could not create mobile agent LCP phone for', username, e.message)
    }

    // console.log('provisioning mobile agent RCP phone for', username)
    // mobile agent remote phone
    try {
      await createPhone({
        pattern: '209' + counter + userid,
        lcpPattern: '109' + counter + userid,
        type: 'mobileAgentRemote',
        alertingName,
        username,
        userid
      })
    } catch (e) {
      console.log('could not create mobile agent RCP phone for', username, e.message)
    }
  }

  // console.log('provisioning Jabber phone for', username)
  // Jabber
  try {
    await createPhone({
      pattern: '108' + counter + userid,
      type: 'jabber',
      alertingName,
      username,
      userid
    })
  } catch (e) {
    console.log('could not create Jabber phone for', username, e.message)
  }

  // console.log('provisioning Camelot virtual phone for', username)
  // // camelot virtual phone
  // try {
  //   // create CUCM phone
  //   await createPhone({
  //     pattern: '107' + counter + userid,
  //     type: 'camelot',
  //     alertingName,
  //     username,
  //     userid,
  //     mac: 'FFFF' + '107' + counter + userid
  //   })
  //
  //   // add to camelot's phone database
  //   console.log('adding camelot phone to database...')
  //   await saveCamelotPhone({
  //     extension: '107' + counter + userid,
  //     audioUrl
  //   })
  //   // if insert had no conflict, this is a new phone so also ask Camelot
  //   // to register this new phone now
  //   console.log('registering camelot phone with camelot server...')
  //   // register phone using camelot now
  //   await registerCamelotPhone({
  //     extension: '107' + counter + userid,
  //     audioUrl
  //   })
  // } catch (e) {
  //   console.log('could not create Camelot virtual phone for', username, e.message)
  // }

  // console.log('provisioning virtual E&C phone for', username)
  // virtual phone
  try{
    await createPhone({
      pattern: '106' + counter + userid,
      type: 'virtual',
      alertingName,
      username,
      userid
    })
  } catch (e) {
    console.log('could not create virtual E&C phone for', username, e.message)
  }

}

// save camelot phone line to database
// function saveCamelotPhone ({extension, audioUrl}) {
//   // update line in the database, if it already exists
//   return db.insert('camelot.phones', {extension, audioUrl})
// }
//
// // ask camelot to register a new phone on CUCM
// function registerCamelotPhone ({extension, audioUrl}) {
//   return camelot.registerPhone(extension, audioUrl)
// }

// copy Finesse layout XML config from team ID "from" to team ID "to"
async function copyLayoutConfig (from, to) {
  try {
    // console.log('copying Finesse layout config XML from', from, 'to', to)
    const layout = await finesse.getFromTeam(from, 'LayoutConfig')
    await finesse.saveToTeam(to, 'LayoutConfig', layout)
  } catch (e) {
    throw e
  }
}

// copy Finesse wrap up config from team ID "from" to team ID "to"
async function copyWrapUpConfig (from, to) {
  try {
    const config = await finesse.getFromTeam(from, 'WrapUpReasons')
    await finesse.saveToTeam(to, 'WrapUpReasons', config)
  } catch (e) {
    throw e
  }
}

// set Finesse layout XML for team
// expect plain, unescaped XML string in layoutXml
async function setLayoutConfig (teamId, layoutXml) {
  try {
    // build JSON for saveToTeam input
    const layout = {
      TeamLayoutConfig: {
        layoutxml: layoutXml.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'),
        useDefault: false
      }
    }
    // console.log('setting Finesse layout config XML for team ID', teamId)
    await finesse.saveToTeam(teamId, 'LayoutConfig', layout)
  } catch (e) {
    throw e
  }
}

// add user to group
function addToGroup (body) {
  return ldap.addToGroup(body)
}

function createOrGetCertificationProficiencyAttribute (update) {
  const name = 'CumulusCertification'
  return cceCreateOrGetId({
    type: 'attribute',
    query: name,
    data: paModel({name}),
    find (v) {return v.dataType === '4' && v.name === name},
    update
  })
}

function createOrGetUwfProficiencyAttribute (update) {
  const name = 'CumulusUWF'
  return cceCreateOrGetId({
    type: 'attribute',
    query: name,
    data: paModel({name}),
    find (v) {return v.dataType === '4' && v.name === name},
    update
  })
}

// provision outbound call type, dialed number, skill group, campaign
async function createOrGetOutboundCampaigns ({
  userId,
  type,
  model,
  dn,
  departmentId,
  update
}) {
  const callTypeName = 'CumulusOutbound' + type
  const callTypeDescription = 'Cumulus Outbound ' + type
  const dialedNumberDescription = 'Cumulus Outbound ' + type + ' ' + userId
  const campaignName = 'CumulusOutbound' + type + '_' + userId
  const campaignDescription = 'Cumulus Outbound ' + type + ' ' + userId
  const skillGroupName = 'CumulusOutbound' + type + '_' + userId

  // create/get global preview agent call type
  const callTypeId = await cceCreateOrGetId({
    type: 'callType',
    query: callTypeName,
    data: callTypeModel({
      name: callTypeName,
      description: callTypeDescription
    }),
    find (v) {
      return v.name === callTypeName
    },
    update: false
  })

  // create/get preview agent outbound dialed number
  const dialedNumberId = await cceCreateOrGetId({
    type: 'dialedNumber',
    query: getDepartmentQuery(userId),
    data: dnModel({
      dialedNumberString: dn,
      description: dialedNumberDescription,
      departmentId,
      callTypeId: callTypeId
    }),
    find (v) {
      return v.dialedNumberString === dn
    },
    update
  })

  // create outbound Agent Preview skillgroup in the Cisco_Voice MRD
  const skillGroupId = await createOrGetSkillGroup({
    userId,
    name: skillGroupName,
    departmentId,
    update
  })

  // new campaign details
  const data = model({
    name: campaignName,
    description: campaignDescription,
    dialedNumber: dn,
    skillGroupId
  })

  // create/get preview agent outbound campaign
  const campaignId = await cceCreateOrGetId({
    type: 'campaign',
    query: getDepartmentQuery(userId),
    data,
    find (v) {
      return v.name === campaignName
    },
    update
  })

  return {
    callTypeId,
    dialedNumberId,
    skillGroupId,
    campaignId
  }
}

// create/get the ToolboxUser role for department admins
async function createOrGetAdminRole (update) {
  return cceCreateOrGetId({
    type: 'role',
    query: 'ToolboxUser',
    find (v) {
      return v.name === 'ToolboxUser'
    },
    data: roleModel(),
    update
  })
}

module.exports = {
  getStatus,
  getCceDepartment,
  getId,
  createLdapCceAdminUser,
  createAgentLdapUser,
  createOrGetDepartment,
  createOrGetDepartmentAdmin,
  createOrGetCallType,
  createOrGetTeam,
  createOrGetBooleanAttribute,
  createOrGetProficiencyAttribute,
  createOrGetCertificationProficiencyAttribute,
  createOrGetUwfProficiencyAttribute,
  createOrGetUwfPq,
  createOrGetVoicePq,
  createOrGetSkillGroup,
  createOrGetCertificationPq,
  createOrGetChatPq,
  createOrGetEmailPq,
  createOrGetTaskPq,
  createOrGetAgent,
  createOrGetEceSupervisor,
  createOrGetEceAgent,
  createOrGetEgainSupervisor ,
  createOrGetEgainAgent,
  buildDemoSelectors,
  getDemoSelectors,
  setDemoSelectors,
  syncCuicCceSupervisors,
  doCucmLdapSync,
  getCucmLdapSync,
  createPhone,
  phones,
  copyLayoutConfig,
  setLayoutConfig,
  copyWrapUpConfig,
  addToGroup,
  createEmail,
  ece,
  cce,
  cceGet,
  findTeamId,
  cceCreateOrGetId,
  getDepartmentQuery,
  createOrGetOutboundCampaigns,
  createOrGetAdminRole,
  cceGetId
}
