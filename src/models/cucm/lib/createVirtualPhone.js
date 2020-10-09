const createOrGetLine = require('./createOrGetLine')

// provision a virtual extension agent phone for a user
module.exports = async function (axl, {
  pattern,
  username,
  alertingName = '',
  routePartitionName = '',
  ctiuser = process.env.CTI_USER,
  virtualDnPrefix = '444'
}) {
  // validate input
  if (!pattern || pattern.length !== 8) {
    throw '"pattern" must be provided and be an 8 character string of numbers'
  }
  // if (!name || !name.length) {
  //   throw '"name" must be provided and must be a string of 1 or more characters'
  // }
  // create virtual phone parameters from input
  const name = 'CTIRD' + pattern
  const description = `${username} virtual extension ${pattern}`
  const remoteDnPattern = virtualDnPrefix + pattern

  // make sure the device is not already created
  let error
  try {
    // console.log(`checking if device ${name} already exists`)
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
      product: 'CTI Remote Device',
      class: 'Phone',
      protocol: 'CTI Remote Device',
      protocolSide: 'User',
      devicePoolName: process.env.DEVICE_POOL,
      commonPhoneConfigName: 'Standard Common Phone Profile',
      locationName: 'Hub_None',
      useDevicePoolCgpnTransformCss: 'true',
      ownerUserName: username,
      presenceGroupName: 'Standard Presence group',
      callingSearchSpaceName: process.env.CALLING_SEARCH_SPACE,
      rerouteCallingSearchSpaceName: process.env.CALLING_SEARCH_SPACE,
      enableCallRoutingToRdWhenNoneIsActive: 'true',
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
  // phone is now created with a line
  try {
    // does remote destination already exist?
    await axl.getRemoteDestination({name: remoteDnPattern})
    // remote destination exists - delete it and we will recreate it
    await axl.removeRemoteDestination({name: remoteDnPattern})
  } catch (e) {
    // remote destination doesn't exist - add it now
  }

  try {
    // create remote destination for the phone, and associate it to the phone and user
    await axl.addRemoteDestination({
      name: remoteDnPattern,
      destination: remoteDnPattern,
      answerTooSoonTimer: '1500',
      answerTooLateTimer: '19000',
      delayBeforeRingingCell: '4000',
      ownerUserId: username,
      // remoteDestinationProfileName: '',
      ctiRemoteDeviceName: name,
      // dualModeDeviceName: '',
      isMobilePhone: 'true',
      enableMobileConnect: 'true'
      // lineAssociations: '',
      // timeZone: 'Etc/GMT',
      // todAccessName:
      // { _: 'TOD-RD-3c15875b-b80a-52a7-990b-5a6a30d07a59',
      // '$': { uuid: '{A363CD86-7EAA-4DED-BF8F-1D5489F0F3DF}' } },
      // mobileSmartClientName: '',
      // mobilityProfileName: '',
      // singleNumberReachVoicemail: 'Use System Default',
      // dialViaOfficeReverseVoicemail: 'Use System Default',
      // ringSchedule: '',
      // accessListName: ''
    })
  } catch (e) {
    throw e
  }

  // device complete
  // now associate the device with the app user, for CTI control of device
  try {
    await axl.associateDeviceWithApplicationUser(deviceUuid.toLowerCase(), ctiuser)
  } catch (e) {
    throw e
  }

}
