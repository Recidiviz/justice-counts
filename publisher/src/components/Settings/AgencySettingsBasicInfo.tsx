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

import { useStore } from "../../stores";
import { formatSystemName } from "../../utils";
import {
  AgencySettingsBlock,
  BasicInfoBlockDescription,
  BasicInfoRow,
} from "./AgencySettings.styles";

export const AgencySettingsBasicInfo = () => {
  const { agencyStore } = useStore();
  const { currentAgency, currentAgencySystems } = agencyStore;

  return (
    <AgencySettingsBlock id="basic-info" withBorder>
      <BasicInfoRow>
        <span>Agency Name</span>
        {currentAgency?.name}
      </BasicInfoRow>
      <BasicInfoRow>
        <span>State</span>
        {currentAgency?.state}
      </BasicInfoRow>
      <BasicInfoRow capitalize>
        <span>
          {currentAgencySystems && currentAgencySystems.length > 1
            ? "Systems"
            : "System"}
        </span>
        {currentAgencySystems
          ?.map((system) => formatSystemName(system, currentAgencySystems))
          .join(", ")}
      </BasicInfoRow>
      <BasicInfoBlockDescription>
        *If any of the above looks incorrect, contact the Justice Counts team at{" "}
        <a href="mailto:justice-counts-support@csg.org">
          justice-counts-support@csg.org
        </a>
        .
      </BasicInfoBlockDescription>
    </AgencySettingsBlock>
  );
};
