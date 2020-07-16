require('dotenv').config()

// our provision library
const provision = require('../src/models/provision')
// models and templates
const roleModel = require('../src/models/provision/demo-user/role')
// CCE client
const cce = provision.cce
// extra CA certificates for node.js to trust CCE server
NODE_EXTRA_CA_CERTS='extra-CAs.pem'

// go
main()
.catch(e => console.log(e.message))

// define current tests
async function main () {
  try {

    // // get user's department
    // const department = await provision.cceGet({
    //   type: 'department',
    //   query: userId,
    //   find (v) {
    //     return v.name === userId
    //   }
    // })

    // // extract department ID
    // const departmentId = provision.getId(department)
    // console.log('departmentId', departmentId)
    
    // await provision.createOrGetOutboundCampaigns({
    //   userId,
    //   type: 'Preview',
    //   model: previewCampaignModel,
    //   dn: '7996' + userId,
    //   departmentId
    // })
    
    // await provision.createOrGetOutboundCampaigns({
    //   userId,
    //   type: 'Agent',
    //   model: agentCampaignModel,
    //   dn: '7998' + userId,
    //   departmentId
    // })

    // await provision.createOrGetOutboundCampaigns({
    //   userId,
    //   type: 'IVR',
    //   model: ivrCampaignModel,
    //   dn: '7999' + userId,
    //   departmentId
    // })

    // const items = await cce.list('role', 'ToolboxUser')
    // console.log(JSON.stringify(items, null, 2))
    
    // get the preview outbound call type
    const role = await provision.cceCreateOrGetId({
      type: 'role',
      query: 'ToolboxUser',
      find (v) {
        return v.name === 'ToolboxUser'
      },
      data: roleModel()
    })
    console.log(JSON.stringify(role, null, 2))

    // const items = await cce.list('dialedNumber', '7997')
    // console.log(JSON.stringify(items, null, 2))

    // 7996 = Preview Agent
    // 7997 = Simulator
    // 7998 = Predictive Agent
    // 7999 = IVR
    // await cce.create('dialedNumber', dnModel({
    //   dialedNumberString: '7996' + '0325',
    //   description: 'Preview Agent ' + '0325',
    //   departmentId,
    //   callTypeId: getId(previewOutboundCallType),
    //   mrdId = 1,
    //   routingType = 3
    // }))
    // IVR dialed number 
    // {
    //   "callType": {
    //     "refURL": "/unifiedconfig/config/calltype/5022",
    //     "name": "CumulusOutboundIVR"
    //   },
    //   "description": "Cumulus Outbound IVR",
    //   "dialedNumberRecords": {
    //     "dialedNumberRecord": {
    //       "id": "5025",
    //       "name": "O5006.7999"
    //     }
    //   },
    //   "dialedNumberString": "7999",
    //   "mediaRoutingDomain": {
    //     "refURL": "/unifiedconfig/config/mediaroutingdomain/1",
    //     "name": "Cisco_Voice"
    //   },
    //   "routingType": "3"
    // }  

    // const skillGroup = await cceGet({
    //   type: 'skillGroup',
    //   query: 'CumulusOutboundAgent_' + '0325',
    //   find (v) {
    //     return v.name === 'CumulusOutboundAgent_' + '0325'
    //   }
    // })
    // console.log(JSON.stringify(skillGroup, null, 2))


    // // edit it
    // delete agentCampaign.agentCampaign
    // delete agentCampaign.changeStamp
    // agentCampaign.description = '0325'
    // agentCampaign.name = 'CumulusOutboundAgent_' + '0325'
    // agentCampaign.skillGroupInfos.skillGroupInfo.dialedNumber = '7998' + '0325'
    // // get skillgroup ref URL
    // agentCampaign.skillGroupInfos.skillGroupInfo.skillGroup.refURL = skillGroup.refURL
    // delete agentCampaign.skillGroupInfos.skillGroupInfo.skillGroup.name

    // // create campaign
    // const newCampaign = await cceCreate({
    //   type: 'campaign',
    //   data: agentCampaign
    // })
    
    // console.log('successfully created new agent outbound campaign:', newCampaign)
  } catch(e) {
    console.log(e.message)
  }
}
