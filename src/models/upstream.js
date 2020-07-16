const mssql = require('mssql')

const config = {
  user: process.env.UPSTREAM_SQL_USER,
  password: process.env.UPSTREAM_SQL_PASSWORD,
  server: process.env.UPSTREAM_SQL_HOST,
  database: process.env.UPSTREAM_SQL_DB
}

async function getCustomers () {
  const query = `SELECT * FROM [dbo].[data_Customers]`
  try {
    const pool = await new mssql.ConnectionPool(config).connect()
    const results = await pool.request().query(query)
    return results.recordset
  } catch (e) {
    throw e
  } finally {
    mssql.close()
  }
}

// return customers belonging to specified team ID
async function getTeamCustomers (teamId) {
  const query = `SELECT * FROM [dbo].[data_Customers] WHERE TeamId = @TeamId`
  try {
    const pool = await new mssql.ConnectionPool(config).connect()
    const results = await pool.request()
    .input('TeamId', teamId)
    .query(query)
    return results.recordset
  } catch (e) {
    throw e
  } finally {
    mssql.close()
  }
}

async function createCustomer (data) {
  try {
    // get connection pool
    const pool = await new mssql.ConnectionPool(config).connect()
    const request1 = new mssql.Request(pool)
    .input('ContactId', data.contactId)
    .input('FirstName', data.firstName)
    .input('LastName', data.lastName)
    .input('PhoneNumber', data.phone)
    .input('EmailAddress', data.email)
    .input('Vertical', data.vertical)
    // .output('return_value', mssql.Int)
    // run sp
    const results1 = await request1.execute('dCloudSetCustomer')
    // const ret = results1.output.return_value
    // console.log('results1', results1)

    // mssql.close()
    // return results.rowsAffected
    return results1
  } catch (e) {
    throw e
  } finally {
    mssql.close()
  }
}

async function copyInteractionHistory ({
  sourceContactId,
  contactId,
  name,
  address = '',
  phone,
  email
}) {
  try {
    // get connection pool
    const pool = await new mssql.ConnectionPool(config).connect()
    const request1 = new mssql.Request(pool)
    .input('SourceContactId', sourceContactId)
    .input('ContactId', contactId)
    .input('NewContactName', name)
    .input('NewSourceAddress', address)
    .input('NewPhoneNumber', phone)
    .input('NewEmailAddress', email)
    // run sp
    const results1 = await request1.execute('dCloudIRDBIHReplicateCustomerIHDetail')
    // const ret = results1.output.return_value
    // console.log('results1', results1)

    // mssql.close()
    // return results.rowsAffected
    return results1
  } catch (e) {
    throw e
  } finally {
    mssql.close()
  }
}

async function setCustomerWithInteractionHistory ({
  contactId,
  phone,
  email,
  firstName,
  lastName,
  vertical,
  deleteInteractionHistory = true,
  createInteractionHistory = true
}) {
  try {
    // get connection pool
    const pool = await new mssql.ConnectionPool(config).connect()
    const request1 = new mssql.Request(pool)
    .input('ContactId', contactId)
    .input('PhoneNumber', phone)
    .input('EmailAddress', email)
    .input('FirstName', firstName)
    .input('LastName', lastName)
    .input('Vertical', vertical)
    .input('DeleteIH', deleteInteractionHistory ? 'Y' : 'N')
    .input('CreateIH', createInteractionHistory ? 'Y' : 'N')
    // run sp
    return request1.execute('dCloudSetCustomerWithIH')
  } catch (e) {
    throw e
  } finally {
    mssql.close()
  }
}

async function setInstantDemoCustomerWithInteractionHistory ({
  contactId,
  phone,
  email,
  firstName,
  lastName,
  vertical,
  teamId,
  deleteInteractionHistory = true,
  createInteractionHistory = true
}) {
  try {
    // get connection pool
    const pool = await new mssql.ConnectionPool(config).connect()
    const request1 = new mssql.Request(pool)
    .input('ContactId', contactId)
    .input('PhoneNumber', phone)
    .input('EmailAddress', email)
    .input('FirstName', firstName)
    .input('LastName', lastName)
    .input('Vertical', vertical)
    .input('TeamId', teamId)
    .input('DeleteIH', deleteInteractionHistory ? 'Y' : 'N')
    .input('CreateIH', createInteractionHistory ? 'Y' : 'N')
    // run sp
    return request1.execute('dCloudIDSetCustomerWithIH')
  } catch (e) {
    throw e
  } finally {
    mssql.close()
  }
}

async function createTeam ({
  contactId,
  phone,
  email,
  firstName,
  lastName,
  vertical,
  teamId,
  deleteInteractionHistory = true,
  createInteractionHistory = true
}) {
  try {
    // get connection pool
    const pool = await new mssql.ConnectionPool(config).connect()
    const request1 = new mssql.Request(pool)
    .input('TeamId', teamId)
    // run sp
    return request1.execute('dCloudIDCreateTeam')
  } catch (e) {
    throw e
  } finally {
    mssql.close()
  }
}

async function setVertical (data) {
  try {
    // get connection pool
    const pool = await new mssql.ConnectionPool(config).connect()
    const request1 = new mssql.Request(pool)
    .input('Vertical', data)
    // run sp
    const results1 = await request1.execute('dCloudSetVertical')
    return results1
  } catch (e) {
    throw e
  } finally {
    mssql.close()
  }
}

module.exports = {
  setVertical,
  createCustomer,
  getCustomers,
  getTeamCustomers,
  copyInteractionHistory,
  setCustomerWithInteractionHistory,
  setInstantDemoCustomerWithInteractionHistory
}
