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

import notReportedIcon from "../../assets/not-reported-icon.png";
import * as Styled from "./NotReportedIcon.styled";

export const NotReportedIcon: React.FC<{
  size?: number;
  lighter?: boolean;
  noTooltip?: boolean;
  notReportingTooltipLink?: () => void;
}> = ({ size, lighter, noTooltip, notReportingTooltipLink }) => {
  return (
    <Styled.NotReportedIconWrapper size={size}>
      <Styled.NotReportedIconImg
        src={notReportedIcon}
        alt=""
        size={size}
        lighter={lighter}
        hasTooltip={!noTooltip}
      />
      {!noTooltip && (
        <Styled.NotReportedIconTooltipHoverArea size={size}>
          <Styled.NotReportedIconTooltip>
            This has been disabled by an admin because the data is unavailable.
            If you have the data for this, consider changing the configuration
            in the{" "}
            <Styled.MetricsViewLink onClick={notReportingTooltipLink}>
              Settings
            </Styled.MetricsViewLink>
            .
          </Styled.NotReportedIconTooltip>
        </Styled.NotReportedIconTooltipHoverArea>
      )}
    </Styled.NotReportedIconWrapper>
  );
};
