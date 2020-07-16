const hydra = require('./index')

async function authorize (user, query) {
  // allow all for admins
  if (user.admin) {
    console.log(`${user.username} is an admin. granting write access`, query)
    return true
  }
  console.log(`${user.username} is not an admin. looking up access`, query)
  // check if user has write access
  try {
    const response = await hydra({
      service: process.env.hydra_lab_config_service,
      path: 'permissions',
      query
    })
    // check response code
    if (response.statusCode < 200 || response.statusCode >= 300) {
      console.log(`hydra service returned ${response.statusCode}. Can't grant access to ${user.username} for ${type} ${id}`)
      // bad response
      return false
    } else {
      // good response
      // console.log('hydra response for permissions:', response.results)
      if (response.results.length !== 1) {
        console.log(`Wrong number of results in lab config hydra response. Expected 1 but found ${response.results.length}.`)
        return false
      }
      const permission = response.results[0]
      // check if username is in the 'owner' or 'write' arrays
      if (permission.owner === user.username) {
        console.log(`${user.username} is the owner of ${type} ${id} and so has write access`)
        return true
      } else if (permission.write && permission.write.includes(user.username)) {
        console.log(`${user.username} has write access to ${type} ${id}`)
        return true
      } else {
        console.log(`${user.username} does not have write access to ${type} ${id}`)
        return false
      }
    }
  } catch (error) {
    console.error(error)
    return false
  }
}

module.exports = authorize
