// determine URL base for production or development environment
// production default
let base = '/api/v1/pcce'
let authEndpoint = '/api/v1/auth'
// or set to development URLs if not production
if (process.env.NODE_ENV !== 'production') {
  // in development, prefix base URL with localhost and port
  base = 'http://localhost:' + process.env.NODE_PORT + base
  authEndpoint = 'http://localhost:3032/api/v1/auth'
}

// export endpoints object
const endpoints = {
  /** auth endoints **/
  // login/logout
  logout: authEndpoint + '/logout',
  login: authEndpoint + '/login',
  // switch user (admin)
  su: authEndpoint + '/su',
  lockUser: authEndpoint + '/lock',
  unlockUser: authEndpoint + '/unlock',
  // list users (admin)
  admin: {
    user: authEndpoint + '/admin/users'
  },
  // list user provision status
  userProvisionMap: authEndpoint + '/provision',
  /** main endpoints **/
  provision: base + '/provision',
  // brand demo website brands
  brand: base + '/brand',
  cce: {
    type: base + '/cce/{0}',
    item: base + '/cce/{0}/{1}'
  },
  cucm: {
    phone: base + '/cucm/phone',
    line: base + '/cucm/line',
  },
  // configure cumulus demo per-user settings
  cumulus: base + '/cumulus',
  cvp: {
    vxmlApp: base + '/cvp/vxmlapp',
    mediaFile: base + '/cvp/mediafile',
    mediaFileContent: base + '/cvp/mediafile/content',
    logHosts: base + '/cvp/logs/hosts',
    syncVxmlApp: base + '/cvp/vxmlapp/sync',
    syncMediaFile: base + '/cvp/mediafile/sync'
  },
  // defaults
  defaults: base + '/defaults',
  // demos
  demos: base + '/demos',
  // demo selectors
  demoSelectors: base + '/demo-selectors',
  dids: base + '/dids',
  // so meta
  endpoints: base + '/endpoints',
  // finesse
  finesse: {
    user: base + '/finesse/User/{0}',
    users: base + '/finesse/User',
    phoneBook: base + '/finesse/PhoneBook',
    workflow: base + '/finesse/Workflow',
    reasonCode: base + '/finesse/ReasonCode',
    wrapUpReason: base + '/finesse/WrapUpReason',
    team: {
      phoneBook: base + '/finesse/Team/PhoneBook',
      workflow: base + '/finesse/Team/Workflow',
      reasonCode: base + '/finesse/Team/ReasonCode',
      wrapUpReason: base + '/finesse/Team/WrapUpReason',
      layout: base + '/teams/{0}/layout'
    }
  },
  // this endpoint exists in the pcce-toolbox-proxy project to register user provision status
  instanceRegister: base + '/instances/register',
  // add/get customers (routing info)
  routing: base + '/routing',
  // get dcloud session info
  session: base + '/session',
  // get API tokens (admin)
  tokens: base + '/tokens',
  // templates types
  templates: base + '/templates/{0}',
  // usage logs
  usage: base + '/usage',
  // the version of this project/package
  version: base + '/version',
  // Cumulus demo verticals
  vertical: base + '/vertical',
  // Webex Teams bot APIs
  webex: base + '/webex'
}

module.exports = endpoints
