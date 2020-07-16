{
  TeamLayoutConfig: {
    layoutxml: '&lt;finesseLayout xmlns=&quot;http://www.cisco.com/vtg/finesse&quot;&gt;\n' +
      '    &lt;!--  DO NOT EDIT. The version number for the layout XML. --&gt;\n' +
      '    &lt;version&gt;1201.0&lt;/version&gt;\n' +
      '    &lt;configs&gt;\n' +
      '        &lt;!-- The Title for the application which can be customized. --&gt;\n' +
      '        &lt;config key=&quot;title&quot; value=&quot;Cisco Finesse&quot;/&gt;\n' +
      '        &lt;!-- The logo file for the application --&gt;\n' +
      '        &lt;!-- For detailed instructions on using custom icons for logos and tabs,\n' +
      '        please refer to the section &quot;Customise Title and Logo in the Header&quot;\n' +
      '        in the Finesse Administration Guide. --&gt;\n' +
      '        &lt;!-- &lt;config key=&quot;logo&quot; value=&quot;/3rdpartygadget/files/cisco_finext_logo.png&quot;/&gt;  --&gt;\n' +
      '    &lt;/configs&gt;\n' +
      '    &lt;header&gt;\n' +
      '        &lt;!--  Please ensure that at least one gadget/component is present within every headercolumn tag --&gt;\n' +
      '        &lt;leftAlignedColumns&gt;\n' +
      '            &lt;headercolumn width=&quot;300px&quot;&gt;\n' +
      '                &lt;component id=&quot;cd-logo&quot;&gt;\n' +
      '                    &lt;url&gt;/desktop/scripts/js/logo.js&lt;/url&gt;\n' +
      '                &lt;/component&gt;\n' +
      '            &lt;/headercolumn&gt;\n' +
      '            &lt;headercolumn width=&quot;230px&quot;&gt;\n' +
      '                &lt;component id=&quot;agent-voice-state&quot;&gt;\n' +
      '                    &lt;url&gt;/desktop/scripts/js/agentvoicestate.component.js&lt;/url&gt;\n' +
      '                &lt;/component&gt;\n' +
      '            &lt;/headercolumn&gt;\n' +
      '            &lt;headercolumn width=&quot;251px&quot;&gt;\n' +
      '                &lt;component id=&quot;nonvoice-state-menu&quot;&gt;\n' +
      '                    &lt;url&gt;/desktop/scripts/js/nonvoice-state-menu.component.js&lt;/url&gt;\n' +
      '                &lt;/component&gt;\n' +
      '            &lt;/headercolumn&gt;\n' +
      '        &lt;/leftAlignedColumns&gt;\n' +
      '        &lt;rightAlignedColumns&gt;\n' +
      '            &lt;headercolumn width=&quot;50px&quot;&gt;\n' +
      '                &lt;component id=&quot;broadcastmessagepopover&quot;&gt;\n' +
      '                    &lt;url&gt;/desktop/scripts/js/teammessage.component.js&lt;/url&gt;\n' +
      '                &lt;/component&gt;\n' +
      '            &lt;/headercolumn&gt;\n' +
      '            &lt;headercolumn width=&quot;50px&quot;&gt;\n' +
      '                &lt;component id=&quot;chat&quot;&gt;\n' +
      '                    &lt;url&gt;/desktop/scripts/js/chat.component.js&lt;/url&gt;\n' +
      '                &lt;/component&gt;\n' +
      '            &lt;/headercolumn&gt;\n' +
      '            &lt;headercolumn width=&quot;50px&quot;&gt;\n' +
      '                &lt;component id=&quot;make-new-call-component&quot;&gt;\n' +
      '                    &lt;url&gt;/desktop/scripts/js/makenewcall.component.js&lt;/url&gt;\n' +
      '                &lt;/component&gt;\n' +
      '            &lt;/headercolumn&gt;\n' +
      '            &lt;headercolumn width=&quot;72px&quot;&gt;\n' +
      '                &lt;component id=&quot;identity-component&quot;&gt;\n' +
      '                    &lt;url&gt;/desktop/scripts/js/identity-component.js&lt;/url&gt;\n' +
      '                &lt;/component&gt;\n' +
      '            &lt;/headercolumn&gt;\n' +
      '        &lt;/rightAlignedColumns&gt;\n' +
      '    &lt;/header&gt;\n' +
      '    &lt;layout&gt;\n' +
      '        &lt;role&gt;Agent&lt;/role&gt;\n' +
      '        &lt;page&gt;\n' +
      '            &lt;gadget&gt;/desktop/scripts/js/callcontrol.js&lt;/gadget&gt;\n' +
      '        &lt;/page&gt;\n' +
      '        &lt;tabs&gt;\n' +
      '            &lt;tab&gt;\n' +
      '                &lt;id&gt;Stats&lt;/id&gt;\n' +
      '                &lt;icon&gt;tabs&lt;/icon&gt;\n' +
      '                &lt;label&gt;Stats&lt;/label&gt;\n' +
      '                &lt;columns&gt;\n' +
      '                    &lt;column&gt;\n' +
      '                        &lt;gadgets&gt;\n' +
      '                            &lt;gadget&gt;https://cuic1.dcloud.cisco.com:8444/cuic/gadget/LiveData/LiveDataGadget.jsp?gadgetHeight=310&amp;amp;viewId_1=99E6C8E210000141000000D80A0006C4&amp;amp;filterId_1=agent.id=CL%20teamName&lt;/gadget&gt;\n' +
      '                            &lt;gadget&gt;https://cuic1.dcloud.cisco.com:8444/cuic/gadget/LiveData/LiveDataGadget.jsp?gadgetHeight=310&amp;amp;viewId_1=B71A630C10000144000002480A0007C5&amp;amp;filterId_1=precisionQueue.id=CL%20teamName&amp;amp;viewId_2=286B86F01000014C000005330A0006C4&amp;amp;filterId_2=precisionQueue.id=CL%20teamName&lt;/gadget&gt;\n' +
      '                        &lt;/gadgets&gt;\n' +
      '                    &lt;/column&gt;\n' +
      '                &lt;/columns&gt;\n' +
      '            &lt;/tab&gt;\n' +
      '            &lt;tab&gt;\n' +
      '                &lt;id&gt;History&lt;/id&gt;\n' +
      '                &lt;icon&gt;tabs&lt;/icon&gt;\n' +
      '                &lt;label&gt;History&lt;/label&gt;\n' +
      '                &lt;columns&gt;\n' +
      '                    &lt;column&gt;\n' +
      '                        &lt;gadgets&gt;\n' +
      '                            &lt;gadget&gt;https://cuic1.dcloud.cisco.com:8444/cuic/gadget/LiveData/LiveDataGadget.jsp?gadgetHeight=280&amp;amp;viewId=5FA44C6F930C4A64A6775B21A17EED6A&amp;amp;filterId=agentTaskLog.id=CL%20teamName&lt;/gadget&gt;\n' +
      '                            &lt;gadget&gt;https://cuic1.dcloud.cisco.com:8444/cuic/gadget/LiveData/LiveDataGadget.jsp?gadgetHeight=280&amp;amp;viewId=56BC5CCE8C37467EA4D4EFA8371258BC&amp;amp;filterId=agentStateLog.id=CL%20teamName&lt;/gadget&gt;\n' +
      '                        &lt;/gadgets&gt;\n' +
      '                    &lt;/column&gt;\n' +
      '                &lt;/columns&gt;\n' +
      '            &lt;/tab&gt;\n' +
      '            &lt;tab&gt;\n' +
      '                &lt;id&gt;OutboundAgt&lt;/id&gt;\n' +
      '                &lt;icon&gt;tabs&lt;/icon&gt;\n' +
      '                &lt;label&gt;Acqueon Outbound&lt;/label&gt;\n' +
      '                &lt;gadgets&gt;\n' +
      '                    &lt;gadget&gt;https://acqueon.dcloud.cisco.com/LCMAgentClient/Screenpop/ScreenPop.xml&lt;/gadget&gt;\n' +
      '                &lt;/gadgets&gt;\n' +
      '            &lt;/tab&gt;\n' +
      '        &lt;/tabs&gt;\n' +
      '    &lt;/layout&gt;\n' +
      '    &lt;layout&gt;\n' +
      '        &lt;role&gt;Supervisor&lt;/role&gt;\n' +
      '        &lt;page&gt;\n' +
      '            &lt;gadget&gt;/desktop/scripts/js/callcontrol.js&lt;/gadget&gt;\n' +
      '        &lt;/page&gt;\n' +
      '        &lt;tabs&gt;\n' +
      '            &lt;tab&gt;\n' +
      '                &lt;id&gt;TeamPerformance&lt;/id&gt;\n' +
      '                &lt;icon&gt;tabs&lt;/icon&gt;\n' +
      '                &lt;label&gt;Team Performance&lt;/label&gt;\n' +
      '                &lt;columns&gt;\n' +
      '                    &lt;column&gt;\n' +
      '                        &lt;gadgets&gt;\n' +
      '                            &lt;gadget id=&quot;team-performance&quot; maxRows=&quot;20&quot;&gt;/desktop/scripts/js/teamPerformance.js&lt;/gadget&gt;\n' +
      '                            &lt;gadget managedBy=&quot;team-performance&quot;&gt;https://cuic1.dcloud.cisco.com:8444/cuic/gadget/LiveData/LiveDataGadget.jsp?gadgetHeight=275&amp;amp;viewId=630CB4C96B0045D9BFF295A49A0BA45E&amp;amp;filterId=agentTaskLog.id=AgentEvent:Id&amp;amp;type=dynamic&amp;amp;maxRows=20&lt;/gadget&gt;\n' +
      '                            &lt;gadget managedBy=&quot;team-performance&quot;&gt;https://cuic1.dcloud.cisco.com:8444/cuic/gadget/LiveData/LiveDataGadget.jsp?gadgetHeight=275&amp;amp;viewId=56BC5CCE8C37467EA4D4EFA8371258BC&amp;amp;filterId=agentStateLog.id=AgentEvent:Id&amp;amp;type=dynamic&amp;amp;maxRows=20&lt;/gadget&gt;\n' +
      '                        &lt;/gadgets&gt;\n' +
      '                    &lt;/column&gt;\n' +
      '                &lt;/columns&gt;\n' +
      '            &lt;/tab&gt;\n' +
      '            &lt;tab&gt;\n' +
      '                &lt;id&gt;teamData&lt;/id&gt;\n' +
      '                &lt;icon&gt;tabs&lt;/icon&gt;\n' +
      '                &lt;label&gt;Team Data&lt;/label&gt;\n' +
      '                &lt;columns&gt;\n' +
      '                    &lt;column&gt;\n' +
      '                        &lt;gadgets&gt;\n' +
      '                            &lt;gadget&gt;https://cuic1.dcloud.cisco.com:8444/cuic/gadget/Historical/HistoricalGadget.jsp?viewId=BD9A8B7DBE714E7EB758A9D472F0E7DC&amp;amp;linkType=htmlType&amp;amp;viewType=Grid&amp;amp;refreshRate=900&amp;amp;@start_date=RELDATE%20THISWEEK&amp;amp;@end_date=RELDATE%20THISWEEK&amp;amp;@agent_list=CL%20~teams~&amp;amp;gadgetHeight=360&lt;/gadget&gt;\n' +
      '                        &lt;/gadgets&gt;\n' +
      '                    &lt;/column&gt;\n' +
      '                &lt;/columns&gt;\n' +
      '            &lt;/tab&gt;\n' +
      '            &lt;tab&gt;\n' +
      '                &lt;id&gt;queueData&lt;/id&gt;\n' +
      '                &lt;icon&gt;storage&lt;/icon&gt;\n' +
      '                &lt;label&gt;finesse.container.tabs.supervisor.queueDataLabel&lt;/label&gt;\n' +
      '                &lt;columns&gt;\n' +
      '                    &lt;column&gt;\n' +
      '                        &lt;gadgets&gt;\n' +
      '                            &lt;gadget&gt;/desktop/scripts/js/queueStatistics.js&lt;/gadget&gt;\n' +
      '                        &lt;/gadgets&gt;\n' +
      '                    &lt;/column&gt;\n' +
      '                &lt;/columns&gt;\n' +
      '            &lt;/tab&gt;\n' +
      '            &lt;tab&gt;\n' +
      '                &lt;id&gt;History&lt;/id&gt;\n' +
      '                &lt;icon&gt;tabs&lt;/icon&gt;\n' +
      '                &lt;label&gt;History&lt;/label&gt;\n' +
      '                &lt;columns&gt;\n' +
      '                    &lt;column&gt;\n' +
      '                        &lt;gadgets&gt;\n' +
      '                            &lt;gadget&gt;https://cuic1.dcloud.cisco.com:8444/cuic/gadget/LiveData/LiveDataGadget.jsp?gadgetHeight=280&amp;amp;viewId=5FA44C6F930C4A64A6775B21A17EED6A&amp;amp;filterId=agentTaskLog.id=CL%20teamName&lt;/gadget&gt;\n' +
      '                            &lt;gadget&gt;https://cuic1.dcloud.cisco.com:8444/cuic/gadget/LiveData/LiveDataGadget.jsp?gadgetHeight=280&amp;amp;viewId=56BC5CCE8C37467EA4D4EFA8371258BC&amp;amp;filterId=agentStateLog.id=CL%20teamName&lt;/gadget&gt;\n' +
      '                        &lt;/gadgets&gt;\n' +
      '                    &lt;/column&gt;\n' +
      '                &lt;/columns&gt;\n' +
      '            &lt;/tab&gt;\n' +
      '            &lt;tab&gt;\n' +
      '                &lt;id&gt;customersatisfaction&lt;/id&gt;\n' +
      '                &lt;icon&gt;tabs&lt;/icon&gt;\n' +
      '                &lt;label&gt;Customer Satisfaction&lt;/label&gt;\n' +
      '                &lt;columns&gt;\n' +
      '                    &lt;column&gt;\n' +
      '                        &lt;gadgets&gt;\n' +
      '                            &lt;gadget&gt;/3rdpartygadget/files/Cumulus/CUIC/CustomerSatisfactionSurvey/CUIC.xml&lt;/gadget&gt;\n' +
      '                        &lt;/gadgets&gt;\n' +
      '                    &lt;/column&gt;\n' +
      '                    &lt;column&gt;\n' +
      '                        &lt;gadgets&gt;\n' +
      '                            &lt;gadget&gt;/3rdpartygadget/files/Cumulus/CUIC/CustomerSatisfactionSurveyQuality/CUIC.xml&lt;/gadget&gt;\n' +
      '                            &lt;gadget&gt;/3rdpartygadget/files/Cumulus/CUIC/CustomerSatisfactionSurveyFriend/CUIC.xml&lt;/gadget&gt;\n' +
      '                        &lt;/gadgets&gt;\n' +
      '                    &lt;/column&gt;\n' +
      '                &lt;/columns&gt;\n' +
      '            &lt;/tab&gt;\n' +
      '            &lt;tab&gt;\n' +
      '                &lt;id&gt;SMS&lt;/id&gt;\n' +
      '                &lt;icon&gt;tabs&lt;/icon&gt;\n' +
      '                &lt;label&gt;SMS&lt;/label&gt;\n' +
      '                &lt;gadgets&gt;\n' +
      '                    &lt;gadget&gt;/3rdpartygadget/files/Cumulus/WebTextSMS/gadget.xml&lt;/gadget&gt;\n' +
      '                &lt;/gadgets&gt;\n' +
      '            &lt;/tab&gt;\n' +
      '            &lt;tab&gt;\n' +
      '                &lt;id&gt;OutboundSup&lt;/id&gt;\n' +
      '                &lt;icon&gt;tabs&lt;/icon&gt;\n' +
      '                &lt;label&gt;Outbound&lt;/label&gt;\n' +
      '                &lt;gadgets&gt;\n' +
      '                    &lt;gadget&gt;/3rdpartygadget/files/Acqueon/EmbeddedWebApp.xml&lt;/gadget&gt;\n' +
      '                &lt;/gadgets&gt;\n' +
      '            &lt;/tab&gt;\n' +
      '        &lt;/tabs&gt;\n' +
      '    &lt;/layout&gt;\n' +
      '&lt;/finesseLayout&gt;',
    useDefault: false
  }
}
