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

import {
  MIN_TABLET_WIDTH,
  palette,
  typography,
} from "@justice-counts/common/components/GlobalStyles";
import { AgencyTeamMemberRole } from "@justice-counts/common/types";
import React from "react";
import styled from "styled-components/macro";

import { ReactComponent as RecidivizAdmin } from "../assets/recidiviz-admin.svg";

const TeamMemberNameContainer = styled.div<{
  color?: string;
}>`
  display: flex;
  align-items: center;

  svg {
    path {
      ${({ color }) => (color ? `fill: ${color}` : "")};
    }
  }
`;

const StyledRecidivizAdmin = styled(RecidivizAdmin)`
  min-width: 10px;
  min-height: 16px;
  margin-left: 4px;
`;

const NameContainer = styled.span`
  padding: 0 !important;
`;

export const DisclaimerBanner = styled.div`
  ${typography.sizeCSS.normal}
  width: 100;
  height: 54px;
  background: ${palette.solid.blue};
  color: ${palette.solid.white};
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  a,
  a:hover,
  a:visited {
    color: ${palette.solid.white};
    display: block;
  }

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    flex-direction: column;
    height: fit-content;
    padding: 16px 0;
  }
`;

export const TeamMemberNameWithBadge: React.FC<{
  name: string;
  role?: AgencyTeamMemberRole;
  badgeColor?: string;
  badgeId?: string;
  isInsideTooltip?: boolean;
  isLast?: boolean;
}> = ({ name, role, badgeColor, badgeId, isInsideTooltip, isLast }) => {
  const isJCAdminInsideTooltip = isInsideTooltip && name === "JC Admin";

  return (
    <TeamMemberNameContainer color={badgeColor} id={badgeId}>
      <NameContainer>{name}</NameContainer>
      {role === AgencyTeamMemberRole.JUSTICE_COUNTS_ADMIN &&
        !isJCAdminInsideTooltip && <StyledRecidivizAdmin id={badgeId} />}
      {isInsideTooltip && !isLast && ","}
    </TeamMemberNameContainer>
  );
};
