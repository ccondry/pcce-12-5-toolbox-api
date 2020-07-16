const request = require('request-promise-native')

async function syncCceSupervisors ({host, username, password}) {
  try {
    // var request = request.d  efaults({jar: true})
    const options = {
      jar: true,
      followAllRedirects: true
    }
    // get initial cookie
    await request(`https://${host}/oamp/Login.do`, options)
    // add auth
    options.form = {
      'j_username': username,
      'j_password': password
    }
    // post auth
    const response1 = await request.post(`https://${host}/oamp/j_security_check`, options)
    // console.log(response1)
    // get CSRF token
    const arr = response1.match(/<input type="hidden" id="csrfToken" name="csrfToken" value="([A-F,0-9]+)">/m)
    // console.log(arr[1])
    if (!arr) {
      throw new Error('could not find login form')
    }
    const csrfToken = arr[1]
    options.form = {
      scheduledTime: '13%3A00',
      method: 'toggleSynchronization',
      enabled: 'on',
      cbMonday: 'on',
      cbTuesday: 'on',
      cbWednesday: 'on',
      cbThursday: 'on',
      cbFriday: 'on',
      cbSaturday: 'on',
      cbSunday: 'on',
      csrfToken
    }

    // post change
    const response2 = await request.post(`https://${host}/oamp/configCUICUserIntegration.do`, options)
    // console.log(response2)
    return
  } catch (e) {
    throw e
  }
}

module.exports = {
  syncCceSupervisors
}
