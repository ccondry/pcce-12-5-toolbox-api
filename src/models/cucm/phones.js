const lib = require('./lib')
const axl = require('./axl')
const ris = require('./ris')

module.exports = {
  create
}

// router.get('/', async function (req, res) {
//   console.log(`received request to GET /phones`)
//   try {
//     // use the userid because AXL and RIS search patterns are different
//     // but both rely on the lab user id
//     const userid = req.query.userid
//     // find all DNs ending with user ID, and all devices with DNs ending with user ID
//     const info = axl.listDevicesAndDns('%' + userid)
//     // get RIS status of all devices ending with user ID
//     const status = ris.getStatus('*' + userid)
//     // wait for status RIS and AXL SQL query to finish
//     const promiseData = await Promise.all([info, status])
//     // make sure promise data is in an array, even if a single object was returned
//     let infoData
//     if (Array.isArray(promiseData[0])) {
//       infoData = promiseData[0]
//     } else if (typeof promiseData[0] === 'object') {
//       infoData = [promiseData[0]]
//     } else {
//       infoData = []
//     }
//     let statusData
//     if (Array.isArray(promiseData[1])) {
//       statusData = promiseData[1]
//     } else if (typeof promiseData[1] === 'object') {
//       statusData = [promiseData[1]]
//     } else {
//       statusData = []
//     }
//     try {
//       // try to merge status data and info data
//       for (let device of infoData) {
//         // check that statusData exists before operating on it
//         if (statusData && Array.isArray(statusData)) {
//           let s = statusData.find(v => v.name === device.name)
//           if (s) {
//             device.registrationAttempts = s.registrationAttempts
//             device.status = s.status
//             device.statusReason = s.statusReason
//             device.dirNumber = s.dirNumber
//           }
//         }
//       }
//     } catch (e) {
//       // continue
//     }
//     // console.log(results)
//     return res.status(200).send({results: infoData})
//   } catch (error) {
//     // error during processing
//     console.log(error)
//     return res.status(500).send({error})
//   }
// })
//
// router.delete('/:pattern', async function (req, res) {
//   const pattern = req.params.pattern
//   console.log(`received request to DELETE /phones/${pattern}`)
//   try {
//     // find phone and dn
//     const device = await axl.listDevicesAndDns(pattern)
//     // make sure we just found 1 matching record
//     if (typeof device === 'object' && !Array.isArray(device)) {
//       // const device = devices[0]
//       // check if this is an LCP phone
//       if (device.name.startsWith('LCP')) {
//         try {
//           // also delete the associated RCP phone and DN
//           await axl.removePhone({name: 'RCP' + device.name.slice(3)})
//           // delete the associated RCP dialed number
//           await axl.removeLine({
//             pattern: '3' + device.dialed_number.slice(1),
//             routePartitionName: req.query.routePartitionName || process.env.ROUTE_PARTITION
//           })
//         } catch (e) {
//           // log and continue
//           console.log('failed to delete LCP phone associated with', device)
//         }
//       }
//       // delete the phone
//       await axl.removePhone({name: device.name})
//       // delete the dialed number
//       await axl.removeLine({
//         pattern: device.dialed_number,
//         routePartitionName: req.query.routePartitionName || process.env.ROUTE_PARTITION
//       })
//       return res.status(202).send()
//     } else {
//       // found more than one matching object
//       return res.status(400).send({error: `No device found with DN pattern matching ${pattern}`})
//     }
//   } catch (error) {
//     // error during processing
//     console.log(error)
//     return res.status(500).send({error})
//   }
// })

async function create (body) {
  // console.log('received request to create CUCM phone:', body)
  try {
    body.routePartitionName = body.routePartitionName || process.env.ROUTE_PARTITION
    switch (body.type) {
      case 'mobileAgentLocal': {
        // LCP phone
        body.type = 'LCP'
        // body.pattern = '1070' + body.userid
        // console.log('creating LCP phone', body)
        await lib.createMobileAgentPhone(axl, body)
        return
      }
      case 'mobileAgentRemote': {
        // RCP phone
        body.type = 'RCP'
        // body.pattern = '1060' + body.userid
        // console.log('creating RCP phone', body)
        await lib.createMobileAgentPhone(axl, body)
        return
      }
      case 'jabber': {
        // create jabber for desktop phone
        // console.log('creating Jabber for Desktop phone', body)
        await lib.createJabberDesktopPhone(axl, body)
        return res.status(201).send()
      }
      case 'virtual': {
        // create virtual phone
        body.virtualDnPrefix = process.env.VIRTUAL_DN_PREFIX
        // console.log('creating CTIRD virtual phone', body)
        await lib.createVirtualPhone(axl, body)
        return
      }
      case 'camelot': {
        // create camelot phone
        // console.log('creating Camelot virtual phone', body)
        await lib.createCamelotPhone(axl, body)
        return
      }
      case 'ipc': {
        // create IP Communicator
        body.model = 'IP Communicator'
        body.product = 'Cisco IP Communicator'
        body.protocol = 'SCCP'
        body.phoneButtonTemplateName = 'Standard CIPC SCCP'
        // create hard phone
        // console.log(`creating ${body.model} ${body.protocol} hard phone`, body)
        await lib.createHardPhone(axl, body)
        return
      }
      case 'dx650': {
        body.model = 'DX650'
        body.product = 'Cisco DX650'
        body.protocol = 'SIP'
        // create hard phone
        // console.log(`creating ${body.model} ${body.protocol} hard phone`, body)
        await lib.createHardPhone(axl, body)
        return
      }
      case 'dx70': {
        body.model = 'DX70'
        body.product = 'Cisco DX70'
        body.protocol = 'SIP'
        // create hard phone
        // console.log(`creating ${body.model} ${body.protocol} hard phone`, body)
        await lib.createHardPhone(axl, body)
        return
      }
      case 'dx80': {
        body.model = 'DX80'
        body.product = 'Cisco DX80'
        body.protocol = 'SIP'
        // create hard phone
        // console.log(`creating ${body.model} ${body.protocol} hard phone`, body)
        await lib.createHardPhone(axl, body)
        return
      }
      default: {
        // console.log('phone type', body.type, 'not recognized')
        throw new Error('phone type ' + body.type + ' not recognized')
      }
    }
  } catch (error) {
    throw error
  }
}
