const hydra = require('./index')

async function authorize (user, {group, type, id}) {
  // allow all for admins
  if (user.admin) {
    console.log(`${user.username} is an admin. granting write access`, {group, type, id})
    return true
  }
  console.log(`${user.username} is not an admin. looking up access`, {group, type, id})
  // check if user has write access
  try {
    const response = await hydra({
      service: process.env.hydra_lab_config_service,
      path: 'permissions',
      query: {group, type, id}
    })
    // check response code
    if (response.statusCode < 200 || response.statusCode >= 300) {
      console.log(`hydra service returned ${response.statusCode}. Can't grant access to ${user.username} for ${group} ${type} ${id}`)
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
        console.log(`${user.username} has write access to ${group} ${type} ${id}`)
        return true
      } else {
        console.log(`${user.username} does not have write access to ${group} ${type} ${id}`)
        return false
      }
    }
  } catch (error) {
    console.error(error)
    return false
  }
}

async function addWritePermission (username, {group, type, id}) {
  // validate input
  if (!username || !group || !type || !id) throw `username, query.group, query.type, and query.id are required parameters for addWritePermission`
  console.log(`granting ${username} write permissions for ${group} ${type} ${id}...`)
  // build query for this permission
  const query = {group, type, id}
  try {
    // get current permissions for object
    const currentPermissions = await hydra({
      method: 'get',
      service: process.env.hydra_lab_config_service,
      path: 'permissions',
      query
    })
    // body object for PUT later
    let body

    if (currentPermissions.statusCode >= 200 && currentPermissions.statusCode < 300 && currentPermissions.results && currentPermissions.results.length) {
      if (currentPermissions.results.length > 1) {
        // we should not be here - maybe the query was not correct?
        const message = `Could not add write permission for ${username} on ${group} ${type} ${id} - found more than one matching permission object. currentPermissions.results.length = ${currentPermissions.results.length}`
        console.error(message)
        throw message
      }
      // success response with actual results
      // check data
      const writePermissions = currentPermissions.results.write
      if (Array.isArray(writePermissions)) {
        // there are current permissions - add this username if not in list
        if (writePermissions.find(v => v === username)) {
          // username already has write access
          return
        } else {
          // add username to write list
          writePermissions.push(username)
          // continue to PUT request
        }
      } else {
        // results do not contain a write array. create new one.
        body = currentPermissions.results[0]
        body.write = [username]
      }
    } else {
      // fail response or empty results from hydra GET permissions
      // build new permission object
      body = {
        group,
        type,
        id,
        write: [username]
      }
    }

    // PUT updated or new permissions
    const response = await hydra({
      method: 'put',
      service: process.env.hydra_lab_config_service,
      path: 'permissions',
      query,
      body
    })

    // check response code
    if (response.statusCode < 200 || response.statusCode >= 300) {
      console.log(`hydra service returned ${response.statusCode}. Failed to add write permission for ${username} on ${group} ${type} ${id}`)
      // bad response
      throw response
    } else {
      // good response
      console.log('wrote permissions for', username)
      return
    }
  } catch (error) {
    console.error('error while trying to add write permissions', error)
    throw error
  }
}

async function setOwner (username, {group, type, id}) {
  // validate input
  if (!username || !group || !type || !id) throw `username, query.group, query.type, and query.id are required parameters for setOwner`
  console.log(`setting ${username} as owner of ${group} ${type} ${id}...`)
  // build query for this permission
  const query = {group, type, id}
  try {
    // get current permissions for object
    const currentPermissions = await hydra({
      method: 'get',
      service: process.env.hydra_lab_config_service,
      path: 'permissions',
      query
    })
    // body object for PUT later
    let body

    if (currentPermissions.statusCode >= 200 && currentPermissions.statusCode < 300 && currentPermissions.results && currentPermissions.results.length) {
      if (currentPermissions.results.length > 1) {
        // we should not be here - maybe the query was not correct?
        const message = `Could not set owner to ${username} on ${group} ${type} ${id} - found more than one matching permission object. currentPermissions.results.length = ${currentPermissions.results.length}`
        console.error(message)
        throw message
      }
      // set the owner
      body = currentPermissions.results[0]
      body.owner = username
    } else {
      // fail response or empty results from hydra GET permissions
      // build new permission object
      body = {
        group,
        type,
        id,
        owner: username
      }
    }

    // PUT updated or new permissions
    const response = await hydra({
      method: 'put',
      service: process.env.hydra_lab_config_service,
      path: 'permissions',
      query,
      body
    })

    // check response code
    if (response.statusCode < 200 || response.statusCode >= 300) {
      console.log(`hydra service returned ${response.statusCode}. Failed to set owner to ${username} on ${group} ${type} ${id}`)
      // bad response
      throw response
    } else {
      // good response
      console.log('hydra response for set owner permission:', response.results)
      return
    }
  } catch (error) {
    console.error('error while trying to set owner permission', error)
    throw error
  }
}

module.exports = {
  addWritePermission,
  authorize,
  setOwner
}
