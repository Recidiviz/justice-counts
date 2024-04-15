// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2023 Recidiviz, Inc.
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

import React, { useState } from "react";

import {
  AccountSettings,
  AgencySettings,
  ContentDisplay,
  SettingsTabBlock,
  SettingsTabContainer,
  SettingsTitle,
  SettingsTitleString,
  TabButton,
} from "../components/Settings";
import { AgencySettingsTeamManagement } from "../components/Settings/AgencySettingsTeamManagement";
import { TabContent } from "../components/Settings/TabContent";

const Settings = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const handleClick = (tabNumber: number) => {
    setActiveTab(tabNumber);
  };

  return (
    <ContentDisplay>
        <SettingsTitle>
          <SettingsTitleString>
            Edit you account settings or manage your team members
            <a href="./this/test">&nbsp;Learn More</a>
          </SettingsTitleString>
        </SettingsTitle>
      <SettingsTabContainer>
        <SettingsTabBlock>
          <TabButton isActive={activeTab === 0} onClick={() => handleClick(0)}>
            Account
          </TabButton>
          <TabButton isActive={activeTab === 1} onClick={() => handleClick(1)}>
            Team Members
          </TabButton>
        </SettingsTabBlock>
        <SettingsTabBlock>
          <TabContent isActive={activeTab === 0}>
            <AccountSettings />
            <AgencySettings />
          </TabContent>
          <TabContent isActive={activeTab === 1}>
            <AgencySettingsTeamManagement />
          </TabContent>
        </SettingsTabBlock>
      </SettingsTabContainer>
    </ContentDisplay>
  );
};

export default Settings;
