module.exports = function ({
  name,
  dialingMode = 'PREVIEWDIRECTONLY',
  // campaignPurposeType = 'ivrCampaign',
  campaignPurposeType = 'agentCampaign',
  dialedNumber,
  ivrPorts = 0,
  sgId,
  campaignPrefix,
  departmentId
}) {
  // required properties
  const data = {
    name,
    dialingMode,
    campaignPurposeType,
    dialedNumber,
    skillGroupInfos: {
      skillGroupInfo: {
        abandonedRoutePoint: dialedNumber,
        dialedNumber: dialedNumber,
        ivrPorts,
        ivrRoutePoint: dialedNumber,
        overflowAgents: 0,
        recordsToCache: 1,
        skillGroup: {refURL: `/unifiedconfig/config/skillgroup/${sgId}`}
      }
    },
    abandonEnabled: true,
    abandonPercent: 3.0,
    amdTreatmentMode: 'abandonCall',
    callProgressAnalysis: {
      enabled: false,
      record: false,
      minSilencePeriod: 375,
      analysisPeriod: 2500,
      minimumValidSpeech: 112,
      maxTimeAnalysis: 3000,
      maxTermToneAnalysis: 15000
    },
    enabled: true,
    endTime: '23:59',
    ipAmdEnabled: false,
    ipTerminatingBeepDetect: false,
    linesPerAgent: 1.5,
    maxAttempts: 3,
    maximumLinesPerAgent: 2.0,
    minimumCallDuration: 1,
    noAnswerRingLimit: 4,
    personalizedCallbackEnabled: true,
    predictiveCorrectionPace: 70,
    predictiveGain: 3.0,
    rescheduleCallbackMode: 'useCampaignDN',
    reservationPercentage: 100,
    retries: {
      answeringMachineDelay: 60,
      busySignalDelay: 60,
      customerAbandonedDelay: 30,
      customerNotHomeDelay: 60,
      dialerAbandonedDelay: 60,
      noAnswerDelay: 60
    },
    startDate: '2017-10-25',
    startTime: '00:00',
    timeZone: {refURL: '/unifiedconfig/config/timezone/UTC'}
  }

  if (campaignPrefix) data.campaignPrefix = campaignPrefix

  // add department
  if (departmentId) {
    data.department = {
      refURL: `/unifiedconfig/config/department/${departmentId}`
    }
  }

  return data
}
