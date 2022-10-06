// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2022 Recidiviz, Inc.
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

import { UploadedFiles } from "../components/DataUpload";
import { MetricsView } from "../components/MetricsView";
import {
  AccountSettings,
  ContentDisplay,
  SettingsContainer,
  SettingsMenu,
} from "../components/Settings";

export const menuOptions = [
  "Your Account",
  "Uploaded Files",
  "Metric Configuration",
] as const;
export type MenuOptions = typeof menuOptions[number];

const Settings = () => {
  const [activeMenuItem, setActiveMenuItem] = useState<MenuOptions>(
    menuOptions[0]
  );

  const goToMenuItem = (destination: MenuOptions) =>
    setActiveMenuItem(destination);

  return (
    <SettingsContainer>
      <SettingsMenu
        activeMenuItem={activeMenuItem}
        goToMenuItem={goToMenuItem}
      />

      <ContentDisplay>
        {activeMenuItem === "Your Account" && <AccountSettings />}
        {activeMenuItem === "Uploaded Files" && <UploadedFiles />}
        {activeMenuItem === "Metric Configuration" && <MetricsView />}
      </ContentDisplay>
    </SettingsContainer>
  );
};

export default Settings;
