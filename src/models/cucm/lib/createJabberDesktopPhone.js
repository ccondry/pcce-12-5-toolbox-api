const createOrGetLine = require('./createOrGetLine')

// provision a virtual extension agent phone for a user
module.exports = async function createAgentPhone(axl, {
  pattern,
  username,
  alertingName = '',
  routePartitionName = '',
  ctiuser = process.env.CTI_USER,
  name
}) {
  // validate input
  if (!pattern || !pattern.length) {
    throw '"pattern" must be provided and be a 6 digit numerical string'
  }
  // create phone parameters
  // device name cannot exceed 15 characters
  if (!name || !name.length) {
    // set default name
    name = (process.env.JABBER_DEVICE_NAME_PREFIX || 'CSF') + username.toUpperCase()
  }
  const description = `${username} Jabber ${pattern}`

  // make sure the device is not already created
  let error
  try {
    console.log(`checking if device ${name} already exists`)
    // device exists
    const results = await axl.getPhone({name})
    console.log(`device ${name} already exists`)
    // set error
    error = `${name} already exists.`
  } catch (e) {
    // device does not exist - continue
    console.log(`device ${name} does not exist. continuing.`)
  }
  // throw error now, if one happened
  if (error) {
    throw error
  }

  // get or create the line UUID
  const lineUuid = await createOrGetLine(axl, {
    pattern,
    routePartitionName,
    alertingName,
    description
  })

  // create the phone device
  try {
    console.log(`creating phone device ${name}`)
    const addPhoneResults = await axl.addPhone({
      name,
      description,
      product: 'Cisco Unified Client Services Framework',
      class: 'Phone',
      protocol: 'SIP',
      protocolSide: 'User',
      devicePoolName: process.env.DEVICE_POOL,
      phoneButtonTemplateName: 'Standard Client Services Framework',
      commonPhoneConfigName: 'Standard Common Phone Profile',
      locationName: 'Hub_None',
      // useDevicePoolCgpnTransformCss: 'true',
      ownerUserName: username,
      presenceGroupName: 'Standard Presence group',
      callingSearchSpaceName: process.env.CALLING_SEARCH_SPACE,
      // rerouteCallingSearchSpaceName: process.env.CALLING_SEARCH_SPACE,
      // enableCallRoutingToRdWhenNoneIsActive: 'true',
      deviceSecurityProfile: 'Cisco Unified Client Services Framework - Standard SIP Non-Secure Profile',
      sipProfile: 'Standard SIP Profile',
      lines: [{
        line: {
          index: 1,
          dirn: {
            '$': {
              uuid: lineUuid
            }
          },
          associatedEndusers: [{
            enduser: {
              userId: username
            }
          }],
          maxNumcalls: 2,
          busyTrigger: 1
        }
      }]
    })
    // extract device UUID
    deviceUuid = addPhoneResults.slice(1, addPhoneResults.length - 1)
  } catch (e) {
    console.error('failed to create phone device', e)
    throw e
  }
  // device complete
  // now associate the device with the app user, for CTI control of device
  try {
    await axl.associateDeviceWithApplicationUser(deviceUuid.toLowerCase(), ctiuser)
  } catch (e) {
    throw e
  }

  // associate the device with the end user
  try {
    await axl.associateDeviceWithEndUser(deviceUuid.toLowerCase(), username)
  } catch (e) {
    throw e
  }

}
