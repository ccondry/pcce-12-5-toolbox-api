const dataType = 3
const defaultValue = 'true'

module.exports = function ({name, departmentId, description}) {
  const data = {
    name,
    dataType,
    defaultValue
  }
  if (description) data.description = description
  if (departmentId) {
    data.department = {
      refURL: `/unifiedconfig/config/department/${departmentId}`
    }
  }
  return data
}
