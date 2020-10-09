/*
this is the dcloud PCCE instant demo user provisioning script
*/

const provision = require('./index')
const teamsLogger = require('../teams-logger')
const fetch = require('../fetch')

// const user = require('./user.json')
const VPN_USER_GROUP = process.env.VPN_USER_GROUP || 'CN=Demo Admins,CN=Users,DC=dcloud,DC=cisco,DC=com'
const DEFAULT_AGENT_PASSWORD = process.env.DEFAULT_AGENT_PASSWORD || 'C1sco12345'
// const CCE_EGAIN_CHAT_SG = process.env.CCE_EGAIN_CHAT_SG
// const CCE_EGAIN_EMAIL_SG = process.env.CCE_EGAIN_EMAIL_SG
const previewCampaignModel = require('./demo-user/campaign-preview')
const ivrCampaignModel = require('./demo-user/campaign-ivr')
const agentCampaignModel = require('./demo-user/campaign-agent')

const cumulusMainTeamId = process.env.CUMULUS_MAIN_TEAM_ID
const cumulusCrmTeamId = process.env.CUMULUS_CRM_TEAM_ID
const cumulusUwfTeamId = process.env.CUMULUS_UWF_TEAM_ID
const cumulusOutboundTeamId = process.env.CUMULUS_OUTBOUND_TEAM_ID
      
function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = async function (user, password, agentPassword = DEFAULT_AGENT_PASSWORD) {
  let vpnUser
  // get demo base config
  let demoBaseConfig
  try {
    const url = 'https://mm.cxdemo.net/api/v1/demo'
    const qs = `?type=${session.type}&version=${session.version}&instant=true`
    const demos = await fetch(url + qs)
    demoBaseConfig = demos[0]
  } catch (e) {
    const message = `failed to get demo base config: ${e.message}`
    teamsLogger(message)
    throw Error(message)
  }

  try {
    // create ldap user for CCE department admin, if password supplied.
    // password should be null when admin user using switch-user to
    // reprovision a user
    if (password) {
      try {
        vpnUser = await provision.createLdapCceAdminUser(user, password)
      } catch (e) {
        throw e
      }
      // add ldap user to the vpn group
      try {
        await provision.addToGroup({
          userDn: vpnUser.distinguishedName,
          groupDn: VPN_USER_GROUP
        })
      } catch (e) {
        if (e.message.indexOf('problem 6005 (ENTRY_EXISTS)') >= 0) {
          // user already in group - just continue
        } else if (e.message.indexOf('problem 2001 (NO_OBJECT)') >= 0) {
          // VPN_USER_GROUP not exist
          // log to teams
          teamsLogger.log(`failed to add LDAP user ${user.username} (${user.id}) to LDAP group ${VPN_USER_GROUP}):`, e.message)
          teamsLogger.log(`<@all> Please create this LDAP user group in my datacenter: \`${VPN_USER_GROUP}\``)
        } else {
          // any other error - just log to teams
          teamsLogger.log(`failed to add LDAP user ${user.username} (${user.id}) to LDAP group ${VPN_USER_GROUP}):`, e.message)
        }
        // continue
      }
    }

    // create ldap user for non-SSO supervisor agent Rick Barrows
    await provision.createAgentLdapUser({
      firstName: 'Rick ' + user.id,
      lastName: 'Barrows',
      username: 'rbarrows' + user.id,
      userId: user.id,
      telephoneNumber: '1082' + user.id,
      password: agentPassword
    })

    // create ldap user for SSO agent Sandra Jefferson
    await provision.createAgentLdapUser({
      firstName: 'Sandra ' + user.id,
      lastName: 'Jefferson',
      username: 'sjeffers' + user.id,
      userId: user.id,
      telephoneNumber: '1080' + user.id,
      password: agentPassword
    })

    // create ldap user for non-SSO SFDC agent Josh Peterson
    await provision.createAgentLdapUser({
      firstName: 'Josh ' + user.id,
      lastName: 'Peterson',
      username: 'jopeters' + user.id,
      userId: user.id,
      telephoneNumber: '1081' + user.id,
      password: agentPassword
    })

    // create ldap user for non-SSO CRM agent Trudy Vere-Jones
    await provision.createAgentLdapUser({
      firstName: 'Trudy ' + user.id,
      lastName: 'Vere-Jones',
      username: 'trujones' + user.id,
      userId: user.id,
      telephoneNumber: '1087' + user.id,
      password: agentPassword
    })

    // create ldap user for non-SSO outbound agent Owen Harvey
    await provision.createAgentLdapUser({
      firstName: 'Owen ' + user.id,
      lastName: 'Harvey',
      username: 'oharvey' + user.id,
      userId: user.id,
      telephoneNumber: '1085' + user.id,
      password: agentPassword
    })
    
    // create ldap user for non-SSO UWF supervisor James Bracksted
    await provision.createAgentLdapUser({
      firstName: 'James ' + user.id,
      lastName: 'Bracksted',
      username: 'jabracks' + user.id,
      userId: user.id,
      telephoneNumber: '1084' + user.id,
      password: agentPassword
    })

    // create ldap user for non-SSO UWF agent Helen Liang
    await provision.createAgentLdapUser({
      firstName: 'Helen ' + user.id,
      lastName: 'Liang',
      username: 'hliang' + user.id,
      userId: user.id,
      telephoneNumber: '1083' + user.id,
      password: agentPassword
    })

    // create ldap user for non-SSO Outbound agent Annika Hamilton
    await provision.createAgentLdapUser({
      firstName: 'Annika ' + user.id,
      lastName: 'Hamilton',
      username: 'annika' + user.id,
      userId: user.id,
      telephoneNumber: '1086' + user.id,
      password: agentPassword
    })
    
    // start LDAP user sync on CUCM
    provision.doCucmLdapSync()
    .then(r => console.log('CUCM LDAP user sync successfully started'))
    .catch(e => console.log('CUCM LDAP user sync failed:', e.message))
    
    // get global role ID for department admin
    const roleId = await provision.createOrGetAdminRole()

    // Department
    const departmentId = await provision.createOrGetDepartment(user.id)
    
    // Department Admin
    await provision.createOrGetDepartmentAdmin({
      departmentId,
      username: user.username,
      roleId
    })

    // if wxm config does not exist, provide empty object for call type
    // surveys instead of throwing error
    demoBaseConfig.wxm = demoBaseConfig.wxm || {}

    // Inbound Voice Call Type
    const voiceCtId = await provision.createOrGetCallType({
      departmentId,
      userId: user.id,
      update: true,
      survey: demoBaseConfig.wxm.voice
    })
    // Mobile Voice Call Type
    const mobileCtId = await provision.createOrGetCallType({
      departmentId,
      userId: user.id,
      update: true,
      survey: demoBaseConfig.wxm.sms
    })
    // Gold Voice Call Type
    const goldCtId = await provision.createOrGetCallType({
      departmentId,
      userId: user.id,
      update: true,
      survey: demoBaseConfig.wxm.email
    })
    // VisualIVR Voice Call Type
    const visualIvrCtId = await provision.createOrGetCallType({
      departmentId,
      userId: user.id,
      update: true,
      survey: demoBaseConfig.wxm.sms
    })
    // CVA Voice Call Type
    const cvaCtId = await provision.createOrGetCallType({
      departmentId,
      userId: user.id,
      update: true,
      survey: demoBaseConfig.wxm.email
    })
    // AI Voice Call Type
    const aiCtId = await provision.createOrGetCallType({
      departmentId,
      userId: user.id,
      update: true,
      survey: demoBaseConfig.wxm.email
    })

    // Teams
    const mainTeamId = await provision.createOrGetTeam({
      departmentId,
      name: 'CumulusMain_' + user.id,
      userId: user.id
    })
    // outbound agents team
    const outboundTeamId = await provision.createOrGetTeam({
      departmentId,
      name: 'CumulusOutbound_' + user.id,
      userId: user.id
    })
    // CRM agents team
    const crmTeamId = await provision.createOrGetTeam({
      departmentId,
      name: 'CumulusCRM_' + user.id,
      userId: user.id
    })
    // UWF agent/supervisor team
    const uwfTeamId = await provision.createOrGetTeam({
      departmentId,
      name: 'CumulusUWF_' + user.id,
      userId: user.id
    })

    // PQ Attributes
    const ba = await provision.createOrGetBooleanAttribute(departmentId, user.id)
    const pa = await provision.createOrGetProficiencyAttribute()
    const certPa = await provision.createOrGetCertificationProficiencyAttribute()
    const uwfPa = await provision.createOrGetUwfProficiencyAttribute()

    // Voice PQ
    const voicePqId = await provision.createOrGetVoicePq({
      departmentId,
      userId: user.id,
      booleanAttributeId: ba,
      proficiencyAttributeId: pa,
      update: true
    })

    // Voice Certification PQ
    const certificationPqId = await provision.createOrGetCertificationPq({
      departmentId,
      userId: user.id,
      booleanAttributeId: ba,
      proficiencyAttributeId: certPa,
      update: true
    })

    // UWF PQ
    const uwfPqId = await provision.createOrGetUwfPq({
      departmentId,
      userId: user.id,
      booleanAttributeId: ba,
      proficiencyAttributeId: uwfPa,
      update: true
    })

    // Chat PQ
    const chatPqId = await provision.createOrGetChatPq({
      departmentId,
      userId: user.id,
      booleanAttributeId: ba,
      proficiencyAttributeId: pa,
      update: true
    })

    // Email PQ
    const emailPqId = await provision.createOrGetEmailPq({
      departmentId,
      userId: user.id,
      booleanAttributeId: ba,
      proficiencyAttributeId: pa,
      update: true
    })

    // Task PQ
    const taskPqId = await provision.createOrGetTaskPq({
      departmentId,
      userId: user.id,
      booleanAttributeId: ba,
      proficiencyAttributeId: pa,
      update: true
    })

    // // create outbound Agent skillgroup in the Cisco_Voice MRD
    // const obAgentSgId = await provision.createOrGetSkillGroup({
    //   userId: user.id,
    //   name: `CumulusOutboundAgent_${user.id}`,
    //   departmentId
    // })

    // // create outbound Agent Preview skillgroup in the Cisco_Voice MRD
    // const obPreviewAgentSgId = await provision.createOrGetSkillGroup({
    //   userId: user.id,
    //   name: `CumulusOutboundPreview_${user.id}`,
    //   departmentId
    // })

    // // create outbound IVR skillgroup in the Cisco_Voice MRD
    // const obIvrSgId = await provision.createOrGetSkillGroup({
    //   userId: user.id,
    //   name: `CumulusOutboundIVR_${user.id}`,
    //   departmentId
    // })

    let obPreviewAgentSgId
    let obAgentSgId
    let obIvrSgId

    // provision outbound campaigns
    try {

      try {
        const previewCampaign = await provision.createOrGetOutboundCampaigns({
          userId: user.id,
          type: 'Preview',
          model: previewCampaignModel,
          dn: '7996' + user.id,
          departmentId,
          update: true
        })
        obPreviewAgentSgId = previewCampaign.skillGroupId
      } catch (e) {
        console.log('failed to provision outbound agent preview campaign for', user.id, ':', e.message)
        throw e
      }
      
      try {
        const agentCampaign = await provision.createOrGetOutboundCampaigns({
          userId: user.id,
          type: 'Agent',
          model: agentCampaignModel,
          dn: '7998' + user.id,
          departmentId,
          update: true
        })
        obAgentSgId = agentCampaign.skillGroupId
      } catch (e) {
        console.log('failed to provision outbound agent predictive campaign for', user.id, ':', e.message)
        throw e
      }

      try {
        const ivrCampaign = await provision.createOrGetOutboundCampaigns({
          userId: user.id,
          type: 'IVR',
          model: ivrCampaignModel,
          dn: '7999' + user.id,
          departmentId,
          update: true
        })
        obIvrSgId = ivrCampaign.skillGroupId
      } catch (e) {
        console.log('failed to provision outbound IVR campaign for', user.id, ':', e.message)
        throw e
      }

      // now provision outbound agents since prerequisites are complete
      // create/get outbound agent Owen Harvey
      const outboundAgent1Id = await provision.createOrGetAgent({
        departmentId,
        username: user.username,
        userId: user.id,
        booleanAttributeId: ba,
        proficiencyAttributeId: pa,
        teamId: outboundTeamId,
        firstName: 'Owen',
        lastName: 'Harvey',
        userName: 'oharvey' + user.id,
        agentId: '1085' + user.id,
        supervisor: false,
        skillGroupIds: [
          obIvrSgId,
          obAgentSgId,
          obPreviewAgentSgId
        ],
        password: agentPassword,
        ssoEnabled: false,
        ecePerson: false,
        loginEnabled: true,
        description: 'Cumulus - Outbound Agent - ' + user.id,
        update: true
      })

      // create/get outbound agent Annika Hamilton
      const outboundAgent2Id = await provision.createOrGetAgent({
        departmentId,
        username: user.username,
        userId: user.id,
        booleanAttributeId: ba,
        proficiencyAttributeId: pa,
        teamId: outboundTeamId,
        firstName: 'Annika',
        lastName: 'Hamilton',
        userName: 'annika' + user.id,
        agentId: '1086' + user.id,
        supervisor: false,
        skillGroupIds: [
          obIvrSgId,
          obAgentSgId,
          obPreviewAgentSgId
        ],
        password: agentPassword,
        ssoEnabled: false,
        ecePerson: false,
        loginEnabled: true,
        description: 'Cumulus - Outbound Agent - ' + user.id,
        update: true
      })

    } catch (e) {
      console.log('outbound provisioning failed:', e.message)
    }

    // get CRM skill group IDs
    let mcalChatSkillGroupId
    let mcalEmailSkillGroupId
    // get skill group IDs for B+S MCAL CRM connector
    try {
      // MCAL chat
      mcalChatSkillGroupId = await provision.cceGetId({
        type: 'skillGroup',
        query: 'globaldepartment:only',
        find (v) {
          return v.name === 'CumulusMCALChat'
        }
      })
      // MCAL email
      mcalEmailSkillGroupId = await provision.cceGetId({
        type: 'skillGroup',
        query: 'globaldepartment:only',
        find (v) {
          return v.name === 'CumulusMCALEmail'
        }
      })
    } catch (e) {
      console.log('failed to find MCAL skill group IDs:', e.message)
    }
    
    // create/get CCE agent Sandra Jefferson with SSO
    const agent1Id = await provision.createOrGetAgent({
      departmentId,
      username: user.username,
      userId: user.id,
      booleanAttributeId: ba,
      proficiencyAttributeId: pa,
      teamId: mainTeamId,
      firstName: 'Sandra',
      lastName: 'Jefferson',
      userName: 'sjeffers' + user.id,
      agentId: '1080' + user.id,
      supervisor: false,
      ssoEnabled: true,
      ecePerson: true,
      loginEnabled: true,
      screenName: 'sjeffers' + user.id,
      description: 'Cumulus - Main Agent - ' + user.id,
      update: true
    })

    const crmSkillGroupIds = []
    if (mcalChatSkillGroupId) {
      crmSkillGroupIds.push(mcalChatSkillGroupId)
    }
    if (mcalEmailSkillGroupId) {
      crmSkillGroupIds.push(mcalEmailSkillGroupId)
    }

    // create/get CRM agent Josh Peterson
    const crmAgent1Id = await provision.createOrGetAgent({
      departmentId,
      username: user.username,
      userId: user.id,
      booleanAttributeId: ba,
      proficiencyAttributeId: pa,
      teamId: crmTeamId,
      firstName: 'Josh',
      lastName: 'Peterson',
      userName: 'jopeters' + user.id,
      agentId: '1081' + user.id,
      supervisor: false,
      skillGroupIds: crmSkillGroupIds,
      password: agentPassword,
      ssoEnabled: false,
      ecePerson: false,
      loginEnabled: true,
      screenName: 'jopeters' + user.id,
      description: 'Cumulus - CRM Agent - ' + user.id,
      update: true
    })

    // create/get CRM agent Trudy Vere-Jones
    const crmAgent2Id = await provision.createOrGetAgent({
      departmentId,
      username: user.username,
      userId: user.id,
      booleanAttributeId: ba,
      proficiencyAttributeId: pa,
      teamId: crmTeamId,
      firstName: 'Trudy',
      lastName: 'Vere-Jones',
      userName: 'trujones' + user.id,
      agentId: '1087' + user.id,
      supervisor: false,
      skillGroupIds: crmSkillGroupIds,
      password: agentPassword,
      ssoEnabled: false,
      ecePerson: false,
      loginEnabled: true,
      screenName: 'trujones' + user.id,
      description: 'Cumulus - CRM Agent - ' + user.id,
      update: true
    })

    // create/get CCE main supervisor Rick Barrows
    const mainSupervisorId = await provision.createOrGetAgent({
      departmentId,
      username: user.username,
      userId: user.id,
      booleanAttributeId: ba,
      proficiencyAttributeId: pa,
      teamId: mainTeamId,
      firstName: 'Rick',
      lastName: 'Barrows',
      userName: 'rbarrows' + user.id + '@' + process.env.LDAP_DOMAIN,
      agentId: '1082' + user.id,
      supervisor: true,
      password: agentPassword,
      ssoEnabled: false,
      ecePerson: true,
      loginEnabled: true,
      screenName: 'rbarrows' + user.id,
      supervisorTeamIds: [
        mainTeamId,
        outboundTeamId,
        crmTeamId
      ],
      update: true,
      description: 'Cumulus - Main Supervisor - ' + user.id
    })

    // create/get CCE UWF supervisor James Bracksted
    const uwfSupervisorId = await provision.createOrGetAgent({
      departmentId,
      username: user.username,
      userId: user.id,
      booleanAttributeId: ba,
      proficiencyAttributeId: uwfPa,
      teamId: uwfTeamId,
      firstName: 'James',
      lastName: 'Bracksted',
      userName: 'jabracks' + user.id + '@' + process.env.LDAP_DOMAIN,
      agentId: '1084' + user.id,
      supervisor: true,
      password: agentPassword,
      ssoEnabled: false,
      deskSettingsId: process.env.UWF_DESK_SETTINGS_ID,
      ecePerson: false,
      loginEnabled: true,
      supervisorTeamIds: [
        uwfTeamId
      ],
      update: true,
      description: 'Cumulus - UWF Supervisor - ' + user.id
    })
    
    // create/get CCE UWF agent Helen Liang
    const uwfAgentId = await provision.createOrGetAgent({
      departmentId,
      username: user.username,
      userId: user.id,
      booleanAttributeId: ba,
      proficiencyAttributeId: uwfPa,
      teamId: uwfTeamId,
      firstName: 'Helen',
      lastName: 'Liang',
      userName: 'hliang' + user.id,
      agentId: '1083' + user.id,
      supervisor: false,
      password: agentPassword,
      ssoEnabled: false,
      ecePerson: false,
      loginEnabled: true,
      description: 'Cumulus - UWF Agent - ' + user.id,
      update: true
    })

    // create CCE agents complete

    // wait for CUCM LDAP sync to complete, and then provision jabbers
    try {
      console.log('getting CUCM LDAP sync status...')
      let ldapSyncStatus = await provision.getCucmLdapSync()
      // retry up to 10 times
      const maxRetries = 10
      let retries = 0
      while (ldapSyncStatus === 'Sync is currently under process' && retries <= maxRetries) {
        console.log('CUCM LDAP sync is in progress. Retry number', retries, '. Retrying in 1500ms...')
        // wait a moment and try again
        await sleep(1500)
        ldapSyncStatus = await provision.getCucmLdapSync()
        // increment retry counter
        retries++
      }
      // no longer 'under process' - check for doneness
      if (ldapSyncStatus !== 'Sync is performed successfully') {
        // undefined or unknown state - throw the status as an error
        // throw Error(ldapSyncStatus)
        console.warn('ldap sync status not good:', ldapSyncStatus)
        console.log('continuing with phone provision anyway')
      }
      // done - provision phones now
      console.log('CUCM LDAP sync is complete. Provisioning agent phones...')
    } catch (e) {
      console.log('failed CUCM LDAP sync. attempting to continue anyway...')
    }

    // create CUCM phones
    try {
      // Sandra Jefferson's phones
      await provision.phones({
        counter: '0',
        alertingName: 'Sandra Jefferson',
        username: 'sjeffers' + user.id,
        userid: user.id,
        mobileAgent: true,
        audioUrl: 'file:///root/agent_audio_sandra.wav'
      })

      // Josh Peterson's phones
      await provision.phones({
        counter: '1',
        alertingName: 'Josh Peterson',
        username: 'jopeters' + user.id,
        userid: user.id,
        mobileAgent: true,
        audioUrl: 'file:///root/agent_audio_josh.wav'
      })

      // Rick Barrows's phones
      // TODO get rick his own audio file!
      await provision.phones({
        counter: '2',
        alertingName: 'Rick Barrows',
        username: 'rbarrows' + user.id,
        userid: user.id,
        mobileAgent: true,
        audioUrl: 'file:///root/agent_audio_josh.wav'
      })

      // Helen Liang's phones
      await provision.phones({
        counter: '3',
        alertingName: 'Helen Liang',
        username: 'hliang' + user.id,
        userid: user.id
      })

      // James Bracksted's phones
      await provision.phones({
        counter: '4',
        alertingName: 'James Bracksted',
        username: 'jabracks' + user.id,
        userid: user.id
      })

      // Owen Harvey's phones
      await provision.phones({
        counter: '5',
        alertingName: 'Owen Harvey',
        username: 'oharvey' + user.id,
        userid: user.id
      })

      // Annika Hamilton's phones
      await provision.phones({
        counter: '6',
        alertingName: 'Annika Hamilton',
        username: 'annika' + user.id,
        userid: user.id
      })

      // Trudy Vere-Jones's phones
      await provision.phones({
        counter: '7',
        alertingName: 'Trudy Vere-Jones',
        username: 'trujones' + user.id,
        userid: user.id
      })

      console.log('Agent phone provisioning complete.')
    } catch (e) {
      console.log('failed to complete the CUCM phone provisioning:', e.message)
      // fail
      throw e
    }

    // copy Finesse Team layout XML from template teams to our new teams
    // copy main layout config
    try {
      await provision.copyLayoutConfig(cumulusMainTeamId, mainTeamId)
      console.log('successfully copied Finesse Team Layout XML from team', cumulusMainTeamId, 'to', mainTeamId, 'for', user.username, user.id)
    } catch (e) {
      console.warn('failed to copy Finesse Team Layout XML from team', cumulusMainTeamId, 'to', mainTeamId, 'for', user.username, user.id, e.message)
    }
    // copy CRM layout config
    try {
      await provision.copyLayoutConfig(cumulusCrmTeamId, crmTeamId)
      console.log('successfully copied Finesse Team Layout XML from team', cumulusCrmTeamId, 'to', crmTeamId, 'for', user.username, user.id)
    } catch (e) {
      console.warn('failed to copy Finesse Team Layout XML from team', cumulusCrmTeamId, 'to', crmTeamId, 'for', user.username, user.id, e.message)
   CumulusUWF }
    // copy UWF layout config
    try {
      await provision.copyLayoutConfig(cumulusUwfTeamId, uwfTeamId)
      console.log('successfully copied Finesse Team Layout XML from team', cumulusUwfTeamId, 'to', uwfTeamId, 'for', user.username, user.id)
    } catch (e) {
      console.warn('failed to copy Finesse Team Layout XML from team', cumulusUwfTeamId, 'to', uwfTeamId, 'for', user.username, user.id, e.message)
    }
    // copy Outbound layout config
    try {
      await provision.copyLayoutConfig(cumulusOutboundTeamId, outboundTeamId)
      console.log('successfully copied Finesse Team Layout XML from team', cumulusOutboundTeamId, 'to', outboundTeamId, 'for', user.username, user.id)
    } catch (e) {
      console.warn('failed to copy Finesse Team Layout XML from team', cumulusOutboundTeamId, 'to', outboundTeamId, 'for', user.username, user.id, e.message)
    }

    // create email account on branding in linux
    try {
      console.log('creating email account on linux...')
      await provision.createEmail('support_' + user.id)
      console.log('successfully created email account on linux.')
    } catch (e) {
      console.log('failed to create email account on linux:', e.message)
    }

    // wait for user's ECE department to exist before creating objects there
    try {
      console.log('checking if ECE department', user.id, 'exists yet...')
      // retry up to 10 times
      const maxRetries = 10
      // retry every 3000ms
      const throttle = 3000
      let retries = 0
      let department
      try {
        // find department with name = this user's ID
        department = await provision.ece.client.department.find({
          name: user.id
        })
      } catch (e) {
        // not found. try again next time
      }
      // while department not found and max retries not reached
      while (!department && retries < maxRetries) {
        console.log('ECE department sync is hopefully in progress. Retry number', retries, '. Retrying in', throttle, 'ms...')
        // wait a moment and try again
        await sleep(throttle)
        // retry
        try {
          // find department with name = this user's ID
          department = await provision.ece.client.department.find({
            name: user.id
          })
          // if found, we will exit the loop at the next loop test
        } catch (e) {
          // not found. try again next time
        }
        // increment retry counter
        retries++
      }
      // loop done. did we find the department?
      if (department) {
        // department exists in ECE
        console.log('ECE department sync is complete. continuing to provision ECE objects...')
      } else {
        // department still does not exist in ECE
        throw Error('failed to find ECE department. ECE objects can not be provisioned.')
      }
    } catch (e) {
      throw Error('failed to check ECE department. ECE objects will not be provisioned. Error:', e.message)
    }

    // create/get ECE supervisor Rick Barrows
    try {
      await provision.createOrGetEceSupervisor({
        skillTargetId: mainSupervisorId,
        firstName: 'Rick',
        lastName: 'Barrows',
        username: 'rbarrows' + user.id,
        departmentName: user.id
      })
    } catch (e) {
      console.log('failed to create ECE supervisor rbarrows' + user.id)
    }

    // create/get eGain Solve supervisor Rick Barrows
    const egainSupervisor = await provision.createOrGetEgainSupervisor({
      skillTargetId: mainSupervisorId,
      firstName: 'Rick',
      lastName: 'Barrows',
      username: 'rbarrows' + user.id,
      departmentName: 'Service'
    })

    // create/get ECE agent Sandra Jefferson
    try {
      await provision.createOrGetEceAgent({
        skillTargetId: agent1Id,
        firstName: 'Sandra',
        lastName: 'Jefferson',
        username: 'sjeffers' + user.id,
        departmentName: user.id
      })
    } catch (e) {
      console.log('failed to create ECE agent sjeffers' + user.id, e.message)
    }

    // create/get eGain Solve agent Sandra Jefferson
    try {
      // TODO change this to eGain agent?
      await provision.createOrGetEgainAgent({
        skillTargetId: agent1Id,
        firstName: 'Sandra',
        lastName: 'Jefferson',
        username: 'sjeffers' + user.id,
        departmentName: 'Service'
      })
    } catch (e) {
      console.log('failed to create eGain Solve agent sjeffers' + user.id, e.message)
    }

    // constants for email and chat queue provisioning
    const departmentName = user.id
    const chatMrdId = 5004
    const emailMrdId = 5005
    const chatScriptSelectorId = 5065
    const emailScriptSelectorId = 5066
    const emailRetrieverInstanceId = 999 // rx-instance ID from eGMasterDB.dbo.EGPL_DSM_INSTANCE
    const emailAddress = 'support_' + user.id + '@dcloud.cisco.com'
    const pop3Server = 'branding.dcloud.cisco.com'
    const pop3Port = 110
    // this is C1sco12345
    const pop3Password = '3736363436353338363435353638343135343636363136363434373734333634333037413442353934443444343136363642373235303435353037373531353137353732364134333242363236383441373332463439334432333532343537363433333134353438333536353641354137343531353133443344'
    const pop3LoginId = 'support_' + user.id
    const smtpPort = 25
    const smtpServer = 'branding.dcloud.cisco.com'

    let chatQueue
    try {
      chatQueue = await provision.ece.client.queue.find({
        queueName: 'chat',
        departmentName
      })
      // TODO make sure this search is working
      // 
    } catch (e) {
      console.log(`error while searching for chat routing queue for department ${departmentName}:`, e.message)
      throw e
    }

    if (chatQueue) {
      // chat queue already exists
      console.log(`Found eGain chat routing queue in department ${departmentName}. Queue ID = ${chatQueue.queue_id}`)
    } else {
      // chat queue does not exist yet
      // provision chat queue now
      try {
        console.log(`creating chat routing queue for department ${departmentName}...`)
        const results = await provision.ece.client.queue.create({
          departmentName,
          callIdentifier: departmentName,
          queueName: 'chat',
          scriptSelectorId: chatScriptSelectorId,
          mrdId: chatMrdId,
          maxTaskLimit: 5000
        })
        console.log(`successfully created chat routing queue for department ${departmentName}. Results:`, results)
        // find new chat queue
        try {
          chatQueue = await provision.ece.client.queue.find({
            queueName: 'chat',
            departmentName
          })
        } catch (e) {
          console.log(`error while searching for newly created chat routing queue for department ${departmentName}:`, e.message)
          throw e
        }
      } catch (e) {
        console.log(`failed to create chat routing queue for department ${departmentName}:`, e.message)
        throw e
      }
    }

    // associate precision queue to chat queue
    try {
      // delete current pq associations
      const results0 = await provision.ece.client.icmQueue.unmapPq({
        queueId: chatQueue.queue_id
      })
      // call variable 1 = contact point data
      const results = await provision.ece.client.icmQueue.mapPq({
        queueId: chatQueue.queue_id,
        pqId: chatPqId
      })
    } catch (e) {
      console.log(`error associating precision queue to chat queue for department ${departmentName}:`, e.message)
      throw e
    }

    // associate eGain data to CCE call variables
    try {
      // delete current call var associations for call vars 1 - 10
      const results0 = await provision.ece.client.icmQueue.removeCtiVariables({
        queueId: chatQueue.queue_id
      })
      // call variable 1 = contact point data
      const results1 = await provision.ece.client.icmQueue.associateCtiVariable({
        queueId: chatQueue.queue_id,
        callVariableName: 'contact_point_data',
        callVariableTag: 13
      })
      // call variable 2 = customer phone number
      const results2 = await provision.ece.client.icmQueue.associateCtiVariable({
        queueId: chatQueue.queue_id,
        callVariableName: 'customer_phone_no',
        callVariableTag: 14
      })
      // call variable 3 = queue ID
      const results3 = await provision.ece.client.icmQueue.associateCtiVariable({
        queueId: chatQueue.queue_id,
        callVariableName: 'queue_id',
        callVariableTag: 15
      })
      // call variable 4 = subject
      const results4 = await provision.ece.client.icmQueue.associateCtiVariable({
        queueId: chatQueue.queue_id,
        callVariableName: 'subject',
        callVariableTag: 16
      })
    } catch (e) {
      console.log(`error associating ECC variables to chat queue for department ${departmentName}:`, e.message)
      throw e
    }

    // search for existing chat entry point
    let entryPoint
    try {
      entryPoint = await provision.ece.client.entryPoint.find({
        queueId: chatQueue.queue_id
      })
    } catch (e) {
      console.log(`error while searching for chat entry point for department ${departmentName}:`, e.message)
      throw e
    }

    if (entryPoint) {
      // entry point already exists
      console.log(`Found eGain chat entry point in department ${departmentName}. Entry point ID = ${entryPoint.entry_point_id}`)
    } else {
      // entry point does not exist yet
      // provision entry point now
      try {
        // create chat entry point associated with the chat queue
        console.log(`creating chat entry point for department ${departmentName}...`)
        const results = await provision.ece.client.entryPoint.create({
          departmentName,
          entryPointName: 'chat',
          queueName: 'chat'
        })
        console.log(`successfully created chat entry point for department ${departmentName}. Results:`, results)
        // find newly created entry point
        try {
          entryPoint = await provision.ece.client.entryPoint.find({
            queueId: chatQueue.queue_id
          })
        } catch (e) {
          console.log(`error while searching for chat entry point for department ${departmentName}:`, e.message)
          throw e
        }
      } catch (e) {
        console.log(`failed to create chat entry point for department ${departmentName}:`, e.message)
        throw e
      }
    }

    // search for existing email queue
    let emailQueue
    try {
      emailQueue = await provision.ece.client.queue.find({
        queueName: 'email',
        departmentName
      })
    } catch (e) {
      console.log(`error while searching for email routing queue for department ${departmentName}:`, e.message)
      throw e
    }

    if (emailQueue) {
      // email queue already exists
      console.log(`Found eGain email queue in department ${departmentName}. Routing queue ID = ${emailQueue.queue_id}`)
    } else {
      // email queue does not exist yet
      // provision email queue now
      try {
        console.log(`creating email routing queue for department ${departmentName}...`)
        const results = await provision.ece.client.queue.create({
          departmentName,
          callIdentifier: departmentName,
          queueName: 'email',
          scriptSelectorId: emailScriptSelectorId,
          mrdId: emailMrdId,
          maxTaskLimit: 15000
        })
        console.log(`successfully created email routing queue for department ${departmentName}. Results:`, results)
        // find newly created email queue
        try {
          emailQueue = await provision.ece.client.queue.find({
            queueName: 'email',
            departmentName
          })
        } catch (e) {
          console.log(`error while searching for email routing queue for department ${departmentName}:`, e.message)
          throw e
        }
      } catch (e) {
        console.log(`failed to create email routing queue for department ${departmentName}:`, e.message)
        // stop provision
        throw e
      }
    }

    // associate precision queue to email queue
    try {
      // delete current pq associations
      const results0 = await provision.ece.client.icmQueue.unmapPq({
        queueId: emailQueue.queue_id
      })
      // call variable 1 = contact point data
      const results = await provision.ece.client.icmQueue.mapPq({
        queueId: emailQueue.queue_id,
        pqId: emailPqId
      })
    } catch (e) {
      console.log(`error associating precision queue to email queue for department ${departmentName}:`, e.message)
      throw e
    }

    // associate eGain data to CCE call variables
    try {
      // delete current call var associations for call vars 1 - 10
      const results0 = await provision.ece.client.icmQueue.removeCtiVariables({
        queueId: emailQueue.queue_id
      })
      // call variable 1 = contact point data
      const results1 = await provision.ece.client.icmQueue.associateCtiVariable({
        queueId: emailQueue.queue_id,
        callVariableName: 'contact_point_data',
        callVariableTag: 13
      })
      // call variable 2 = customer phone number
      const results2 = await provision.ece.client.icmQueue.associateCtiVariable({
        queueId: emailQueue.queue_id,
        callVariableName: 'customer_phone_no',
        callVariableTag: 14
      })
      // call variable 3 = queue ID
      const results3 = await provision.ece.client.icmQueue.associateCtiVariable({
        queueId: emailQueue.queue_id,
        callVariableName: 'queue_id',
        callVariableTag: 15
      })
      // call variable 4 = subject
      const results4 = await provision.ece.client.icmQueue.associateCtiVariable({
        queueId: emailQueue.queue_id,
        callVariableName: 'subject',
        callVariableTag: 16
      })
    } catch (e) {
      console.log(`error associating ECC variables to chat queue for department ${departmentName}:`, e.message)
      throw e
    }

    let alias
    try {
      alias = await provision.ece.client.alias.find({
        emailAddress
      })
    } catch (e) {
      console.log(`error while searching for email alias for department ${departmentName}:`, e.message)
      throw e
    }

    if (alias) {
      // email alias already exists
      console.log(`Found eGain email alias in department ${departmentName}.`)
    } else {
      // email alias does not exist yet
      // provision email alias now
      try {
        console.log(`creating email alias for department ${departmentName}...`)
        const results = await provision.ece.client.alias.create({
          departmentName,
          pop3Password,
          emailAddress,
          aliasName: 'email',
          instanceId: emailRetrieverInstanceId, // rx-instance ID from eGMasterDB.dbo.EGPL_DSM_INSTANCE
          pop3Server,
          pop3Port,
          pop3LoginId,
          smtpPort,
          smtpServer
        })
        console.log(`successfully created email alias for department ${departmentName}. Results:`, results)
      } catch (e) {
        console.log(`failed to create email alias for department ${departmentName}:`, e.message)
        // stop provision
        throw e
      }
    }

    let workflow
    // try to find existing email workflow
    try {
      workflow = await provision.ece.client.workflow.find({
        workflowName: 'email',
        departmentName
      })
    } catch (e) {
      console.log(`error while searching for email workflow for department ${departmentName}:`, e.message)
      throw e
    }

    if (workflow) {
      // email workflow already exists
      console.log(`Found eGain email workflow in department ${departmentName}.`)
    } else {
      // email workflow does not exist yet
      // provision email workflow now
      try {
        console.log(`creating email workflow for department ${departmentName}...`)
        const results = await provision.ece.client.workflow.create({
          departmentName,
          workflowName: 'email',
          description: 'email workflow',
          queueName: 'email',
          aliasName: 'email'
        })
        console.log(`successfully created email workflow for department ${departmentName}. Results:`, results)
        try {
          workflow = await provision.ece.client.workflow.find({
            workflowName: 'email',
            departmentName
          })
        } catch (e) {
          console.log(`error while searching for email workflow for department ${departmentName}:`, e.message)
          throw e
        }
      } catch (e) {
        console.log(`failed to create email workflow for department ${departmentName}:`, e.message)
        // stop provision
        throw e
      }
    }

    // return
    return {
      // vpnUser,
      // set ECE chat queue ID
      chatQueueId: chatQueue.queue_id,
      // set ECE entry point ID
      entryPointId: entryPoint.entry_point_id,
      // set ECE email queue ID
      emailQueueId: emailQueue.queue_id,
      // chat PQ ID
      chatPqId,
      // email PQ ID
      emailPqId,
      // voice PQ ID
      voicePqId,
      // task routing PQ ID
      taskPqId,
      // upstream works voice PQ ID
      uwfPqId,
      // cumulus gold certification PQ ID
      certificationPqId,
      // alias cumulus gold certification PQ ID
      goldPqId: certificationPqId,
      // outbound agent skill group ID
      obAgentSgId,
      // outbound preview agent skill group ID
      obPreviewAgentSgId,
      // outbound IVR skill group ID
      obIvrSgId,
      // voice call type ID
      voiceCtId,
      // mobile call type ID
      mobileCtId,
      // gold call type ID
      goldCtId,
      // visual IVR call type ID
      visualIvrCtId,
      // CVA call type ID
      cvaCtId,
      // AI call type ID
      aiCtId
    }
  } catch (e) {
    if (e.request && e.response.data) {
      console.log('dCloud user provisioning failed:', e.message, JSON.stringify(e.response.data, null, 2))
    } else {
      console.log('dCloud user provisioning failed:', e)
    }
    throw e
  }
}
