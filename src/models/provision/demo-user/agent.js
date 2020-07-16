module.exports = function ({
  agentId, description, departmentId, firstName, lastName, userName,
  password, teamId, supervisor, skillGroupIds, attributes,
  ssoEnabled, deskSettingsId, ecePerson, loginEnabled, screenName,
  supervisorTeamIds
}) {
  const data = {
    person: {
      firstName,
      lastName,
      userName,
      password,
      ssoEnabled,
      ecePerson,
      loginEnabled,
      screenName
    },
    department: {refURL: `/unifiedconfig/config/department/${departmentId}`},
    supervisor,
    ssoEnabled
  }
  // add password
  if (password) data.password = password
  // add agent ID
  if (agentId) data.agentId = agentId
  // add team
  if (teamId) data.agentTeam = {refURL: `/unifiedconfig/config/agentteam/${teamId}`}
  // add description
  if (description) data.description = description

  // add skillGroups
  if (skillGroupIds && skillGroupIds.length) {
    const skillGroup = []
    for (const id of skillGroupIds) {
      skillGroup.push({refURL: `/unifiedconfig/config/skillgroup/${id}`})
    }
    data.skillGroups = [{skillGroup}]
  }
  // add PQ attributes
  if (attributes && attributes.length) {
    const agentAttribute = []
    for (const attribute of attributes) {
      agentAttribute.push({
        attributeValue: String(attribute.value),
        attribute: {refURL: `/unifiedconfig/config/attribute/${attribute.id}`}
      })
    }
    data.agentAttributes = [{agentAttribute}]
  }
  
  // add supervised teams, if supervisor and supplied
  if (supervisor && supervisorTeamIds && supervisorTeamIds.length) {
    const supervisorTeam = []
    for (const id of supervisorTeamIds) {
      supervisorTeam.push({
        refURL: `/unifiedconfig/config/agentteam/${id}`
      })
    }
    data.supervisorTeams = [{supervisorTeam}]
  }

  // add Agent Desk Settings ID, if specified
  if (deskSettingsId) {
    data.agentDeskSettings = {refURL: `/unifiedconfig/config/agentdesksetting/${deskSettingsId}`}
  }

  return data
}
