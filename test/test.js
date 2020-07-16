require('dotenv').load()
const hydraExpress = require('hydra-express')
const hydra = hydraExpress.getHydra()
const pkg = require('../package.json')
const hydra2 = require('../src/hydra2')
const upstream = require('../src/models/upstream')

// set up hydra and redis config
const hydraConfig = {
  hydra: {
    serviceName: pkg.name,
    serviceIP: process.env.hydra_service_ip || '',
    servicePort: process.env.hydra_service_port || 0,
    serviceType: process.env.hydra_service_type || '',
    serviceDescription: pkg.description,
    redis: {
      url: process.env.redis_url,
      port: process.env.redis_port,
      db: process.env.redis_db
    }
  }
}

// init hydra
hydraExpress.init(hydraConfig, () => {})
.then(async (serviceInfo) => {
  // find all finesse teams
  try {
    // const finesseTeams = await hydra2({
    //   service: process.env.hydra_lab_config_service,
    //   path: `finesse/Team`
    // })
    // // console.log('finesse teams:', finesseTeams)
    //
    // const cceTeams = await hydra2({
    //   service: process.env.hydra_cce_service,
    //   path: `agentTeam`
    // })
    // // console.log('cce teams:', cceTeams)
    //
    // // filter to only my department
    // const departments = await hydra2({
    //   service: process.env.hydra_cce_service,
    //   path: `department`
    // })
    // // console.log('cce departments:', departments)
    //
    // const myDepartment = departments.find(v => {
    //   return v.name === 'ccondry'
    // })
    // console.log('myDepartment', myDepartment)
    //
    // const myTeams = cceTeams.filter(v => {
    //   return v.department.refURL === myDepartment.refURL
    // })
    // console.log('myTeams', myTeams)
    const customers = await upstream.getCustomers()
    console.log('found upstream customers:', customers)
    const teamCustomers = await upstream.getTeamCustomers(1)
    console.log('found upstream team 1 customers:', teamCustomers)
  } catch (e) {
    console.error(e)
  }
})
.catch(e => {
  console.error(e)
})
