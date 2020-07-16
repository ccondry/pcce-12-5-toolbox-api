const express = require('express')
const router = express.Router()

module.exports = class EgainExpress {
  constructor (options) {
    // store config values
    this.client = options.client
    this.platform = options.platform
    this.licenseIds = options.licenseIds
    this.roleIds = options.roleIds
  }

  async addRoles ({skillTargetId}) {
    console.log(`adding roles to agent ${skillTargetId} in ${this.platform}`)
    // const promises = []
    // add each role to agent
    for (const roleId of this.roleIds) {
      try {
        await this.client.agent.addRole({skillTargetId, roleId})
      } catch (e) {
        // just log and continue
        console.log('failed to add role', roleId, 'to', skillTargetId, 'in', this.platform, ':', e.message)
      }
    }
  }

  // findAgent({skillTargetId})
  // find an agent using skill target ID (same as agent's CCE ref url ID)
  async findAgent ({skillTargetId}) {
    const response = await this.client.agent.find({skillTargetId})
    if (response.recordset.length) {
      // return agent object
      return response.recordset[0]
    } else {
      // not found - return null
      return null
    }
  }

  async modifyAgent ({
    skillTargetId,
    attribute,
    value
  }) {
    console.log(`request received to set ${attribute} of agent ${skillTargetId} to ${value} in ${this.platform}`)
    try {
      const results1 = await this.client.agent.changeAttribute(skillTargetId, attribute, value)
      const results2 = await this.client.agent.updateScreenName(skillTargetId)
      return [results1, results2]
    } catch (e) {
      console.log(`failed to modify agent ${skillTargetId} in ${this.platform}:`, e)
      throw e
    }
  }

  async addAgentRole ({
    skillTargetId,
    roleId
  }) {
    console.log(`request received to add role ${roleId} to agent ${skillTargetId} in ${this.platform}`)
    try {
      const results = await this.client.agent.addRole(skillTargetId, roleId)
      console.log(`successfully added role ${roleId} to agent ${skillTargetId} in ${this.platform}`)
      return results
    } catch (e) {
      console.log(`failed to add role ${roleId} to agent ${skillTargetId} in ${this.platform}:`, e.message)
      throw e
    }
  }

  async addAgentLicense ({
    skillTargetId,
    licenseKey
  }) {
    console.log(`request received to add license ${licenseKey} to agent ${skillTargetId} in ${this.platform}`)
    try {
      const results = await this.client.agent.addLicense(skillTargetId, licenseKey)
      console.log(`successfully added license ${licenseKey} to agent ${skillTargetId} in ${this.platform}`)
      return results
    } catch (e) {
      console.log(`failed to add role ${licenseKey} to agent ${skillTargetId} in ${this.platform}:`, e.message)
      throw e
    }
  }

  async addIcmAgent ({
    username,
    firstName,
    lastName,
    skillTargetId,
    departmentName
  }) {
    console.log(`request received to add ICM agent ${skillTargetId} to ${this.platform}`)
    try {
      // get department ID first
      const departmentId = await this.getDepartmentId({departmentName})
      if (!departmentId) {
        throw Error('department ID not found for department name ' + departmentName)
      }
      // go
      const results = await this.client.agent.addIcmUser({
        username,
        firstName,
        lastName,
        skillTargetId,
        departmentId,
        licenseIds: this.licenseIds
      })
      console.log(`successfully added ICM agent ${skillTargetId} to ${this.platform}`)
      return results
    } catch (e) {
      console.log(`failed to add ICM agent ${skillTargetId} to ${this.platform}:`, e.message)
      throw e
    }
  }

  async findRole ({
    roleName,
    departmentName
  }) {
    console.log(`request received to find role named ${roleName} in ${this.platform}`)
    try {
      // get department ID first
      const departmentId = await this.getDepartmentId({departmentName})
      // go
      const results = await this.client.agent.findRoleId({
        roleName,
        departmentId
      })
      console.log(`successfully found role ${roleName} in ${this.platform}`)
      return results
    } catch (e) {
      console.log(`failed to find role ${roleName} in ${this.platform}:`, e.message)
      throw e
    }
  }

  async getUserQueues ({
    username
  }) {
    console.log(`request received to get user queues for ${username} in ${this.platform}`)
    try {
      const results = await this.client.agent.getUserQueues({
        username
      })
      console.log(`successfully found role ${username} in ${this.platform}`)
      return results
    } catch (e) {
      console.log(`failed to find role ${username} in ${this.platform}:`, e.message)
      throw e
    }
  }

  async setConcurrentTaskLimit ({
    userId,
    queueId,
    concurrentTaskLimit
  }) {
    console.log(`request received to set concurrent task limit for user ID ${userId} and queue ID ${queueId} in ${this.platform}`)
    try {
      const results = await this.client.agent.setConcurrentTaskLimit({
        userId,
        queueId,
        concurrentTaskLimit
      })
      console.log(`successfully set concurrent task limit for user ID ${userId} and queue ID ${queueId} in ${this.platform}`)
      return results
    } catch (e) {
      console.log(`failed to set concurrent task limit for user ID ${userId} and queue ID ${queueId} in ${this.platform}:`, e.message)
      throw e
    }
  }
  // return eGain/ECE department ID from department name
  async getDepartmentId ({
    departmentName
  }) {
    console.log(`request received to get department ID for department ${departmentName} in ${this.platform}`)
    try {
      const department = await this.client.department.find({name: departmentName})
      if (department) {
        const departmentId = department.department_id
        console.log(`successfully found department ID for department ${departmentName} in ${this.platform}: ${departmentId}`)
        return departmentId
      } else {
        console.log(`did not find department ${departmentName} in ${this.platform}.`)
        return null
      }
    } catch (e) {
      console.log(`failed to get department ID for department ${departmentName} in ${this.platform}:`, e.message)
      throw e
    }
  }
}
