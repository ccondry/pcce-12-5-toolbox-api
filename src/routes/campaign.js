const express = require('express')
const router = express.Router()
const campaign = require('../models/campaign')

router.get('/', async function (req, res, next) {
  // get list of campaigns for this user
  try {
    const campaigns = await campaign.list(req.user.id)
    // console.log(campaigns)
    // make sure it is only campaigns whose name ends with _userId
    const regex = new RegExp('_' + req.user.id + '$')
    const myCampaigns = campaigns.campaigns[0].campaign.filter(v => v.name.match(regex))
    return res.status(200).send(myCampaigns)
  } catch (e) {
    console.log('failed to get campaigns list', e)
    return res.status(500).send({message: e.message})
  }
})

function getDepartmentName (campaign) {
  return campaign.skillGroupInfos[0].skillGroupInfo[0].skillGroup.department.name
}

router.get('/:id/record', async function (req, res, next) {
  // get dialing records for campaign

  // validate ownership
  let existing
  try {
    existing = await campaign.get(req.params.id)
  } catch (e) {
    console.log('failed to get campaign records for', req.user.username, ':', e)
    const message = `Could not validate your ownership of campaign ${req.params.id}`
    return res.status(500).send({message})
  }
  try {
    // console.log(JSON.stringify(existing, null, 2))
    if (getDepartmentName(existing) !== String(req.user.id)) {
      throw Error('')
    }
  } catch (e) {
    return res.status(403).send(`Campaign ${req.params.id} is not yours`)
  }

  try {
    const records = await campaign.listRecords(req.params.id)
    return res.status(200).send(records)
  } catch (e) {
    console.log(`failed to get dialing records for campaign ${req.params.id}`, e)
    return res.status(500).send({message: e.message})
  }
})

router.post('/:id/record', async function (req, res, next) {
  // add dialing records to campaign

  // validate ownership
  const existing = await campaign.get(req.params.id)
  try {
    if (getDepartmentName(existing) !== String(req.user.id)) {
      throw Error('')
    }
  } catch (e) {
    return res.status(403).send(`Campaign ${req.params.id} is not yours`)
  }

  try {
    await campaign.uploadRecords(req.params.id, req.body.records, req.body.overwrite)
    return res.status(200).send()
  } catch (e) {
    console.log(`failed to upload dialing records to campaign ${req.params.id}`, e.message)
    if (e.status && e.json) {
      return res.status(e.status).send(e.json)
    } else {
      return res.status(500).send({message: e.message})
    }
  }
})

router.delete('/:id/record', async function (req, res, next) {
  // delete all dialing records from campaign

  // validate ownership
  const existing = await campaign.get(req.params.id)
  try {
    if (getDepartmentName(existing) !== String(req.user.id)) {
      throw Error('')
    }
  } catch (e) {
    return res.status(403).send(`Campaign ${req.params.id} is not yours`)
  }

  try {
    await campaign.deleteRecords(req.params.id)
    return res.status(200).send()
  } catch (e) {
    console.log(`failed to delete dialing records ${req.params.recordId} from campaign ${req.params.id}`, e.message)
    return res.status(500).send({message: e.message})
  }
})

module.exports = router
