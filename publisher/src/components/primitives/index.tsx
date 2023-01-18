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

// import { palette } from "@justice-counts/common/components/GlobalStyles";
import { Permission } from "@justice-counts/common/types";
import React from "react";
import styled from "styled-components/macro";

import { ReactComponent as AgencyAdmin } from "../assets/agency-admin.svg";
import { ReactComponent as RecidivizAdmin } from "../assets/recidiviz-admin.svg";

export const TeamMemberNameContainer = styled.div<{
  color?: string;
}>`
  display: flex;
  align-items: center;
  gap: 4px;

  svg {
    path {
      ${({ color }) => (color ? `fill: ${color}` : "")};
    }
  }
`;

export const TeamMemberNameWithBadge: React.FC<{
  name: string;
  permission?: Permission;
  badgeColor?: string;
}> = ({ name, permission, badgeColor }) => (
  <TeamMemberNameContainer color={badgeColor}>
    {name}
    {permission === Permission.RECIDIVIZ_ADMIN && <RecidivizAdmin />}
    {permission === Permission.AGENCY_ADMIN && <AgencyAdmin />}
  </TeamMemberNameContainer>
);
