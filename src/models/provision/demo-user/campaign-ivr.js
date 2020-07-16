module.exports = function ({
  name,
  description,
  dialedNumber,
  skillGroupId,
  departmentId
}) {
  const data = {
    "abandonEnabled": "false",
    "abandonPercent": "3.0",
    "amdTreatmentMode": "abandonCall",
    "campaignPurposeType": "ivrCampaign",
    "callProgressAnalysis": {
      "enabled": "false",
      "record": "false",
      "minSilencePeriod": "375",
      "analysisPeriod": "2500",
      "minimumValidSpeech": "112",
      "maxTimeAnalysis": "3000",
      "maxTermToneAnalysis": "15000"
    },
    // "description": description,
    "dialingMode": "PREDICTIVEONLY",
    "enabled": "true",
    "endDate": "2023-12-31",
    "endTime": "23:59",
    "ipAmdEnabled": "false",
    "ipTerminatingBeepDetect": "false",
    "linesPerAgent": "1.5",
    "maxAttempts": "1",
    "maximumLinesPerAgent": "2.0",
    "minimumCallDuration": "1",
    "name": name,
    "noAnswerRingLimit": "5",
    "personalizedCallbackEnabled": "true",
    "predictiveCorrectionPace": "70",
    "predictiveGain": "1.0",
    "rescheduleCallbackMode": "useCampaignDN",
    "reservationPercentage": "100",
    "retries": {
      "answeringMachineDelay": "60",
      "busySignalDelay": "60",
      "customerAbandonedDelay": "30",
      "customerNotHomeDelay": "60",
      "dialerAbandonedDelay": "60",
      "noAnswerDelay": "60"
    },
    "skillGroupInfos": {
      "skillGroupInfo": {
        "dialedNumber": dialedNumber,
        "ivrPorts": "5",
        "ivrRoutePoint": dialedNumber,
        "overflowAgents": "0",
        "recordsToCache": "1",
        "skillGroup": {
          "refURL": `/unifiedconfig/config/skillgroup/${skillGroupId}`
        }
      }
    },
    "startDate": "2020-01-02",
    "startTime": "00:00",
    "timeZone": {
      "refURL": "/unifiedconfig/config/timezone/Eastern%20Standard%20Time",
      "displayName": "(UTC-05:00) Eastern Time (US & Canada)"
    }
  }
  
  // add description
  if (description) data.description = description
  // add department
  // if (departmentId) {
  //   data.department = {
  //     refURL: `/unifiedconfig/config/department/${departmentId}`
  //   }
  // }

  return data
}


