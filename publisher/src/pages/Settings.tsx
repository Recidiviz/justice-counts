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

import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { UploadedFiles } from "../components/DataUpload";
import { MetricConfiguration } from "../components/MetricConfiguration";
import {
  AccountSettings,
  ContentDisplay,
  SettingsContainer,
  SettingsMenu,
} from "../components/Settings";

export const menuOptions = {
  "Your Account": "/settings/account",
  "Uploaded Files": "/settings/uploaded-files",
  "Metric Configuration": "/settings/metric-config",
};

export type ListOfMetricsForNavigation = {
  key: string;
  display_name: string;
};

const Settings = () => {
  return (
    <SettingsContainer>
      <SettingsMenu />

      <ContentDisplay>
        <Routes>
          <Route path="/" element={<Navigate to="account" replace />} />
          <Route path="/account" element={<AccountSettings />} />
          <Route path="/uploaded-files" element={<UploadedFiles />} />
          <Route path="/metric-config" element={<MetricConfiguration />} />
        </Routes>
      </ContentDisplay>
    </SettingsContainer>
  );
};

export default Settings;
