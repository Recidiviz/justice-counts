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

import styled from "styled-components/macro";

import { CustomDropdownToggle } from "../Dropdown";
import { MIN_DESKTOP_WIDTH, palette, typography } from "../GlobalStyles";
import { Tab } from "../TabbedBar";
import { InputWrapper } from "./Input.styled";

const DATA_ENTRY_PAGE_TWO_PANEL_MAX_WIDTH = 644 + 360 * 2;

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

  ${Tab}:hover & {
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
  box-shadow: 0 4px 10px ${palette.highlight.grey3};
  ${typography.sizeCSS.normal};
  white-space: normal;
  text-align: start;

  @media only screen and (max-width: ${DATA_ENTRY_PAGE_TWO_PANEL_MAX_WIDTH}px) {
    width: 167px;
    left: -38%;
  }

  @media only screen and (max-width: ${MIN_DESKTOP_WIDTH}px) {
    left: -147px;
  }
`;

export const NotReportedIconTooltipHoverArea = styled.div<{
  size?: number;
}>`
  display: none;
  position: absolute;
  top: 0;
  left: -1px;
  width: 300px;
  height: 200px;
  padding-top: ${({ size }) => (size ? size + 5 : 27)}px;
  padding-left: ${({ size }) => (size ? size + 5 : 27)}px;

  ${Tab}:hover & {
    display: block;
  }

  ${InputWrapper}:hover & {
    display: block;
  }

  ${CustomDropdownToggle}:hover & {
    display: block;
  }
`;

export const TooltipLink = styled.span`
  color: ${palette.solid.white};
  text-decoration: underline;

  &:hover {
    cursor: pointer;
  }
`;
