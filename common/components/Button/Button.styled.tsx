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
  palette,
  typography,
} from "@justice-counts/common/components/GlobalStyles";
// eslint-disable-next-line no-restricted-imports
import styled from "styled-components";

import {
  ButtonBorderColor,
  ButtonColor,
  ButtonLabelColor,
  ButtonSize,
} from "./types";

export const Button = styled.div<{
  buttonColor?: ButtonColor;
  labelColor?: ButtonLabelColor;
  borderColor?: ButtonBorderColor;
  size?: ButtonSize;
  disabled?: boolean;
  noSidePadding?: boolean;
  noTopBottomPadding?: boolean;
  noHover?: boolean;
  agencySettingsConfigs?: boolean;
}>`
  ${({ size }) => (size ? typography.sizeCSS[size] : typography.body)};
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 3px;
  gap: 8px;
  white-space: nowrap;
  min-width: ${({ agencySettingsConfigs }) =>
    agencySettingsConfigs ? "unset" : "80px"};
  pointer-events: ${({ disabled }) => disabled && "none"};
  background-color: ${({ buttonColor, disabled }) => {
    if (disabled) return palette.highlight.grey3;
    return buttonColor ? palette.solid[buttonColor] : "transparent";
  }};
  color: ${({ labelColor, buttonColor }) => {
    if (labelColor) return palette.solid[labelColor];
    if (buttonColor) return palette.solid.white;
    return palette.solid.darkgrey;
  }};
  border: ${({ borderColor }) => {
    if (borderColor === "white") {
      return `1px solid ${palette.solid.white}`;
    }
    if (borderColor === "lightgrey") {
      return `1px solid ${palette.highlight.grey4}`;
    }
    return "none";
  }};

  padding: ${({ size, agencySettingsConfigs }) => {
    if (agencySettingsConfigs) {
      return "0";
    }
    if (size) {
      return "16px 32px";
    }
    return "10px 15px";
  }};

  ${({ noSidePadding }) =>
    noSidePadding && "padding-left: 0; padding-right: 0;"}
  ${({ noTopBottomPadding }) =>
    noTopBottomPadding && "padding-top: 0; padding-bottom: 0;"}
  
  &:hover {
    cursor: pointer;
    ${({ labelColor }) => {
      if (labelColor === "blue") {
        return `color: ${palette.solid.darkblue}`;
      }
    }};
    ${({ buttonColor, noHover, agencySettingsConfigs }) => {
      if (buttonColor) return "opacity: 0.8;";
      if (agencySettingsConfigs) return "opacity: unset";
      return !noHover && `background-color: ${palette.solid.lightgrey2};`;
    }}
    a {
      ${typography.sizeCSS.small};
      width: fit-content;
      text-decoration: none;
      color: ${palette.solid.blue};
      display: flex;
      align-items: center;
    }
  }
`;

export const ButtonWrapper = styled.div`
  position: relative;

  ${Button} {
    height: 100%;
  }
`;
