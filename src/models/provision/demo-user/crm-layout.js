module.exports = `<finesseLayout xmlns="http://www.cisco.com/vtg/finesse">
  <!--  DO NOT EDIT. The version number for the layout XML. -->
  <version>1201.0</version>
  <configs>
      <!-- The Title for the application which can be customized. -->
      <config key="title" value="Cisco Finesse"/>
      <!-- The logo file for the application -->
      <!-- For detailed instructions on using custom icons for logos and tabs,
      please refer to the section "Customise Title and Logo in the Header"
      in the Finesse Administration Guide. -->
      <!-- <config key="logo" value="/3rdpartygadget/files/cisco_finext_logo.png"/>  -->
  </configs>
  <header>
      <!--  Please ensure that at least one gadget/component is present within every headercolumn tag -->
      <leftAlignedColumns>
          <headercolumn width="300px">
              <component id="cd-logo">
                  <url>/desktop/scripts/js/logo.js</url>
              </component>
          </headercolumn>
          <headercolumn width="230px">
              <component id="agent-voice-state">
                  <url>/desktop/scripts/js/agentvoicestate.component.js</url>
              </component>
          </headercolumn>
          <headercolumn width="251px">
              <component id="nonvoice-state-menu">
                  <url>/desktop/scripts/js/nonvoice-state-menu.component.js</url>
              </component>
          </headercolumn>
      </leftAlignedColumns>
      <rightAlignedColumns>
          <headercolumn width="50px">
              <component id="broadcastmessagepopover">
                  <url>/desktop/scripts/js/teammessage.component.js</url>
              </component>
          </headercolumn>
          <headercolumn width="50px">
              <component id="chat">
                  <url>/desktop/scripts/js/chat.component.js</url>
              </component>
          </headercolumn>
          <headercolumn width="50px">
              <component id="make-new-call-component">
                  <url>/desktop/scripts/js/makenewcall.component.js</url>
              </component>
          </headercolumn>
          <headercolumn width="72px">
              <component id="identity-component">
                  <url>/desktop/scripts/js/identity-component.js</url>
              </component>
          </headercolumn>
      </rightAlignedColumns>
  </header>
  <layout>
      <role>Agent</role>
      <page>
          <gadget>/desktop/scripts/js/callcontrol.js</gadget>
      </page>
      <tabs>
            <tab>
                <id>myStatistics</id>
                <icon>column-chart</icon>
                <label>finesse.container.tabs.agent.myStatisticsLabel</label>
                <columns>
                    <column>
                        <gadgets>
                            <gadget>https://cuic1.dcloud.cisco.com:8444/cuic/gadget/LiveData/LiveDataGadget.jsp?gadgetHeight=310&amp;viewId_1=99E6C8E210000141000000D80A0006C4&amp;filterId_1=agent.id=CL%20teamName</gadget>
                            <gadget>https://cuic1.dcloud.cisco.com:8444/cuic/gadget/LiveData/LiveDataGadget.jsp?gadgetHeight=310&amp;viewId_1=B71A630C10000144000002480A0007C5&amp;filterId_1=precisionQueue.id=CL%20teamName&amp;viewId_2=286B86F01000014C000005330A0006C4&amp;filterId_2=precisionQueue.id=CL%20teamName</gadget>
                        </gadgets>
                    </column>
                </columns>
            </tab>
            <tab>
                <id>myHistory</id>
                <icon>history</icon>
                <label>finesse.container.tabs.agent.myHistoryLabel</label>
                <columns>
                    <column>
                        <gadgets>
                            <gadget>https://cuic1.dcloud.cisco.com:8444/cuic/gadget/LiveData/LiveDataGadget.jsp?gadgetHeight=280&amp;viewId=5FA44C6F930C4A64A6775B21A17EED6A&amp;filterId=agentTaskLog.id=CL%20teamName</gadget>
                            <gadget>https://cuic1.dcloud.cisco.com:8444/cuic/gadget/LiveData/LiveDataGadget.jsp?gadgetHeight=280&amp;viewId=56BC5CCE8C37467EA4D4EFA8371258BC&amp;filterId=agentStateLog.id=CL%20teamName</gadget>
                        </gadgets>
                    </column>
                </columns>
            </tab>
          <tab>
              <id>SFDC</id>
              <icon>tabs</icon>
              <label>SFDC</label>
              <gadgets>
                  <gadget>/3rdpartygadget/files/BsFusion/CRM_2-6-1/12_0_CRM.xml</gadget>
              </gadgets>
          </tab>
      </tabs>
  </layout>
  <layout>
      <role>Supervisor</role>
      <page>
          <gadget>/desktop/scripts/js/callcontrol.js</gadget>
      </page>
      <tabs>
            <tab>
                <id>manageTeam</id>
                <icon>manage-team</icon>
                <label>finesse.container.tabs.supervisor.manageTeamLabel</label>
                <columns>
                    <column>
                        <gadgets>
                            <gadget id="team-performance" maxRows="20">/desktop/scripts/js/teamPerformance.js</gadget>
                            <gadget managedBy="team-performance">https://cuic1.dcloud.cisco.com:8444/cuic/gadget/LiveData/LiveDataGadget.jsp?gadgetHeight=275&amp;viewId=630CB4C96B0045D9BFF295A49A0BA45E&amp;filterId=agentTaskLog.id=AgentEvent:Id&amp;type=dynamic&amp;maxRows=20</gadget>
                            <gadget managedBy="team-performance">https://cuic1.dcloud.cisco.com:8444/cuic/gadget/LiveData/LiveDataGadget.jsp?gadgetHeight=275&amp;viewId=56BC5CCE8C37467EA4D4EFA8371258BC&amp;filterId=agentStateLog.id=AgentEvent:Id&amp;type=dynamic&amp;maxRows=20</gadget>
                        </gadgets>
                    </column>
                </columns>
            </tab>
            <tab>
                <id>teamData</id>
                <icon>team-data</icon>
                <label>finesse.container.tabs.supervisor.teamDataLabel</label>
                <columns>
                    <column>
                        <gadgets>
                            <gadget>https://cuic1.dcloud.cisco.com:8444/cuic/gadget/Historical/HistoricalGadget.jsp?viewId=BD9A8B7DBE714E7EB758A9D472F0E7DC&amp;linkType=htmlType&amp;viewType=Grid&amp;refreshRate=900&amp;@start_date=RELDATE%20THISWEEK&amp;@end_date=RELDATE%20THISWEEK&amp;@agent_list=CL%20~teams~&amp;gadgetHeight=360</gadget>
                        </gadgets>
                    </column>
                </columns>
            </tab>
            <tab>
                <id>queueData</id>
                <icon>storage</icon>
                <label>finesse.container.tabs.supervisor.queueDataLabel</label>
                <columns>
                    <column>
                        <gadgets>
                            <gadget>/desktop/scripts/js/queueStatistics.js</gadget>
                        </gadgets>
                    </column>
                </columns>
            </tab>
            <tab>
                <id>myHistory</id>
                <icon>history</icon>
                <label>finesse.container.tabs.agent.myHistoryLabel</label>
                <columns>
                    <column>
                        <gadgets>
                            <gadget>https://cuic1.dcloud.cisco.com:8444/cuic/gadget/LiveData/LiveDataGadget.jsp?gadgetHeight=280&amp;viewId=5FA44C6F930C4A64A6775B21A17EED6A&amp;filterId=agentTaskLog.id=CL%20teamName</gadget>
                            <gadget>https://cuic1.dcloud.cisco.com:8444/cuic/gadget/LiveData/LiveDataGadget.jsp?gadgetHeight=280&amp;viewId=56BC5CCE8C37467EA4D4EFA8371258BC&amp;filterId=agentStateLog.id=CL%20teamName</gadget>
                        </gadgets>
                    </column>
                </columns>
            </tab>
            <tab>
                <id>customersatisfaction</id>
                <icon>emoticons</icon>
                <label>Customer Satisfaction</label>
                <columns>
                    <column>
                        <gadgets>
                            <gadget>/3rdpartygadget/files/Cumulus/CUIC/CustomerSatisfactionSurvey/CUIC.xml</gadget>
                        </gadgets>
                    </column>
                    <column>
                        <gadgets>
                            <gadget>/3rdpartygadget/files/Cumulus/CUIC/CustomerSatisfactionSurveyQuality/CUIC.xml</gadget>
                            <gadget>/3rdpartygadget/files/Cumulus/CUIC/CustomerSatisfactionSurveyFriend/CUIC.xml</gadget>
                        </gadgets>
                    </column>
                </columns>
            </tab>
            <tab>
                <id>SMS</id>
                <icon>chat</icon>
                <label>SMS</label>
                <gadgets>
                    <gadget>/3rdpartygadget/files/Cumulus/WebTextSMS/gadget.xml</gadget>
                </gadgets>
            </tab>
      </tabs>
  </layout>
</finesseLayout>`