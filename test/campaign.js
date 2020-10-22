require('dotenv').config()
const fetch = require('node-fetch')

const id = '5021'
const url = `https://${process.env.CCE_HOST}/unifiedconfig/config/campaign/${id}/import/`
const authString = Buffer.from(`${process.env.CCE_USER}:${process.env.CCE_PASS}`).toString('base64')

function makeBody ({records, delimiter = ',', overwrite = false}) {
  return `<import>
  <fileContent>
      <![CDATA[
      ${records}
      ]]> 
  </fileContent>
  <delimiter>${delimiter}</delimiter>
  <overwriteData>${overwrite}</overwriteData>
</import>`
}

const records = `AccountNumber,FirstName,LastName,Phone01
1324,Jimothy,Timston,2142336226`

// insert call record
const options1 = {
  method: 'POST',
  headers: {
    Authorization: 'Basic ' + authString,
    'Content-Type': 'application/xml'
  },
  body: makeBody({records})
}

// list call records
const options2 = {
  method: 'GET',
  headers: {
    Authorization: 'Basic ' + authString,
    Accept: 'application/json'
  }
}
//fetch(url, options1)
//.catch(e => console.log(e.message))

fetch(url, options2)
.then(r => r.json())
.then(text => console.log(text.importContacts[0].importContact))
.catch(e => console.log(e.message))