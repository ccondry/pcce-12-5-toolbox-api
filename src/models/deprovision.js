const cce = require('./cce')

async function departmentItems (type, userId) {
  const list = await cce.list(type) 
  
  const existing = list
  .filter(item => {
    try {
      return item.department.name === userId
    } catch (e) {
      return false
    }
  })
  // console.log(existing)
  const ids = existing.map(v => v.refURL.split('/').pop())
  for (const id of ids) {
    try {
      await cce.delete(type, id)
      console.log('deleted', type, id)
    } catch (e) {
      if (e.response.status === 404) {
        console.log(type, id, 'does not exist')
      } else {
        console.log('failed to delete', type, id, ':', e.message)
      }
    }
  }
}

// async function agents (userId) {
//   const type = 'agent'
//   return 
// }

async function campaigns (userId) {
  const c = await cce.list('campaign')
  const userCampaigns = c.filter(v => {
    const parts = v.name.split('_')
    if (parts.length === 2) {
      return parts[1] === userId
    }
    return false
  })
  for (const campaign of userCampaigns) {
    const id = campaign.refURL.split('/').pop()
    await cce.delete('campaign', id)
    console.log('deleted', campaign.name)
  }
  console.log('all campaigns deprovisioned')
}

// async function pqs (userId) {
//   const type = 'precisionQueue'
//   const list = await cce.list(type) 
  
//   const existing = list
//   .filter(item => {
//     try {
//       return item.department.name === userId
//     } catch (e) {
//       return false
//     }
//   })
//   // console.log(existing)
//   const ids = existing.map(v => v.refURL.split('/').pop())
//   for (const id of ids) {
//     try {
//       await cce.delete(type, id)
//       console.log('deleted', type, id)
//     } catch (e) {
//       if (e.response.status === 404) {
//         console.log(type, id, 'does not exist')
//       } else {
//         console.log('failed to delete', type, id, ':', e.message)
//       }
//     }
//   }
// }

// async function skills (userId) {
//   const type = 'skillGroup'
//   const list = await cce.list(type) 
  
//   // const ids = existing
//   const existing = list
//   .filter(item => {
//     try {
//       return item.department.name === userId
//     } catch (e) {
//       return false
//     }
//   })
//   // console.log(existing)
//   const ids = existing.map(v => v.refURL.split('/').pop())
//   for (const id of ids) {
//     try {
//       await cce.delete(type, id)
//       console.log('deleted', type, id)
//     } catch (e) {
//       if (e.response.status === 404) {
//         console.log(type, id, 'does not exist')
//       } else {
//         console.log('failed to delete', type, id, ':', e.message)
//       }
//     }
//   }
// }

// async function teams (userId) {
//   const type = 'agentTeam'
//   const existing = await cce.list(type) 
  
//   const ids = existing
//   .filter(team => team.name.split('_').pop() === userId)
//   .map(team => team.refURL.split('/').pop())
  
//   for (const id of ids) {
//     try {
//       await cce.delete(type, id)
//       console.log('deleted', type, id)
//     } catch (e) {
//       if (e.response.status === 404) {
//         console.log(type, id, 'does not exist')
//       } else {
//         console.log('failed to delete', type, id, ':', e.message)
//       }
//     }
//   }
// }

async function departmentAdmin (userId) {
  const type = 'administrator'
  const list = await cce.list(type) 
  
  // const ids = existing
  const existing = list
  .filter(item => item.name.slice(-4) === userId)
  
  const ids = existing.map(team => team.refURL.split('/').pop())
  if (ids.length) {
    const id = ids[0]
    try {
      await cce.delete(type, id)
      console.log('deleted', type, id)
    } catch (e) {
      if (e.response.status === 404) {
        console.log(type, id, 'does not exist')
      } else {
        console.log('failed to delete', type, id, ':', e.message)
      }
    }
  }
}

async function department (name) {
  const type = 'department'
  const list = await cce.list(type) 
  
  // const ids = existing
  const existing = list
  .filter(item => item.name === name)
  
  const ids = existing.map(item => item.refURL.split('/').pop())
  if (ids.length) {
    const id = ids[0]
    try {
      await cce.delete(type, id)
      console.log('deleted', type, id)
    } catch (e) {
      if (e.response.status === 404) {
        console.log(type, id, 'does not exist')
      } else {
        console.log('failed to delete', type, id, ':', e.message)
      }
    }
  }
}

async function dialedNumbers (userId) {
  const type = 'dialedNumber'
  const list = await cce.list(type) 
  
  // const ids = existing
  const existing = list
  .filter(item => {
    return item.dialedNumberString.length === 8 &&
    item.dialedNumberString.slice(-4) === userId
  })
  // console.log(existing)
  const ids = existing.map(item => item.refURL.split('/').pop())
  
  for (const id of ids) {
    try {
      await cce.delete(type, id)
      console.log('deleted', type, id)
    } catch (e) {
      if (e.response.status === 404) {
        console.log(type, id, 'does not exist')
      } else {
        console.log('failed to delete', type, id, ':', e.message)
      }
    }
  }
}

async function pqAttributes (userId) {
  const type = 'attribute'
  const list = await cce.list(type) 
  
  // const ids = existing
  const existing = list
  .filter(item => {
    return item.name === 'User_' + userId
  })
  // console.log(existing)
  
  const ids = existing.map(item => item.refURL.split('/').pop())
  for (const id of ids) {
    try {
      await cce.delete(type, id)
      console.log('deleted', type, id)
    } catch (e) {
      if (e.response.status === 404) {
        console.log(type, id, 'does not exist')
      } else {
        console.log('failed to delete', type, id, ':', e.message)
      }
    }
  }
}

module.exports = {
  // agents,
  campaigns,
  // pqs,
  // pqAttributes,
  // skills,
  // teams,
  // callTypes,
  dialedNumbers,
  departmentAdmin,
  department,
  departmentItems
}