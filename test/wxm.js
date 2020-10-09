require('dotenv').config()
const cce = require('../src/models/cce')
async function main () {
  const callTypes = await cce.list('callType')
  const ret = callTypes.filter(v => v.survey)
  console.log(ret )
}

main().catch(() => {})
