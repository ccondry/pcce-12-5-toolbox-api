const createOrGetLine = require('./createOrGetLine')

// provision a virtual extension agent phone for a user
module.exports = async function (axl, {
  pattern,
  mac,
  username,
  alertingName = '',
  routePartitionName = '',
  model,
  product,
  protocol,
  phoneButtonTemplateName,
  ctiuser = process.env.CTI_USER
}) {
  // validate input
  if (!pattern || pattern.length !== 5) {
    throw '"pattern" must be provided and be a 5 digit numerical string'
  }
  const cleanMac = mac.replace(/:/g, '').toUpperCase()
  if (!mac) {
    throw '"mac" must be provided and be 12 hexadecimal characters'
  } else if(cleanMac.length !== 12) {
    throw '"mac" must be provided and be 12 hexadecimal characters'
  }
  // create phone parameters
  const name = 'SEP' + cleanMac
  const description = `${username} ${model} ${pattern}`

  // device UUID - need to make or find this
  let deviceUuid

  // make sure the device is not already created
  let existingPhone
  try {
    // console.log(`checking if device ${name} already exists...`)
    // device exists
    existingPhone = await axl.getPhone({name})
  } catch (e) {
    // device does not exist - continue
    console.log(`device ${name} does not exist. continuing.`)
  }

  // so is there an existing phone?
  if (existingPhone) {
    // console.log(`device ${name} already exists. deleting existing phone...`)
    // remove the existing phone with that name
    await axl.removePhone({name})
    console.log(`device ${name} deleted successfully.`)
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
      product,
      protocol,
      phoneButtonTemplateName: phoneButtonTemplateName || `${model} ${protocol}`,
      deviceSecurityProfile: `${model} - Standard ${protocol} Non-Secure Profile`,
      sipProfile: protocol === 'SIP' ? 'Standard SIP Profile' : '',
      class: 'Phone',
      devicePoolName: process.env.DEVICE_POOL,
      protocolSide: 'User',
      builtInBridge: 'On',
      commonPhoneConfigName: 'Standard Common Phone Profile',
      locationName: 'Hub_None',
      // useDevicePoolCgpnTransformCss: 'true',
      ownerUserName: username,
      presenceGroupName: 'Standard Presence group',
      callingSearchSpaceName: process.env.CALLING_SEARCH_SPACE,
      // rerouteCallingSearchSpaceName: process.env.CALLING_SEARCH_SPACE,
      // enableCallRoutingToRdWhenNoneIsActive: 'true',
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
