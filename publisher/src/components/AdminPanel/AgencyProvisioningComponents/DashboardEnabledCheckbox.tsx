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

import { observer } from "mobx-react-lite";
import React from "react";

import { useStore } from "../../../stores";
import * as Styled from "../AdminPanel.styles";

export const DashboardEnabledCheckbox: React.FC = observer(() => {
  const { adminPanelStore } = useStore();
  const { agencyProvisioningUpdates, updateIsDashboardEnabled } =
    adminPanelStore;

  return (
    <Styled.InputLabelWrapper flexRow>
      <input
        id="dashboard"
        name="dashboard"
        type="checkbox"
        onChange={() =>
          updateIsDashboardEnabled(
            !agencyProvisioningUpdates.is_dashboard_enabled
          )
        }
        checked={Boolean(agencyProvisioningUpdates.is_dashboard_enabled)}
      />
      <label htmlFor="dashboard">Dashboard enabled</label>
    </Styled.InputLabelWrapper>
  );
});
