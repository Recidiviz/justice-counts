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

import { Permission } from "@justice-counts/common/types";
import React from "react";
import styled from "styled-components/macro";

import agencyAdmin from "../assets/agency-admin.svg";
import recidivizAdmin from "../assets/recidiviz-admin.svg";

export const TeamMemberNameContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-right: 8px;
`;

export const TeamMemberNameWithBadge: React.FC<{
  name: string;
  permission?: Permission;
}> = ({ name, permission }) => (
  <TeamMemberNameContainer>
    {name}
    {permission === Permission.RECIDIVIZ_ADMIN && (
      <img src={recidivizAdmin} alt="" />
    )}
    {permission === Permission.AGENCY_ADMIN && <img src={agencyAdmin} alt="" />}
  </TeamMemberNameContainer>
);
