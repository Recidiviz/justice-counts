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
import styled from "styled-components/macro";

import { palette, typography } from "../GlobalStyles";
import { DropdownBorder, ToggleHover, ToggleSize } from "./types";

export const CustomDropdown = styled(Dropdown)<{
  border?: DropdownBorder;
}>`
  width: 100%;
  height: 100%;

  ${({ border }) => {
    if (border === "lightgrey-round")
      return `border: 1px solid ${palette.highlight.grey4}; border-radius: 3px;`;
    if (border === "top")
      return `border-top: 1px solid ${palette.solid.darkgrey};`;
    return "border: none";
  }};
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
  gap: 12px;
  color: ${palette.solid.darkgrey};
  white-space: nowrap;
  ${({ size }) =>
    size === "medium" ? typography.sizeCSS.medium : typography.sizeCSS.normal};

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
  width: ${({ size }) => (size === "medium" ? "12px" : "10px")};
  height: ${({ size }) => (size === "medium" ? "6px" : "5px")};
`;

export const CustomDropdownMenu = styled(DropdownMenu)<{
  menuOverflow?: boolean;
  menuFullWidth?: boolean;
}>`
  border-radius: 3px;
  margin-top: 0;
  max-height: 50vh;
  overflow-y: auto;
  z-index: 5;

  ${({ menuOverflow }) => menuOverflow && "top: 0"}
  ${({ menuFullWidth }) => menuFullWidth && "width: 100%"}
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
  border-radius: 3px;
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
    color: ${({ noHover }) => {
      if (!noHover) return palette.solid.blue;
    }};
  }

  &:not(:last-child) {
    border-bottom: 1px solid ${palette.solid.offwhite};
  }

  ${({ disabled }) => disabled && `opacity: 0.5; pointer-events: none;`}
`;
