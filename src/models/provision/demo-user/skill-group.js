module.exports = function ({name, description, mrdId, departmentId, agentIds}) {
  const data = {
    name,
    mediaRoutingDomain: {
      refURL: "/unifiedconfig/config/mediaroutingdomain/" + mrdId
    },
    department: {
      refURL: "/unifiedconfig/config/department/" + departmentId
    }
  }
  // add description
  if (description) data.description = description
  // add agents
  if (agentIds && agentIds.length) {
    const agents = []
    for (const id of agentIds) {
      agents.push({refURL: `/unifiedconfig/config/agent/${id}`})
    }
    data.agents = [{
      agent: agents
    }]
  }

  return data
}
