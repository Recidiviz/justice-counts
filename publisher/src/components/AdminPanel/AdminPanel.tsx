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

import { HeaderBar } from "@justice-counts/common/components/HeaderBar";
import { TabbedBar } from "@justice-counts/common/components/TabbedBar";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useStore } from "../../stores";
import {
  AgencyProvisioningOverview,
  Setting,
  SettingType,
  UserProvisioningOverview,
} from ".";
import * as Styled from "./AdminPanel.styles";

export const AdminPanel = observer(() => {
  const navigate = useNavigate();
  const { api, adminPanelStore } = useStore();
  const { fetchUsersAndAgencies } = adminPanelStore;

  const [currentProvisioningView, setProvisioningView] = useState<SettingType>(
    Setting.USERS
  );

  const provisioningViewOptions = [
    {
      key: "users",
      label: "User Provisioning",
      onClick: () => setProvisioningView(Setting.USERS),
      selected: currentProvisioningView === Setting.USERS,
    },
    {
      key: "agencies",
      label: "Agency Provisioning",
      onClick: () => setProvisioningView(Setting.AGENCIES),
      selected: currentProvisioningView === Setting.AGENCIES,
    },
  ];

  useEffect(
    () => {
      fetchUsersAndAgencies();
    },
    /** Refetch users and agencies when switching between User/Agency Provisioning tabs */
    [currentProvisioningView, fetchUsersAndAgencies]
  );

  return (
    <Styled.AdminPanelContainer>
      <HeaderBar onLogoClick={() => navigate("/admin-panel")} hasBottomBorder>
        <Styled.HeaderEnvironmentDisplay>
          {api.environment}
        </Styled.HeaderEnvironmentDisplay>
        Admin Panel
      </HeaderBar>

      <Styled.AdminPanelWrapper>
        <Styled.SidePaddingWrapper>
          <TabbedBar options={provisioningViewOptions} size="medium" />
        </Styled.SidePaddingWrapper>

        <Styled.ProvisioningViewContainer>
          {currentProvisioningView === Setting.USERS && (
            <UserProvisioningOverview />
          )}
          {currentProvisioningView === Setting.AGENCIES && (
            <AgencyProvisioningOverview />
          )}
        </Styled.ProvisioningViewContainer>
      </Styled.AdminPanelWrapper>
    </Styled.AdminPanelContainer>
  );
});
