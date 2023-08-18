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
  HEADER_BAR_HEIGHT,
  palette,
  typography,
} from "@justice-counts/common/components/GlobalStyles";
import styled from "styled-components/macro";

const OVERVIEW_WRAPPER_WIDTH = 470;

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 56px 24px 100px 24px;
`;

export const OverviewWrapper = styled.div`
  position: fixed;
  top: ${HEADER_BAR_HEIGHT + 48}px;
  left: 24px;
  width: ${OVERVIEW_WRAPPER_WIDTH}px;
  display: flex;
  flex-direction: column;
`;

export const OverviewHeader = styled.div`
  ${typography.sizeCSS.headline};
  margin-bottom: 16px;
`;

export const OverviewDescription = styled.div`
  ${typography.sizeCSS.medium};
  margin-bottom: 24px;
  color: ${palette.highlight.grey10};
`;

export const SystemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const SystemMenuItem = styled.div<{ selected: boolean }>`
  ${typography.sizeCSS.large};
  padding: 2px 0;
  color: ${({ selected }) =>
    selected ? palette.solid.darkgrey : palette.highlight.grey8};
  border-bottom: 2px solid
    ${({ selected }) => (selected ? palette.solid.blue : "transparent")};
  width: fit-content;
  max-width: ${OVERVIEW_WRAPPER_WIDTH}px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-transform: capitalize;
  cursor: pointer;

  &:hover {
    color: ${({ selected }) =>
      selected ? palette.solid.darkgrey : palette.highlight.grey10};
  }
`;

export const MetricsWrapper = styled.div`
  width: 100%;
  padding-left: 550px;
  display: flex;
  flex-direction: column;
  gap: 56px;
`;

export const MetricsSection = styled.div`
  display: flex;
  flex-direction: column;
`;

export const MetricsSectionTitle = styled.div<{
  textColor?: string;
  width?: number;
}>`
  ${typography.sizeCSS.medium};
  ${({ width }) => width && `width: ${width}%;`};
  color: ${({ textColor }) => {
    if (textColor === "red") {
      return palette.solid.red;
    }
    if (textColor === "blue") {
      return palette.solid.blue;
    }
    return palette.highlight.grey9;
  }};

  margin-bottom: 12px;
`;

export const MetricItem = styled.div`
  width: 100%;
  padding: 32px 16px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid ${palette.highlight.grey4};
  cursor: pointer;

  svg {
    display: none;
  }

  &:hover svg {
    display: block;
    margin-right: 13px;
  }

  &:hover {
    background-color: ${palette.highlight.grey1};
  }
`;

export const MetricItemName = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  ${typography.sizeCSS.title};
  line-height: 39px;

  span {
    ${typography.sizeCSS.normal};
    color: ${palette.highlight.grey10};
    text-transform: capitalize;
  }
`;
