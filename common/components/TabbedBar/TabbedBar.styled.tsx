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
// eslint-disable-next-line no-restricted-imports
import styled from "styled-components";

import { palette, typography } from "../GlobalStyles";
import { TabbedBarSize } from "./types";

export const TabsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
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
    selected ? palette.solid.blue : palette.highlight.grey7};
  border-bottom: 3px solid
    ${({ selected }) => (selected ? palette.solid.blue : `transparent`)};
  text-transform: capitalize;

  ${({ size }) => {
    if (size === "medium")
      return `padding: 16px 0; ${typography.sizeCSS.medium}; font-weight: 400;`;
    if (size === "large")
      return `padding: 16px 0; ${typography.sizeCSS.large}; font-weight: 400;`;
    return `padding: 8px 0; ${typography.sizeCSS.normal};`;
  }}
  &:hover {
    cursor: pointer;
    color: ${({ enabled, selected }) => {
      if (enabled !== undefined && !selected)
        return enabled ? palette.solid.blue : palette.solid.darkgrey;
      return palette.solid.blue;
    }};
  }
`;
