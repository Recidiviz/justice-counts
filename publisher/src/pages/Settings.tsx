// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2024 Recidiviz, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
// =============================================================================

import { TabbedBar } from "@justice-counts/common/components/TabbedBar";
import React, { useState } from "react";

import {
  AccountSettings,
  AgencySettings,
  ContentDisplay,
  SettingsSubTitle,
  SettingsTabBlock,
  SettingsTabContainer,
  SettingsTitle,
  SettingsTitleContainer,
} from "../components/AgencySettings";
import { AgencySettingsTeamManagement } from "../components/AgencySettings/AgencySettingsTeamManagement";
import { TabContent } from "../components/AgencySettings/TabContent";
import { AppGuideKeys, GuideKeys } from "../components/HelpCenter/types";
import { createURLToGuide } from "../components/HelpCenter/utils";

enum tabOptions {
  ACCOUNT = "Account",
  TEAM_MEMBERS = "Team Members",
}
const Settings = () => {
  const learnMoreURL = createURLToGuide(
    AppGuideKeys.publisher,
    GuideKeys.Settings
  );
  const [currentSettingsView, setCurrentSettingsView] = useState(
    tabOptions.ACCOUNT
  );
  const settingsViewOptions = [
    {
      key: tabOptions.ACCOUNT.toLowerCase(),
      label: tabOptions.ACCOUNT,
      onClick: () => setCurrentSettingsView(tabOptions.ACCOUNT),
      selected: currentSettingsView === tabOptions.ACCOUNT,
    },
    {
      key: tabOptions.TEAM_MEMBERS.toLowerCase(),
      label: tabOptions.TEAM_MEMBERS,
      onClick: () => setCurrentSettingsView(tabOptions.TEAM_MEMBERS),
      selected: currentSettingsView === tabOptions.TEAM_MEMBERS,
    },
  ];

  return (
    <ContentDisplay>
      <SettingsTitleContainer>
        <SettingsTitle>Settings</SettingsTitle>
        <SettingsSubTitle>
          Edit your account settings or manage your team members.
          <a href={learnMoreURL} target="_blank" rel="noopener noreferrer">
            &nbsp;Learn More
          </a>
        </SettingsSubTitle>
      </SettingsTitleContainer>
      <SettingsTabContainer>
        <SettingsTabBlock>
          <TabbedBar options={settingsViewOptions} />
        </SettingsTabBlock>
        <SettingsTabBlock>
          <TabContent isActive={currentSettingsView === tabOptions.ACCOUNT}>
            <AccountSettings />
            <AgencySettings />
          </TabContent>
          <TabContent
            isActive={currentSettingsView === tabOptions.TEAM_MEMBERS}
          >
            <AgencySettingsTeamManagement />
          </TabContent>
        </SettingsTabBlock>
      </SettingsTabContainer>
    </ContentDisplay>
  );
};

export default Settings;
