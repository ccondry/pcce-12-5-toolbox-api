const cce = require('./cce')
const finesse = require('./finesse')

module.exports = {
  list: async function (query) {
    const response = await cce.list('agent', query)
    console.log(`got list of user's agents. response.length = ${response.length}`)
    // filter out agent IDs that are not 5 digits
    let results = response.filter(agent => {
      return agent.agentId.length === 5
    })
    try {
      for (let agent of results) {
        const finesseAgent = await finesse.getUser(agent.agentId)
        // copy state
        agent.state = finesseAgent.state
        // copy extension, if it is a string
        if (typeof finesseAgent.extension === 'string') {
          agent.extension = finesseAgent.extension
        }
      }
    } catch (e) {
      console.error(e.message)
      // just continue if we failed to add Finesse data to agent info
    }
    return results
  } catch (error) {
    // error during processing
    console.log('failed to list agents:', error.message)
    throw error
  }
}
