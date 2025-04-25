// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2024 Recidiviz, Inc.
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
// eslint-disable-next-line no-restricted-imports
import styled from "styled-components";

import { palette, typography } from "../GlobalStyles";
import { TabbedBarSize } from "./types";

export const Wrapper = styled.div<{ scrollable?: boolean }>`
  width: 100%;
  position: relative;
`;

export const TabsContainer = styled.div<{ scrollable?: boolean }>`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  border-bottom: 1px solid ${palette.solid.lightgrey4};

  ${({ scrollable }) =>
    scrollable &&
    `overflow-x: auto;
    white-space: nowrap;`}
`;

export const Tab = styled.div<{
  selected: boolean;
  enabled?: boolean;
  size?: TabbedBarSize;
}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  color: ${({ selected }) =>
    selected ? palette.solid.blue : palette.highlight.grey8};
  border-bottom: 2px solid
    ${({ selected }) => (selected ? palette.solid.blue : `transparent`)};
  text-transform: capitalize;
  margin-bottom: -1px;
  padding: 10px 0;

  ${({ size }) => {
    if (size === "medium")
      return `${typography.sizeCSS.medium}; font-weight: 400; font-size: 16px;`;
    if (size === "large") return `padding: 16px 0;${typography.sizeCSS.large};`;
    return `${typography.bodyEmphasized};`;
  }}

  &:hover {
    cursor: ${({ enabled }) => (enabled === false ? `default` : `pointer`)};
    color: ${({ enabled, selected }) => {
      if (enabled !== undefined && !selected)
        return enabled ? palette.solid.blue : palette.highlight.grey8;
      return palette.solid.blue;
    }};
  }
`;

export const LeftGradient = styled.div<{
  isShowing: boolean;
}>`
  background: linear-gradient(
    0.25turn,
    rgb(255, 255, 255, 1),
    rgb(255, 255, 255, 0)
  );
  width: 42px;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  opacity: ${({ isShowing }) => (isShowing ? 1 : 0)};
  transition: opacity 300ms;
`;

export const RightGradient = styled.div<{
  isShowing: boolean;
}>`
  background: linear-gradient(
    0.25turn,
    rgb(255, 255, 255, 0),
    rgb(255, 255, 255, 1)
  );
  width: 42px;
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  opacity: ${({ isShowing }) => (isShowing ? 1 : 0)};
  transition: opacity 300ms;
`;
