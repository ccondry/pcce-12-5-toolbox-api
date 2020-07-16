module.exports = function ({
  callTypeId,
  callTypeName,
  voicePqId,
  certificationPqId,
  chatPqId,
  emailPqId,
  taskPqId
}) {

  function certificationDemo (demo) {
    return {
      demo,
      params: {
        eccVar: [{
          name: 'user.CTID',
          value: callTypeId
        }, {
          name: 'user.PQID',
          value: certificationPqId
        }, {
          name: 'user.demo',
          value: demo
        }],
        // "pv1": "Michael Littlefoot",
        // "pv2": "Sales",
        // "pv3": "US",
        // "pv4": "No Queue Time",
        // "pv5": "Gold",
        // "pv6": callTypeName
        // "pv7": "Var7",
        // "pv9": "Var9",
        // "pv10": "Var10",
      }
    }
  }

  function voiceDemo (demo) {
    return {
      demo,
      params: {
        eccVar: [{
          name: 'user.CTID',
          value: callTypeId
        }, {
          name: 'user.PQID',
          value: voicePqId
        }, {
          name: 'user.demo',
          value: demo
        }],
        // "pv1": "Michael Littlefoot",
        // "pv2": "Sales",
        // "pv3": "US",
        // "pv4": "No Queue Time",
        // "pv5": "Gold",
        // "pv6": callTypeName
        // "pv7": "Var7",
        // "pv9": "Var9",
        // "pv10": "Var10",
      }
    }
  }

  function customIvrDemo (demo, application) {
    return {
      demo,
      params: {
        eccVar: [{
          name: 'user.CTID',
          value: callTypeId
        }, {
          name: 'user.PQID',
          value: voicePqId
        }, {
          name: 'user.demo',
          value: 'custom-ivr'
        }],
        eccArray: [
          {
            index: 0,
            name: 'user.microapp.ToExtVXML',
            value: 'application=' + application + ';'
          }
        ]
        // "pv1": "Michael Littlefoot",
        // "pv2": "Sales",
        // "pv3": "US",
        // "pv4": "No Queue Time",
        // "pv5": "Gold",
        // "pv6": callTypeName
        // "pv7": "Var7",
        // "pv9": "Var9",
        // "pv10": "Var10",
      }
    }
  }

  function ccbDemo (demo) {
    return {
      demo,
      params: {
        eccVar: [{
          name: 'user.CTID',
          value: callTypeId
        // }, {
        //   name: 'user.PQID',
        //   value: voicePqId
          }, {
            name: 'user.demo',
            value: demo
          }]
        // "pv1": "Michael Littlefoot",
        // "pv2": "Sales",
        // "pv3": "US",
        // "pv4": "No Queue Time",
        // "pv5": "Gold",
        // "pv6": callTypeName
        // "pv7": "Var7",
        // "pv9": "Var9",
        // "pv10": "Var10",
      }
    }
  }

  try {
    let inbound
    // let rem
    let pcs
    try {
      // add demo config to all 10 phone numbers
      // the others should be configured in the database db.defaults.inbound
      inbound = {
        '7800': voiceDemo('cumulus'),
        '6021': voiceDemo('cumulus'),
        // '6022': voiceDemo('cumulus-microapps'),
        '6022': voiceDemo('cumulus'),
        '6023': voiceDemo('cumulus'),
        '6020': certificationDemo('cumulus-certification'),
        '7019': customIvrDemo('conversational-ivr', 'ConversationalIVR'),
        '6016': voiceDemo('cumulus'),
        '6017': voiceDemo('cumulus-mobile'),
        '6018': voiceDemo('cumulus-vivr'),
        '6019': voiceDemo('cumulus-uwf')
      }

      // add demo config to REM DNs
      // rem = {
      //   '7704': voiceDemo,
      //   '7705': voiceDemo
      // }

      // build demo config for post-call survey
      const pcsDemo = {
        demo: 'default',
        params: {
          eccVar: [{
            name: 'user.CTID',
            value: callTypeId
          }]
        }
      }

      pcs = {
        '3330': pcsDemo
      }
    } catch (e) {
      console.error('failed to add voice demo configs to user', e)
    }

    let chat
    try {
      chat = {
        [process.env.default_chat_dn]: {
          demo: 'default',
          params: {
            eccVar: [{
              name: 'user.CTID',
              value: callTypeId
            }, {
              name: 'user.PQID',
              value: chatPqId
            }]
          }
        }
      }
    } catch (e) {
      console.error('failed to add chat demo config to user', e)
    }

    let email
    try {
      email = {
        [process.env.default_email_dn]: {
          demo: 'default',
          params: {
            eccVar: [{
              name: 'user.CTID',
              value: callTypeId
            }, {
              name: 'user.PQID',
              value: emailPqId
            }]
          }
        }
      }
    } catch (e) {
      console.error('failed to add email demo config to user', e)
    }

    let task
    try {
      task = {
        [process.env.default_task_dn]: {
          demo: 'default',
          params: {
            eccVar: [{
              name: 'user.CTID',
              value: callTypeId
            }, {
              name: 'user.PQID',
              value: taskPqId
            }]
          }
        }
      }
    } catch (e) {
      console.error('failed to add email demo config to user', e)
    }

    // build demo config for agent request API
    const ar = {
      'CumulusAgentRequest': {
        demo: 'default',
        params: {
          eccVar: [{
            name: 'user.CTID',
            value: callTypeId
          }, {
            name: 'user.PQID',
            value: voicePqId
          }]
        }
      }
    }

    // build demo config for ECE Callback
    const callback = {
      'ECE_CallBack': {
        demo: 'default',
        params: {
          eccVar: [{
            name: 'user.CTID',
            value: callTypeId
          }, {
            name: 'user.PQID',
            value: voicePqId
          }]
        }
      }
    }

    const ccb = {
      '7800': ccbDemo('default'),
      '6021': ccbDemo('default'),
      '6022': ccbDemo('default'),
      '6023': ccbDemo('default'),
      '6020': ccbDemo('default'),
      '7019': ccbDemo('default'),
      '6016': ccbDemo('default'),
      '6017': ccbDemo('default'),
      '6018': ccbDemo('default'),
      '6019': ccbDemo('default')
    }

    // return demos
    return {
      inbound,
      chat,
      email,
      pcs,
      task,
      ar,
      callback,
      ccb
    }
  } catch (e) {
    throw e
  }
}
