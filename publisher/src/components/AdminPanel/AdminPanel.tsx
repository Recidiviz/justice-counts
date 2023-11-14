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
import { AgencyProvisioning, Setting, SettingType, UserProvisioning } from ".";
import * as Styled from "./AdminPanel.styles";

export const AdminPanel = observer(() => {
  const navigate = useNavigate();
  const { api, adminPanelStore } = useStore();
  const { fetchUsers, fetchAgencies } = adminPanelStore;

  const [currentProvisioningType, setProvisioningType] = useState<SettingType>(
    Setting.USERS
  );

  const settingOptions = [
    {
      key: "users",
      label: "User Provisioning",
      onClick: () => setProvisioningType(Setting.USERS),
      selected: currentProvisioningType === Setting.USERS,
    },
    {
      key: "agencies",
      label: "Agency Provisioning",
      onClick: () => setProvisioningType(Setting.AGENCIES),
      selected: currentProvisioningType === Setting.AGENCIES,
    },
  ];

  useEffect(() => {
    fetchUsers();
    fetchAgencies();
  }, [fetchUsers, fetchAgencies]);

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
          <TabbedBar options={settingOptions} size="medium" />
        </Styled.SidePaddingWrapper>

        <Styled.ProvisioningViewContainer>
          {currentProvisioningType === Setting.USERS && <UserProvisioning />}
          {currentProvisioningType === Setting.AGENCIES && (
            <AgencyProvisioning />
          )}
        </Styled.ProvisioningViewContainer>
      </Styled.AdminPanelWrapper>
    </Styled.AdminPanelContainer>
  );
});
