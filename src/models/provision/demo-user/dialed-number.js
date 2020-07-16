// routingType = 1 = External Voice
// routingType = 2 = Internal Voice
// routingType = 3 = Outbound Voice
// routingType = 4 = Enterprise Chat and Email

module.exports = function ({
  dialedNumberString,
  description,
  departmentId,
  callTypeId,
  mrdId = 1,
  routingType = 3
}) {
  // required properties
  const data = {
    dialedNumberString,
    routingType,
    mediaRoutingDomain: {refURL: `/unifiedconfig/config/mediaroutingdomain/${mrdId}`}
  }

  // add description
  if (description) data.description = description

  // add department
  if (departmentId) {
    data.department = {refURL: `/unifiedconfig/config/department/${departmentId}`}
  }
  // add call type
  if (callTypeId) {
    data.callType = {refURL: `/unifiedconfig/config/calltype/${callTypeId}`}
  }

  return data
}
