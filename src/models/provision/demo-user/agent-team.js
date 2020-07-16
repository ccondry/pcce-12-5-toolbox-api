module.exports = function ({name, description, departmentId, agentIds, supervisorIds}) {
  const data = {
    name,
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
  // add supervisors
  if (supervisorIds && supervisorIds.length) {
    const supervisors = []
    for (const id of supervisorIds) {
      supervisors.push({refURL: `/unifiedconfig/config/agent/${id}`})
    }
    data.supervisors = [{
      supervisor: supervisors
    }]
  }

  return data
}
