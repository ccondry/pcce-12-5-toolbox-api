const express = require('express')
const router = express.Router()
const model = require('../models/agents')
const cce = require('../models/cce')
// ECE client
const ece = require('../models/ece')
// eGain client
const egain = require('../models/egain')

// list current agents for current user
router.get('/', async function (req, res, next) {
  console.log(`getting agents list for ${req.user.username}...`)
  try {
    // get list of agents for this user by searching based on user's ID
    const response = await model.list(req.user.id)
    console.log(`successfully got agents list for ${req.user.username}`)
    return res.status(response.statusCode).send(response.results)
  } catch (e) {
    console.log(`failed to get agents list for ${req.user.username}:`, e.message)
    return res.status(500).send(e.message)
  }
})

// list available agents for current user
router.get('/available', async function (req, res, next) {
  console.log(`getting available agent IDs list for ${req.user.username}`)
  try {
    // get list of agents for this user by searching based on user's ID
    const response = await model.list(req.user.id)

    // if they haven't created the supervisor yet, only offer them the supervisor ID
    const supervisorId = `40${req.user.id}`
    if (!response.results.find(v => v.agentId === supervisorId)) {
      // return 200 with the only the supervisor agent ID
      return res.status(200).send([supervisorId])
    }

    // create list of available agent IDs
    let available = []
    for (let i = 0; i < 10; i++) {
      available.push('4' + i + req.user.id)
    }

    // filter out in-use IDs
    for (let agent of response.results) {
      // get index of this agent ID in the available array
      let index = available.indexOf(agent.agentId)
      // if found
      if (index >= 0) {
        // remove this agent ID from available list
        available.splice(index, 1)
      }
    }

    // return 200 with the list of available agent IDs
    return res.status(200).send(available)
  } catch (error) {
    return res.status(500).send({error})
  }
})

// modify agent
router.post('/modify', async function (req, res, next) {
  // verify user owns agent ID specified
  console.log(`received request from ${req.user.username} to modify agent`)
  console.log('validating request to modify agent')
  if (!req.body || !req.body.agentId || req.body.agentId.length !== 5 || req.user.id !== req.body.agentId.slice(2)) {
    // invalid agentId
    const error = `invalid request to change agent password. agentId required, must to be 5 digits, and must end with '${req.user.id}'.`
    console.log(error)
    return res.status(403).send(JSON.stringify({error}, null, 2))
  }
  console.log(`validated request for ${req.user.username} to modify agent ${req.body.agentId}`)

  // update agent in CCE
  try {
    await cce.modify('agent', req.body)
    // success
    console.log(`${req.user.username} successfully modified agent ${req.body.agentId}`)
  } catch (e) {
    // failed to modify agent
    console.log(`failed to modify agent ${req.body.agentId} - CCE API response was`, e.message)
    // return CCE response data to client
    return res.status(500).send(e.message)
  }

  let skillTargetId
  try {
    skillTargetId = req.body.refURL.substring(req.body.refURL.lastIndexOf('/') + 1)
  } catch (e) {
    console.error('failed to get skill target ID from refURL:', e.message)
    return res.status(500).send(e.message)
  }

  // ECE
  try {
    // update agent last name in ECE
    await ece.modifyAgent({
      skillTargetId,
      attribute: 'LAST_NAME',
      value: req.body.person.lastName
    })
    // update agent first name in ECE
    await ece.modifyAgent({
      skillTargetId,
      attribute: 'FIRST_NAME',
      value: req.body.person.firstName
    })
  } catch (e) {
    console.error('failed to modify ECE agent:', e.message)
    return res.status(500).send(e.message)
  }
  // eGain
  try {
    // update agent last name in eGain
    await egain.modifyAgent({
      skillTargetId,
      attribute: 'LAST_NAME',
      value: req.body.person.lastName
    })
    // update agent first name in eGain
    await egain.modifyAgent({
      skillTargetId,
      attribute: 'FIRST_NAME',
      value: req.body.person.firstName
    })
  } catch (e) {
    console.error('failed to modify eGain agent:', e.message)
    return res.status(500).send(e.message)
  }
  
  // success
  return res.status(202).send()
})

// create an agent for the current user
router.post('/create', async function (req, res, next) {
  // validate the request
  if (!req.body.agentId || req.body.agentId.length !== 5 || req.user.id !== req.body.agentId.slice(2)) {
    // invalid agentId
    const error = `invalid request to create agent. agentId required, must to be 5 digits, and must end with '${req.user.id}'.`
    console.log(error)
    return res.status(403)
    .send(JSON.stringify({error}, null, 2))
  } else if (!req.body.firstName || req.body.firstName.length === 0) {
    // invalid firstName
    const error = `invalid request to create agent. firstName required.`
    console.log(error)
    return res.status(403)
    .send(JSON.stringify({error}, null, 2))
  } else if (!req.body.lastName || req.body.lastName.length === 0) {
    // invalid lastName
    const error = `invalid request to create agent. lastName required.`
    console.log(error)
    return res.status(403)
    .send(JSON.stringify({error}, null, 2))
  } else if (!req.body.password || req.body.password.length === 0) {
    // invalid lastName
    const error = `invalid request to create agent. lastName required.`
    console.log(error)
    return res.status(403)
    .send(JSON.stringify({error}, null, 2))
  } else {
    // probably valid request data
    let teamsResponse
    try {
      // make sure the team exists
      teamsResponse = await hydra({
        service: process.env.hydra_lab_config_service,
        path: 'cce/agentTeam',
        query: {q: req.user.username}
      })
      // console.log('teamsResponse', teamsResponse)
      let team = teamsResponse.results.find(v => v.name === req.user.username)
      if (!team) {
        // team not found
        console.log(`team ${req.user.username} not found. creating team.`)
        // create team
        const createTeamResponse = await hydra({
          service: process.env.hydra_lab_config_service,
          path: `cce/agentTeam`,
          method: 'post',
          body: {
            name: req.user.username,
            description: `${req.user.username} ${req.user.id}`
          }
        })
        if (createTeamResponse.statusCode < 200 || createTeamResponse.statusCode > 299) {
          // bad status code - return to client
          throw createTeamResponse
        }
        // retrieve new team info
        teamsResponse = await hydra({
          service: process.env.hydra_lab_config_service,
          path: 'cce/agentTeam',
          query: {q: req.user.username}
        })
        team = teamsResponse.results.find(v => v.name === req.user.username)
      }
      // team should exist now
      if (!team) {
        throw `Couldn't find or create team ${req.user.username}`
      }
      // create reference object for team
      const teamRef = {
        name: team.name,
        refURL: team.refURL
      }
      // make sure is_username attribute exists
      let attributesResponse = await hydra({
        service: process.env.hydra_lab_config_service,
        path: 'cce/attribute',
        query: {q: `is_${req.user.username}`}
      })
      // find the exact attribute
      let attribute = attributesResponse.results.find(v => v.name === `is_${req.user.username}`)
      let attributeRefs = []
      if (!attribute) {
        // attribute not found
        console.log(`attribute is_${req.user.username} not found. creating attribute.`)
        // create attribute
        const createAttributeResponse = await hydra({
          service: process.env.hydra_lab_config_service,
          path: `cce/attribute`,
          method: 'post',
          body: {
            department: '',
            name: `is_${req.user.username}`,
            description: `${req.user.username} ${req.user.id}`,
            dataType: 3, // boolean
            defaultValue: true
          }
        })
        if (createAttributeResponse.statusCode < 200 || createAttributeResponse.statusCode > 299) {
          console.log('failed to create attribute')
          // bad status code - return to client
          throw createAttributeResponse
        }
        // console.log('createAttributeResponse =', createAttributeResponse)
        // retrieve new attribute info
        attributesResponse = await hydra({
          service: process.env.hydra_lab_config_service,
          path: 'cce/attribute',
          query: {q: `is_${req.user.username}`}
        })
        // console.log('get attribute response =', attributesResponse)
        attribute = attributesResponse.results.find(v => v.name === `is_${req.user.username}`)
      }
      // attribute should exist now
      if (!attribute) {
        throw `Couldn't find or create attribute is_${req.user.username}`
      }
      // add attribute ref object to array
      attributeRefs.push({
        attribute: {
          name: attribute.name,
          refURL: attribute.refURL
        },
        attributeValue: true
      })

      // determine username
      let userName
      const supervisor = req.body.agentId.slice(0, 2) === `40`
      if (supervisor) {
        // supervisor user
        if (process.env.cce_sso_enabled === 'true') {
          // SSO username format
          userName = req.user.username
        } else {
          // non-SSO username format
          userName = req.user.upn
        }
      } else {
        // regular agent
        userName = req.body.agentId
      }

      // get skillgroup list from environment vars
      let skillgroupList = process.env.cce_default_skillgroups.split(',')
      // create list of skillGroup objects
      let skillGroupRefs = []
      // iterate over list of skillgroups, getting reference objects for each
      for (skillgroupName of skillgroupList) {
        // get skillgroup object
        let skillgroupResponse = await hydra({
          service: process.env.hydra_lab_config_service,
          path: 'cce/skillGroup',
          query: {q: skillgroupName}
        })
        if (skillgroupResponse.statusCode < 200 || skillgroupResponse.statusCode > 299) {
          console.warn(`failed to find skillgroup ${skillgroupName}`, skillgroupResponse)
          // continue
        }
        // find the exact skillgroup
        let skillgroup = skillgroupResponse.results.find(v => v.name === skillgroupName)
        // append skillgroup object to array
        skillGroupRefs.push({
          name: skillgroup.name,
          refURL: skillgroup.refURL
        })
      }

      // prep agent data
      const agentBody = {
        person: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          userName,
          password: req.body.password
        },
        department: '',
        description: `${req.user.username} ${req.user.id}`,
        agentId: req.body.agentId,
        supervisor, // boolean
        skillGroups: [{skillGroup: skillGroupRefs}],
        agentTeam: [teamRef],
        agentAttributes: [{agentAttribute: attributeRefs}]
      }
      // add supervised teams
      if (supervisor) {
        const teamRefs = [teamRef]
        agentBody.supervisorTeams = [{supervisorTeam: teamRefs}]
      }

      // create agent
      const createAgentResponse = await hydra({
        service: process.env.hydra_lab_config_service,
        path: `cce/agent`,
        method: 'post',
        body: agentBody
      })
      if (createAgentResponse.statusCode < 200 || createAgentResponse.statusCode > 299) {
        console.log('failed to create agent')
        // bad status code - return to client
        throw createAgentResponse
      }
      console.log(`successfully created agent ${req.body.agentId}`)// successfully created agent

      // if the agent is a supervisor, sync CUIC CCE supervisor accounts so that
      // gadgets for live data will work. this is not the login account for CUIC main UI.
      if (supervisor) {
        const syncCceSupervisorsResponse = await hydra({
          service: process.env.hydra_lab_config_service,
          path: `cuic/sync`,
          method: 'post'
        })
        console.log('syncCceSupervisorsResponse', syncCceSupervisorsResponse)
        if (syncCceSupervisorsResponse.statusCode < 200 || syncCceSupervisorsResponse.statusCode > 299) {
          // bad status code - log and continue
          console.log('failed to initiate CUIC sync of CCE supervisors')
        } else {
          // success
          console.log('successfully initiated sync of CUIC CCE supervisor accounts.')
        }
      }

      // TODO create the CUIC non-sso domain user account (for supervisor login), and set their access roles

      // find new agent to get skillTargetId
      const findNewAgent = await hydra({
        service: process.env.hydra_lab_config_service,
        path: 'agents',
        query: {q: userName}
      })
      // find exact new agent in results
      const newAgent = findNewAgent.results.find(v => v.person.userName === userName)
      // extract skillTargetId from refURL
      const skillTargetId = newAgent.refURL.substring(newAgent.refURL.lastIndexOf('/') + 1)
      // sync agent in ECE, set their roles and licenses
      const addEceAgent = await hydra({
        service: process.env.hydra_lab_config_service,
        path: `ece/agents`,
        method: 'post',
        body: {
          username: userName,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          skillTargetId
        }
      })
      if (addEceAgent.statusCode < 200 || addEceAgent.statusCode > 299) {
        // bad status code - log and continue
        console.log('failed to add agent to ECE')
      } else {
        // success
        console.log('successfully added agent to ECE')
      }

      // if supervisor, add ECE supervisor role to agent
      if (supervisor) {
        const findSupervisorRole = await hydra({
          service: process.env.hydra_lab_config_service,
          path: `ece/role`,
          method: 'get',
          query: {
            roleName: 'Supervisor'
          }
        })
        if (findSupervisorRole.statusCode < 200 || findSupervisorRole.statusCode > 299) {
          // bad status code - log and continue
          console.log('failed to find Supervisor role in ECE')
        } else {
          // success
          console.log('successfully found Supervisor role ID in ECE')
        }
        const supervisorRoleId = findSupervisorRole.results
        console.log('supervisor role ID = ', supervisorRoleId)

        const addAgentRole = await hydra({
          service: process.env.hydra_lab_config_service,
          path: `ece/agents/${skillTargetId}/role/add`,
          method: 'post',
          body: {
            roleId: supervisorRoleId
          }
        })
        if (addAgentRole.statusCode < 200 || addAgentRole.statusCode > 299) {
          // bad status code - log and continue
          console.log('failed to find add Supervisor role to agent in ECE')
        } else {
          // success
          console.log('successfully added Supervisor role to agent in ECE')
        }
      }

      // sync agent in eGain, and set their roles and licenses
      const addEgainAgent = await hydra({
        service: process.env.hydra_lab_config_service,
        path: `egain/agents`,
        method: 'post',
        body: {
          username: userName,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          skillTargetId
        }
      })
      if (addEgainAgent.statusCode < 200 || addEgainAgent.statusCode > 299) {
        // bad status code - log and continue
        console.log('failed to add agent to eGain')
      } else {
        // success
        console.log('successfully added agent to eGain')
      }

      // add Knowledge user role to eGain agent
      const findKnowledgeRole = await hydra({
        service: process.env.hydra_lab_config_service,
        path: `egain/role`,
        method: 'get',
        query: {
          roleName: 'Knowledge Base Manager'
        }
      })
      if (findKnowledgeRole.statusCode < 200 || findKnowledgeRole.statusCode > 299) {
        // bad status code - log and continue
        console.log('failed to find Knowledge Base Manager role in eGain')
      } else {
        // success
        console.log('successfully found Knowledge Base Manager role ID in eGain')
        console.log('findKnowledgeRole.results', findKnowledgeRole.results)
      }
      const knowledgeRoleId = findKnowledgeRole.results
      console.log('Knowledge Base Manager role ID = ', knowledgeRoleId)

      const addKnowledgeRole = await hydra({
        service: process.env.hydra_lab_config_service,
        path: `egain/agents/${skillTargetId}/role/add`,
        method: 'post',
        body: {
          roleId: knowledgeRoleId
        }
      })
      if (addKnowledgeRole.statusCode < 200 || addKnowledgeRole.statusCode > 299) {
        // bad status code - log and continue
        console.log('failed to add Knowledge Base Manager role to agent in eGain')
      } else {
        // success
        console.log('successfully added Knowledge Base Manager role to agent in eGain')
      }

      // if supervisor, add eGain supervisor role to agent
      if (supervisor) {
        const findSupervisorRole = await hydra({
          service: process.env.hydra_lab_config_service,
          path: `egain/role`,
          method: 'get',
          query: {
            roleName: 'Supervisor'
          }
        })
        if (findSupervisorRole.statusCode < 200 || findSupervisorRole.statusCode > 299) {
          // bad status code - log and continue
          console.log('failed to find Supervisor role in eGain')
        } else {
          // success
          console.log('successfully found Supervisor role ID in eGain')
        }
        const supervisorRoleId = findSupervisorRole.results
        console.log('supervisor role ID = ', supervisorRoleId)

        const addAgentRole = await hydra({
          service: process.env.hydra_lab_config_service,
          path: `egain/agents/${skillTargetId}/role/add`,
          method: 'post',
          body: {
            roleId: supervisorRoleId
          }
        })
        if (addAgentRole.statusCode < 200 || addAgentRole.statusCode > 299) {
          // bad status code - log and continue
          console.log('failed to add Supervisor role to agent in eGain')
        } else {
          // success
          console.log('successfully added Supervisor role to agent in eGain')
        }
      }


      return res.status(201).send()
    } catch (e) {
      console.error(e)
      if (e.response) {
        return res.status(e.response.status || 500).send(e.response.data || e.response)
      } else {
        return res.status(500).send(e || 'Unknown Server Error')
      }
    }
  }
})

module.exports = router
