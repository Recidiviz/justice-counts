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

import styled from "styled-components/macro";

import { palette, typography } from "../GlobalStyles";
import { MetricDisplayName } from "../Reports/ReportSummaryPanel";

export const SettingsContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-start;
  padding: 39px 24px 0 24px;
  position: fixed;
  overflow-y: scroll;
`;

export const ContentDisplay = styled.div`
  max-height: 90%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  flex: 10 10 auto;
  overflow-y: scroll;
`;

export const SettingsMenuContainer = styled.div`
  ${typography.sizeCSS.headline}
  width: fit-content;
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  gap: 16px;
  padding: 16px 24px;
  margin-right: 100px;
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

export const MetricsListContainer = styled.div``;

export const MetricsListItem = styled(MetricDisplayName)`
  ${typography.sizeCSS.normal}
  width: fit-content;
  color: ${({ activeSection }) =>
    activeSection ? palette.solid.darkgrey : palette.highlight.grey8};

  &:hover {
    cursor: pointer;
    color: ${palette.solid.darkgrey};
  }
`;
