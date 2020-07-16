const domainName = process.env.CCE_DOMAIN_NAME.toUpperCase()
const ssoEnabled = false
const supervisor = false
const readOnly = false

module.exports = function ({
  userName,
  departmentId,
  roleId = '5001'
}) {
  const data = {
    domainName,
    ssoEnabled,
    supervisor,
    userName,
    readOnly,
    role: {
      refURL: `/unifiedconfig/config/role/${roleId}`
    }
  }
  if (departmentId) {
    data.departments = [{
      department: [{
        refURL: `/unifiedconfig/config/department/${departmentId}`
      }]
    }]
  }
  return data
}
