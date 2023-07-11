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
  enabledDuringOnboarding?: boolean;
  disabled?: boolean;
  noSidePadding?: boolean;
  noTopBottomPadding?: boolean;
  noHover?: boolean;
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 3px;
  gap: 8px;
  white-space: nowrap;
  min-width: 80px;

  pointer-events: ${({ disabled }) => disabled && "none"};
  opacity: ${({ disabled }) => disabled && "0.2"};

  ${({ buttonColor }) => {
    if (buttonColor === "blue")
      return `
        background-color: ${palette.solid.blue};
      `;
    if (buttonColor === "green")
      return `
        background-color: ${palette.solid.green};
      `;
    if (buttonColor === "red")
      return `
        background-color: ${palette.solid.red};
      `;
    if (buttonColor === "orange")
      return `
        background-color: ${palette.solid.orange};
      `;
    return "background-color: transparent";
  }};

  ${({ labelColor, buttonColor, enabledDuringOnboarding }) => {
    if (labelColor === "blue")
      return `
        color: ${palette.solid.blue};
      `;
    if (labelColor === "red")
      return `
        color: ${palette.solid.red};
      `;
    // maybe remove button color later if there would be colored buttons without white label
    // current designs require only white color for label inside colored buttons
    if (labelColor === "white" || buttonColor)
      return `
        color: ${palette.solid.white};
      `;
    if (enabledDuringOnboarding === false)
      return `color: ${palette.highlight.grey8}`;
    return `color: ${palette.solid.darkgrey}`;
  }};

  ${({ borderColor }) => {
    if (borderColor === "white")
      return `border: 1px solid ${palette.solid.white}`;
    if (borderColor === "lightgrey")
      return `border: 1px solid ${palette.highlight.grey4}`;
    return "border: none";
  }};

  ${({ size }) =>
    size ? typography.sizeCSS[size] : typography.sizeCSS.normal};
  ${({ size }) => {
    if (size === "medium") return "padding: 16px 32px";
    return "padding: 10px 15px";
  }};

  ${({ noSidePadding }) =>
    noSidePadding && "padding-left: 0; padding-right: 0;"}
  ${({ noTopBottomPadding }) =>
    noTopBottomPadding && "padding-top: 0; padding-bottom: 0;"}
  
  &:hover {
    cursor: pointer;

    ${({ buttonColor, enabledDuringOnboarding, noHover }) => {
      if (enabledDuringOnboarding === false)
        return "background-color: transparent";
      if (buttonColor) return "opacity: 0.8;";
      return !noHover && `background-color: ${palette.highlight.grey1};`;
    }}
    a {
      ${typography.sizeCSS.small};
      width: fit-content;
      text-decoration: none;
      color: ${palette.solid.blue};
      display: flex;
      align-items: center;
    }
`;

export const ButtonWrapper = styled.div`
  position: relative;

  ${Button} {
    height: 100%;
  }
`;
