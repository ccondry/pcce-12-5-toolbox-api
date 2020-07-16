module.exports = function ({departmentId, description, mrdId, name, booleanAttributeId, proficiencyAttributeId}) {
  const data = {
    "department": {
      "refURL": `/unifiedconfig/config/department/${departmentId}`
    },
    "agentOrdering": 1,
    "callOrdering": 1,
    // "description": description,
    "mediaRoutingDomain": {
      "refURL": `/unifiedconfig/config/mediaroutingdomain/${mrdId}`
    },
    "name": name,
    "serviceLevelThreshold": 60,
    "serviceLevelType": 1,
    "steps": [
      {
        "step": [
          {
            "terms": [
              {
                "term": [
                  {
                    "attribute": {
                      "refURL": `/unifiedconfig/config/attribute/${booleanAttributeId}`
                    },
                    "attributeRelation": 1,
                    "parenCount": 1,
                    "termRelation": 0,
                    "value1": "true"
                  },
                  {
                    "attribute": {
                      "refURL": `/unifiedconfig/config/attribute/${proficiencyAttributeId}`
                    },
                    "attributeRelation": 6,
                    "parenCount": -1,
                    "termRelation": 1,
                    "value1": "7"
                  }
                ]
              }
            ],
            "waitTime": -1
          }
        ]
      }
    ]
  }

  if (description) data.description = description

  return data
}
