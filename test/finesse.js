require('dotenv').config()
const finesse = require('../src/models/finesse')
console.log('process.env.FINESSE_HOST', process.env.FINESSE_HOST)
console.log('process.env.FINESSE_USER', process.env.FINESSE_USER)
console.log('process.env.FINESSE_PASSWORD', process.env.FINESSE_PASSWORD)
console.log('process.env.CUMULUS_MAIN_TEAM_ID', process.env.CUMULUS_MAIN_TEAM_ID)

// copyLayoutConfig(5014, 5027).catch(e => console.log('copylayoutconfig function error:', e))
main().catch(e => console.log('main function error:', e.message))

async function main () {
  // const allTeams = await finesse.list('Team')
  // console.log('allTeams', allTeams)
  const config = await finesse.getFromTeam(process.env.CUMULUS_MAIN_TEAM_ID, 'WrapUpReasons')
  console.log('config', config)
}

// copy Finesse layout XML config from team ID "from" to team ID "to"
async function copyLayoutConfig (from, to) {
  try {
    console.log('copying Finesse layout config XML from', from, 'to', to)
    const layout = await finesse.getFromTeam(from, 'LayoutConfig')
    await finesse.saveToTeam(to, 'LayoutConfig', layout)
  } catch (e) {
    throw e
  }
}
