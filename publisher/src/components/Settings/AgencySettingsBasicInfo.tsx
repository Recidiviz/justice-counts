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

import React from "react";

import { useStore } from "../../stores";
import { formatSystemName } from "../../utils";
import { SYSTEM_CAPITALIZED, SYSTEMS_CAPITALIZED } from "../Global/constants";
import {
  AgencySettingsBlock,
  AgencySettingsSectionColumn,
  AgencySettingsSectionColumnLabel,
  AgencySettingsSectionRow,
} from "./AgencySettings.styles";

export const AgencySettingsBasicInfo = () => {
  const { agencyStore } = useStore();
  const { currentAgency, currentAgencySystems } = agencyStore;

  return (
    <AgencySettingsBlock id="basic-info">
      <AgencySettingsSectionRow capitalize>
        <AgencySettingsSectionColumn>
          <AgencySettingsSectionColumnLabel>
            Agency Name
          </AgencySettingsSectionColumnLabel>
          {currentAgency?.name}
        </AgencySettingsSectionColumn>
        <AgencySettingsSectionColumn>
          <AgencySettingsSectionColumnLabel>
            State
          </AgencySettingsSectionColumnLabel>
          {currentAgency?.state}
        </AgencySettingsSectionColumn>
        <AgencySettingsSectionColumn>
          <AgencySettingsSectionColumnLabel>
            {currentAgencySystems && currentAgencySystems.length > 1
              ? SYSTEMS_CAPITALIZED
              : SYSTEM_CAPITALIZED}
          </AgencySettingsSectionColumnLabel>
          {currentAgencySystems
            ?.map((system) =>
              formatSystemName(system, { allUserSystems: currentAgencySystems })
            )
            .join(", ")}
        </AgencySettingsSectionColumn>
      </AgencySettingsSectionRow>
    </AgencySettingsBlock>
  );
};
