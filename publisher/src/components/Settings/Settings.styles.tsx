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
import styled from "styled-components/macro";

export const SettingsContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  padding: 48px 24px 0 24px;
  position: relative;
`;

export const ContentDisplay = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  flex: 10 10 auto;
  overflow-x: scroll;
  margin-left: 310px;
`;

export const SettingsMenuContainer = styled.div`
  ${typography.sizeCSS.headline}
  width: 240px;
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  gap: 16px;
  margin-right: 70px;
  z-index: 2;
  position: fixed;
`;

export const MenuItem = styled.div<{ selected?: boolean }>`
  ${typography.sizeCSS.large}
  width: fit-content;
  padding-bottom: 4px;
  color: ${({ selected }) =>
    selected ? palette.solid.darkgrey : palette.highlight.grey10};
  border-bottom: 2px solid
    ${({ selected }) => (selected ? palette.solid.blue : `transparent`)};
  transition: color 0.2s ease;

  &:hover {
    cursor: pointer;
    color: ${({ selected }) => !selected && palette.solid.darkgrey};
  }
`;

export const SettingsFormPanel = styled.div``;

export const InputWrapper = styled.div`
  display: flex;
  gap: 10px;

  div {
    width: 100%;
  }
`;

export const SubMenuListContainer = styled.div``;

export const SubMenuListItem = styled.div<{ activeSection?: boolean }>`
  ${typography.sizeCSS.normal}
  width: fit-content;
  color: ${({ activeSection }) =>
    activeSection ? palette.solid.darkgrey : palette.highlight.grey8};
  max-width: 238px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border-bottom: 2px solid
    ${({ activeSection }) =>
      activeSection ? palette.solid.blue : `transparent`};

  &:hover {
    cursor: pointer;
    color: ${palette.solid.darkgrey};
  }
`;
