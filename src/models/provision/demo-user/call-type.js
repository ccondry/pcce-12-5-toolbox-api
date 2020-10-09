module.exports = function ({
  name,
  description,
  departmentId,
  serviceLevelThreshold,
  serviceLevelType,
  survey
}) {
  // name is required
  const data = {
    name
  }
  // add description
  if (description) data.description = description
  // add department
  if (departmentId) {
    data.department = {
      refURL: `/unifiedconfig/config/department/${departmentId}`
    }
  }
  if (serviceLevelThreshold) data.serviceLevelThreshold = serviceLevelThreshold
  if (serviceLevelType) data.serviceLevelType = serviceLevelType
  if (survey) data.survey = survey

  return data
}
