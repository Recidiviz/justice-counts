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

import { palette } from "@justice-counts/common/components/GlobalStyles";
import { AgencyTeamMemberRole } from "@justice-counts/common/types";
import { rem } from "@justice-counts/common/utils";
import React from "react";
import { Tooltip } from "react-tooltip";
import styled from "styled-components/macro";

import { ReactComponent as AgencyAdmin } from "../assets/agency-admin.svg";
import { ReactComponent as RecidivizAdmin } from "../assets/recidiviz-admin.svg";

const TeamMemberNameContainer = styled.span<{
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

const StyledRecidivizAdmin = styled(RecidivizAdmin)`
  min-width: 10px;
  min-height: 16px;
`;

const StyledAgencyAdmin = styled(AgencyAdmin)`
  min-width: 10px;
  min-height: 13px;
`;

const tooltipStyles = {
  transition: "opacity 0s ease-out",
  background: palette.solid.darkgrey,
  boxShadow: "0px 4px 10px rgba(23, 28, 43, 0.2)",
  borderRadius: 5,
  opacity: 1,
  paddingVertical: 10,
  paddingHorizontal: 12,
  fontSize: rem("14px"),
  lineHeight: rem("22px"),
  fontWeight: 500,
};

const NameContainer = styled.span`
  padding: 0 !important;
`;

export const TeamMemberNameWithBadge: React.FC<{
  name: string;
  role?: AgencyTeamMemberRole;
  badgeColor?: string;
  badgeId?: string;
}> = ({ name, role, badgeColor, badgeId }) => (
  <>
    <TeamMemberNameContainer color={badgeColor}>
      <NameContainer>{name}</NameContainer>
      {role === AgencyTeamMemberRole.JUSTICE_COUNTS_ADMIN && (
        <StyledRecidivizAdmin id={badgeId} />
      )}
      {role === AgencyTeamMemberRole.AGENCY_ADMIN && (
        <StyledAgencyAdmin id={badgeId} />
      )}
    </TeamMemberNameContainer>
    {role === AgencyTeamMemberRole.JUSTICE_COUNTS_ADMIN && (
      <Tooltip
        anchorId={badgeId}
        content="JC Admin"
        place="right"
        noArrow
        offset={6}
        style={tooltipStyles}
      />
    )}
    {role === AgencyTeamMemberRole.AGENCY_ADMIN && (
      <Tooltip
        anchorId={badgeId}
        content="Admin"
        place="right"
        noArrow
        offset={6}
        style={tooltipStyles}
      />
    )}
  </>
);
