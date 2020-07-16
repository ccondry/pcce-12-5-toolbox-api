module.exports = `<!-- 
  Note: When you upgrade, modify Custom Layout XML appropriately to utilize the benefits of new gadgets.
  -->
  <finesseLayout xmlns="http://www.cisco.com/vtg/finesse">
      <!--  DO NOT EDIT. The version number for the layout XML. -->
      <version>1201.0</version>
      <configs>
          <!-- The Title for the application which can be customized. -->
          <config key="title" value="          UWF"/>
          <!-- The logo file for the application -->
          <!-- For detailed instructions on using custom icons for logos and tabs,
          please refer to the section "Customise Title and Logo in the Header"
          in the Finesse Administration Guide. -->
          <config key="logo" value="https://cceweb.dcloud.cisco.com/static/internal/common/img/upstreamWorksLogo-02.svg"/>
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
        <gadget>https://cceweb.dcloud.cisco.com/GadgetServices/Serve/UWF/MarqueeClient</gadget>
        <gadget>https://cceweb.dcloud.cisco.com/GadgetServices/Serve/UWF/Taskbar?outboundAC=WU&amp;campaignAC=WU&amp;inboundAC=WU&amp;enableFollowUp=true</gadget>
        <gadget>https://cceweb.dcloud.cisco.com/GadgetServices/Serve/UWF/InteractionCapture?enableFollowUp=true</gadget>
      </page>
      <tabs>
        <tab>
          <id>InteractionViewer</id>
          <icon>https://cceweb.dcloud.cisco.com/static/internal/common/icon/menu/uw_menu-interactionActivitiy.svg</icon>
          <label>Interaction Activity</label>
          <gadgets>
            <gadget>https://cceweb.dcloud.cisco.com/GadgetServices/Serve/UWF/InteractionActivity?enableFollowUp=true</gadget>
          </gadgets>
        </tab>
        <tab>
          <id>email</id>
          <icon>https://cceweb.dcloud.cisco.com/static/internal/common/icon/menu/uw_menu-email.svg</icon>
          <label>Email</label>
          <gadgets>
            <gadget>https://cceweb.dcloud.cisco.com/GadgetServices/Serve/UWF/EmailClient</gadget>
          </gadgets>
        </tab>
        <tab>
          <id>chat</id>
          <icon>https://cceweb.dcloud.cisco.com/static/internal/common/icon/menu/uw_menu-chat.svg</icon>
          <label>Messaging</label>
          <gadgets>
            <gadget>https://cceweb.dcloud.cisco.com/GadgetServices/Serve/UWF/ChatClient</gadget>
          </gadgets>
        </tab>
        <tab>
          <id>directory</id>
          <icon>https://cceweb.dcloud.cisco.com/static/internal/common/icon/menu/uw_menu-directory.svg</icon>
          <label>Directory</label>
          <gadgets>
            <gadget>https://cceweb.dcloud.cisco.com/GadgetServices/Serve/UWF/Directory</gadget>
          </gadgets>
        </tab>
        <tab>
          <id>UWFTeam</id>
          <icon>team-data</icon>
          <label>Team Chat</label>
          <gadgets>
            <gadget>https://cceweb.dcloud.cisco.com/GadgetServices/Serve/UWF/TeamChat</gadget>
          </gadgets>
        </tab>
        <tab>
          <id>Home</id>
          <icon>https://cceweb.dcloud.cisco.com/static/internal/common/icon/menu/uw_menu-supervisor.svg</icon>
          <label>Agent Stats</label>
          <gadgets>
            <gadget>https://cceweb.dcloud.cisco.com/GadgetServices/Serve/UWF/Supervisory</gadget>
          </gadgets>
          </tab>
          
  <!--commented out starts here  -->      
  
        <tab>
          <id>Preferences</id>
          <icon>https://cceweb.dcloud.cisco.com/static/internal/common/icon/menu/uw_menu-preferences.svg</icon>
          <label>Preferences</label>
          <gadgets>
            <gadget>https://cceweb.dcloud.cisco.com/GadgetServices/Serve/UWF/Preferences</gadget>
          </gadgets>
        </tab>
  
        <tab>
          <id>tools</id>
          <icon>https://cceweb.dcloud.cisco.com/static/internal/common/icon/menu/uw_menu-tools.svg</icon>
          <label>Tools</label>
          <gadgets>
            <gadget>https://deuwfapp.demo.upstreamworks.com/solutions/demo/gadgets/cobrowse/gadget.xml</gadget>
            <gadget>https://cceweb.dcloud.cisco.com/demo/Gadgets/FinCti.Gadget.xml</gadget>
          </gadgets>
        </tab>
  
  <!-- xxxxxxxxxxxxxxxxxxxxxxxxx  commented out ENDS here xxxxxxxxxxxxxxxxxxx -->
  
      </tabs>
      </layout>
      <layout>
      <role>Supervisor</role>
      <page>
        <gadget>/desktop/scripts/js/callcontrol.js</gadget>
        <gadget>https://cceweb.dcloud.cisco.com/GadgetServices/Serve/UWF/MarqueeClient</gadget>
        <gadget>https://cceweb.dcloud.cisco.com/GadgetServices/Serve/UWF/Taskbar?outboundAC=WU&amp;campaignAC=WU&amp;inboundAC=WU&amp;enableFollowUp=true</gadget>
        <gadget>https://cceweb.dcloud.cisco.com/GadgetServices/Serve/UWF/Interactioncapture?enableFollowUp=true</gadget>
      </page>
      <tabs>
        <tab>
          <id>Home</id>
          <icon>https://cceweb.dcloud.cisco.com/static/internal/common/icon/menu/uw_menu-supervisor.svg</icon>
          <label>Supervisor</label>
          <gadgets>
            <gadget>https://cceweb.dcloud.cisco.com/GadgetServices/Serve/UWF/Supervisory</gadget>
          </gadgets>
        </tab>
        <tab>
          <id>marqueeMessageAdmin</id>
          <icon>https://cceweb.dcloud.cisco.com/static/internal/common/icon/menu/uw_menu-marqueeAdmin.svg</icon>
          <label>Marquee Admin</label>
            <gadgets> 
              <gadget>https://cceweb.dcloud.cisco.com/GadgetServices/Serve/UWF/MarqueeStats</gadget>
              <gadget>https://cceweb.dcloud.cisco.com/GadgetServices/Serve/UWF/MarqueeAdmin</gadget>
            </gadgets>
         </tab>
        <tab>
          <id>UserManager</id>
          <icon>https://cceweb.dcloud.cisco.com/static/internal/common/icon/menu/uw_menu-userManager.svg</icon>
          <label>User Manager</label>
          <gadgets>
            <gadget>https://cceweb.dcloud.cisco.com/GadgetServices/Serve/UWF/UserManagement</gadget>
          </gadgets>
        </tab>
        <tab>
          <id>ViewTasks</id>
          <icon>https://cceweb.dcloud.cisco.com/static/internal/common/icon/menu/uw_menu-viewTasks.svg</icon>
          <label>View Tasks</label>
          <gadgets>
            <gadget>https://cceweb.dcloud.cisco.com/GadgetServices/Serve/UWF/ViewTasks?allowDelete=true</gadget>
          </gadgets>
        </tab>
        <tab>
          <id>UWFTeam</id>
          <icon>team-data</icon>
          <label>Team Chat</label>
          <gadgets>
            <gadget>https://cceweb.dcloud.cisco.com/GadgetServices/Serve/UWF/TeamChat</gadget>
          </gadgets>
        </tab>
        <tab>
          <id>InteractionViewer</id>
          <icon>https://cceweb.dcloud.cisco.com/static/internal/common/icon/menu/uw_menu-interactionActivitiy.svg</icon>
          <label>Interaction Activity</label>
          <gadgets>
            <gadget>https://cceweb.dcloud.cisco.com/GadgetServices/Serve/UWF/InteractionActivity?enableFollowUp=true</gadget>
          </gadgets>
        </tab>
        <tab>
          <id>email</id>
          <icon>https://cceweb.dcloud.cisco.com/static/internal/common/icon/menu/uw_menu-email.svg</icon>
          <label>Email</label>
          <gadgets>
            <gadget>https://cceweb.dcloud.cisco.com/GadgetServices/Serve/UWF/EmailClient</gadget>
          </gadgets>
        </tab>
        <tab>
          <id>chat</id>
          <icon>https://cceweb.dcloud.cisco.com/static/internal/common/icon/menu/uw_menu-chat.svg</icon>
          <label>Messaging</label>
          <gadgets>
            <gadget>https://cceweb.dcloud.cisco.com/GadgetServices/Serve/UWF/ChatClient</gadget>
          </gadgets>
        </tab>
        <tab>
          <id>directory</id>
          <icon>https://cceweb.dcloud.cisco.com/static/internal/common/icon/menu/uw_menu-directory.svg</icon>
          <label>Directory</label>
          <gadgets>
            <gadget>https://cceweb.dcloud.cisco.com/GadgetServices/Serve/UWF/Directory</gadget>
          </gadgets>
        </tab>
        <tab>
          <id>supervisor</id>
          <icon>https://cceweb.dcloud.cisco.com/static/internal/common/icon/menu/uw_menu-supervisor.svg</icon>
          <label>Supervisor</label>
          <gadgets>
            <gadget id="team-performance">/desktop/scripts/js/teamPerformance.js</gadget>
            <!-- gadget>http://localhost/desktop/gadgets/TeamPerformance.jsp</gadget -->
            <gadget>http://localhost/desktop/gadgets/QueueStatistics.jsp</gadget>
          </gadgets>
        </tab>
      </tabs>
      </layout>
  </finesseLayout>`