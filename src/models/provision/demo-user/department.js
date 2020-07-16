module.exports = function ({name, description, administratorId}) {
  // name is required
  const data = {
    name
  }
  // add description
  if (description) {
    data.description = description
  }
  // add administrator
  if (administratorId) {
    data.administrators = [{
      administrator: [{
        refURL: `/unifiedconfig/config/administrator/${administratorId}`
      }]
    }]
  }
  
  return data
}
