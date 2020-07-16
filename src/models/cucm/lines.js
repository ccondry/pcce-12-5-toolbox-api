const hydraExpress = require('hydra-express')
const express = hydraExpress.getExpress()
const router = express.Router()
const axl = require('./axl')

router.get('/', async function (req, res) {
  console.log(`received request to GET /lines`)
  try {
    const results = await axl.listLines({
      pattern: req.query.pattern || '%' + req.query.userId,
      routePartitionName: req.query.routePartitionName || process.env.ROUTE_PARTITION
    }, process.env.LIST_LINES_RETURNED_TAGS.split(','))
    return res.status(200).send({results})
  } catch (error) {
    // error during processing
    console.log(error)
    return res.status(500).send({error})
  }
})

router.delete('/:dn', async function (req, res) {
  console.log(`received request to DELETE /lines/${req.params.dn}`)
  try {
    await axl.removeLine({
      pattern: req.params.dn,
      routePartitionName: req.query.routePartitionName || process.env.ROUTE_PARTITION
    })
    return res.status(202).send()
  } catch (error) {
    // error during processing
    console.log(error)
    return res.status(500).send({error})
  }
})
//
// router.post('/create', async function (req, res) {
//   console.log(`received request to POST /phones/create`)
//   try {
//     const config = {
//       axl,
//       username: req.body.username,
//       alertingName: req.body.alertingName,
//       pattern: req.body.pattern,
//       routePartitionName: req.body.routePartitionName || process.env.ROUTE_PARTITION
//     }
//     switch (req.body.type) {
//       case 'mobileAgent': {
//         // create RCP and LCP phones
//         // LCP phone
//         config.type = 'LCP'
//         await lib.createMobileAgentPhone(config)
//         // RCP phone
//         config.type = 'RCP'
//         config.pattern = '3' + config.pattern.slice(1)
//         await lib.createMobileAgentPhone(config)
//         return res.status(201).send()
//       }
//       case 'jabber': {
//         // create jabber for desktop phone
//         await lib.createJabberDesktopPhone(config)
//         return res.status(201).send()
//       }
//       case 'virtual': {
//         // create virtual phone
//         config.virtualDnPrefix = process.env.VIRTUAL_DN_PREFIX
//         await lib.createVirtualPhone(config)
//         return res.status(201).send()
//       }
//       default: {
//         return res.status(400).send({error: 'phone type not recognized'})
//       }
//     }
//   } catch (error) {
//     // error during processing
//     console.log(error)
//     return res.status(500).send({error})
//   }
// })

module.exports = router
