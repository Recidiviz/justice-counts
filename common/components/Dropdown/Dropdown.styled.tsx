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
  Dropdown,
  DropdownMenu,
  DropdownMenuItem,
  DropdownToggle,
} from "@recidiviz/design-system";
// eslint-disable-next-line no-restricted-imports
import styled from "styled-components";

import { palette, typography } from "../GlobalStyles";
import { ToggleHover, ToggleSize } from "./types";

export const CustomDropdown = styled(Dropdown)`
  width: 100%;
  height: 100%;
`;

export const CustomDropdownToggle = styled(DropdownToggle)<{
  hover?: ToggleHover;
  size?: ToggleSize;
}>`
  padding: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: start;
  gap: ${({ size }) => (size === "small" ? "10px" : "12px")};
  color: ${palette.solid.darkgrey};
  white-space: nowrap;
  ${({ size }) =>
    size === "small" ? typography.sizeCSS.normal : typography.sizeCSS.medium};

  &:active,
  &:hover,
  &:focus,
  &[aria-expanded="true"] {
    color: ${palette.solid.darkgrey};
  }

  &:hover {
    cursor: pointer;
    ${({ hover }) => {
      if (hover === "background")
        return `background-color: ${palette.highlight.grey1}`;
      if (hover === "label") return `color: ${palette.solid.blue}`;
    }};
  }
`;

export const CustomDropdownToggleCaret = styled.img<{ size?: ToggleSize }>`
  width: ${({ size }) => (size === "small" ? "10px" : "12px")};
  height: ${({ size }) => (size === "small" ? "5px" : "6px")};
`;

export const CustomDropdownToggleLabel = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  text-transform: capitalize;
`;

export const CustomDropdownMenu = styled(DropdownMenu)<{
  menuFullWidth?: boolean;
}>`
  border-radius: 3px;
  margin-top: 4px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 5;
  transform: unset;
  transition: unset;

  ${({ menuFullWidth }) =>
    menuFullWidth ? "width: 100%;" : "min-width: 293px;"}
`;

export const CustomDropdownMenuItem = styled(DropdownMenuItem)<{
  color?: "green" | "red";
  disabled?: boolean;
  highlight?: boolean;
  noHover?: boolean;
}>`
  margin: 0 !important;
  width: 100%;
  min-width: 100%;
  padding: 16px;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 3px;
  text-transform: capitalize;
  ${typography.sizeCSS.normal};
  color: ${({ color, highlight }) => {
    if (color === "green") {
      return palette.solid.green;
    }
    if (color === "red" || highlight) {
      return palette.solid.red;
    }
    return palette.solid.darkgrey;
  }};

  &:active,
  &:hover,
  &:focus,
  &[aria-expanded="true"] {
    color: ${({ noHover }) => {
      if (!noHover) return palette.solid.blue;
    }};

    background-color: ${palette.solid.white};
  }

  &:focus {
    color: ${({ color, highlight }) => {
      if (color === "green") return palette.solid.green;
      if (color === "red" || highlight) return palette.solid.red;
      return palette.solid.darkgrey;
    }};
  }

  &:hover {
    ${({ noHover }) => {
      if (!noHover)
        return `
        color: ${palette.solid.blue};
        
        svg path {
          fill: ${palette.solid.blue};
          fill-opacity: 1;
        }
      `;
    }};
  }

  &:not(:last-child) {
    border-bottom: 1px solid ${palette.solid.offwhite};
  }

  ${({ disabled }) => disabled && `opacity: 0.5; pointer-events: none;`}
`;

export const OptionLabelWrapper = styled.div<{
  highlightIcon?: boolean;
}>`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: ${({ highlightIcon }) =>
    highlightIcon ? "space-between" : "flex-start"};
  align-items: center;
  gap: 16px;
  color: inherit !important;
  ${({ highlightIcon }) => highlightIcon && "padding-left: 8px;"}
`;
