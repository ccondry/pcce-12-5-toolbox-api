const createOrGetLine = require('./createOrGetLine')

// provision a virtual extension agent phone for a user
module.exports = async function (axl, {
  pattern,
  lcpPattern,
  type,
  username,
  alertingName = '',
  routePartitionName = '',
  ctiuser = process.env.CTI_USER,
  userid
}) {
  // validate input
  if (!pattern || pattern.length !== 8) {
    throw '"pattern" must be provided and be an 8 character string of numbers'
  }
  // validate input
  if (!type || (type.toUpperCase() !== 'RCP' && type.toUpperCase() !== 'LCP')) {
    throw '"type" must be provided and be either RCP or LCP'
  }
  // create phone parameters
  const name = type.toUpperCase() + lcpPattern
  const description = `${username} Mobile Agent ${type.toUpperCase() === 'RCP' ? 'Remote' : 'Local'} ${pattern}`

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
      product: 'CTI Port',
      class: 'Phone',
      protocol: 'SCCP',
      protocolSide: 'User',
      devicePoolName: process.env.DEVICE_POOL,
      // phoneButtonTemplateName: 'Standard Client Services Framework',
      commonPhoneConfigName: 'Standard Common Phone Profile',
      locationName: 'Hub_None',
      // useDevicePoolCgpnTransformCss: 'true',
      ownerUserName: username,
      presenceGroupName: 'Standard Presence group',
      callingSearchSpaceName: process.env.CALLING_SEARCH_SPACE,
      // rerouteCallingSearchSpaceName: process.env.CALLING_SEARCH_SPACE,
      // enableCallRoutingToRdWhenNoneIsActive: 'true',
      deviceSecurityProfile: 'Cisco CTI Port - Standard SCCP Non-Secure Profile',
      // sipProfile: 'Standard SIP Profile',
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
  // device created

  // associate the device with the app user, for CTI control of device
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
