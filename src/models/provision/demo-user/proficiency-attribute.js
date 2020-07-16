const dataType = 4
const defaultValue = '10'

module.exports = function ({departmentId, name, description}) {
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
