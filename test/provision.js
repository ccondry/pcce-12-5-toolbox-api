// load .env vars
require('dotenv').config()
// provision library
const dcloud = require('../src/models/provision/dcloud')
// test data
const user = {
  firstName: 'Mike',
  lastName: 'Test',
  id: '1001',
  username: 'test1001',
  email: 'test1001@cisco.com'
}
const password = 'C1sco12345'

// go
dcloud(user, password)
.then(r => console.log('provision complete:', r))
.catch(e => console.log('error:', e.message))
