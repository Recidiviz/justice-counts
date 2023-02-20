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

import {
  NEW_DESKTOP_WIDTH,
  palette,
  typography,
} from "@justice-counts/common/components/GlobalStyles";
import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components/macro";

import notReportedIcon from "../assets/not-reported-icon.png";
import { DisaggregationsDropdownToggle } from "../Reports";
import { TWO_PANEL_MAX_WIDTH } from "../Reports/ReportDataEntry.styles";
import { TabItem } from "./Form.styles";
import { InputWrapper } from "./TextInput";

export const NotReportedIconWrapper = styled.div<{
  size?: number;
}>`
  height: ${({ size }) => size || "23"}px;
  width: ${({ size }) => size || "23"}px;
  position: relative;
`;

export const NotReportedIconImg = styled.img<{
  size?: number;
  lighter?: boolean;
  hasTooltip?: boolean;
}>`
  width: ${({ size }) => size || "23"}px;
  height: ${({ size }) => size || "23"}px;

  ${({ lighter }) => lighter && `opacity: 0.6;`};
  ${({ hasTooltip }) =>
    hasTooltip &&
    `
    &:hover {
        cursor: pointer;
    }
  `};

  ${TabItem}:hover & {
    opacity: 1;
  }

  ${InputWrapper}:hover & {
    opacity: 1;
  }
`;

export const NotReportedIconTooltip = styled.div`
  width: 267px;
  position: absolute;
  z-index: 2;
  background: ${palette.solid.darkgrey};
  color: ${palette.solid.white};
  padding: 15px;
  border-radius: 5px;
  box-shadow: 0px 4px 10px ${palette.highlight.grey3};
  ${typography.sizeCSS.normal}

  @media only screen and (max-width: ${TWO_PANEL_MAX_WIDTH}px) {
    width: 167px;
    left: -38%;
  }

  @media only screen and (max-width: ${NEW_DESKTOP_WIDTH}px) {
    left: -147px;
  }
`;

export const NotReportedIconTooltipHoverArea = styled.div<{
  size?: number;
}>`
  display: none;
  position: absolute;
  top: 0px;
  left: -1px;
  width: 300px;
  height: 200px;
  padding-top: ${({ size }) => (size ? size + 5 : 27)}px;
  padding-left: ${({ size }) => (size ? size + 5 : 27)}px;

  ${TabItem}:hover & {
    display: block;
  }

  ${InputWrapper}:hover & {
    display: block;
  }

  ${DisaggregationsDropdownToggle}:hover & {
    display: block;
  }
`;

export const MetricsViewLink = styled.span`
  color: ${palette.solid.white};
  text-decoration: underline;

  &:hover {
    cursor: pointer;
  }
`;

export const NotReportedIcon: React.FC<{
  size?: number;
  lighter?: boolean;
  noTooltip?: boolean;
}> = ({ size, lighter, noTooltip }) => {
  const navigate = useNavigate();
  return (
    <NotReportedIconWrapper size={size}>
      <NotReportedIconImg
        src={notReportedIcon}
        alt=""
        size={size}
        lighter={lighter}
        hasTooltip={!noTooltip}
      />
      {!noTooltip && (
        <NotReportedIconTooltipHoverArea size={size}>
          <NotReportedIconTooltip>
            This has been disabled by an admin because the data is unavailable.
            If you have the data for this, consider changing the configuration
            in the{" "}
            <MetricsViewLink onClick={() => navigate("/settings")}>
              Settings
            </MetricsViewLink>
            .
          </NotReportedIconTooltip>
        </NotReportedIconTooltipHoverArea>
      )}
    </NotReportedIconWrapper>
  );
};
