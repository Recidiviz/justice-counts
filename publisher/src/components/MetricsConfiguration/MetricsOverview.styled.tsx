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

import {
  HEADER_BAR_HEIGHT,
  palette,
  typography,
} from "@justice-counts/common/components/GlobalStyles";
import styled from "styled-components/macro";

const OVERVIEW_WRAPPER_WIDTH = 676;

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
`;

export const MetricsOverviewWrapper = styled.div<{
  isSuperagencyNotSuperagencySystem?: boolean;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 48px;
  margin-bottom: 144px;
`;

export const OverviewWrapper = styled.div`
  top: ${HEADER_BAR_HEIGHT + 48}px;
  left: 24px;
  width: 100%;
  max-width: ${OVERVIEW_WRAPPER_WIDTH}px;
  display: flex;
  flex-direction: column;
`;

export const OverviewHeader = styled.div`
  ${typography.sizeCSS.title};
  margin-bottom: 16px;
`;

export const OverviewDescription = styled.div`
  ${typography.body};
  max-width: 470px;
  margin-bottom: 24px;

  a,
  a:visited {
    color: ${palette.solid.blue};
    text-decoration: none;
  }

  a:hover {
    cursor: pointer;
    color: ${palette.solid.darkblue};
  }
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

  &:hover {
    cursor: pointer;
    color: ${({ selected }) =>
      selected ? palette.solid.darkgrey : palette.highlight.grey10};
  }
`;

export const MetricsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const MetricsSection = styled.div`
  display: flex;
  flex-direction: column;
`;

export const MetricsSectionTitle = styled.div<{
  isAlertCaption?: boolean;
  width?: number;
}>`
  ${typography.caption};
  ${({ width }) => width && `width: ${width}%;`};
  color: ${({ isAlertCaption }) =>
    isAlertCaption ? palette.solid.red : palette.solid.darkgrey};
  text-transform: uppercase;
  border-top: 1px solid ${palette.solid.lightgrey4};
  border-bottom: 1px solid ${palette.solid.lightgrey4};
  padding: 8px;
  background: ${palette.solid.lightgrey2};

  ${MetricsSection}:first-child > & {
    margin-top: 16px;
  }
`;

export const MetricItem = styled.div`
  width: 100%;
  padding: 24px 16px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  &:not(:last-child) {
    border-bottom: 1px solid ${palette.solid.lightgrey4};
  }

  ${MetricsSection}:last-child > &:last-child {
    border-bottom: 1px solid ${palette.solid.lightgrey4};
  }

  cursor: pointer;

  svg {
    display: none;
  }

  &:hover svg {
    display: block;
    margin-right: 13px;
  }

  &:hover {
    background-color: ${palette.solid.lightgrey2};
  }
`;

export const MetricItemName = styled.div<{ actionRequired?: boolean }>`
  ${typography.body}
  display: flex;
  flex-direction: column;
  position: relative;

  span {
    margin-top: 4px;
    color: ${palette.highlight.grey8};
    text-transform: capitalize;
  }

  ${({ actionRequired }) =>
    actionRequired &&
    `
      &::after {
        content: "*";
        position: absolute;
        right: -7px;
        color: ${palette.solid.red};
      }
  `}
`;

export const TabbedBarWrapper = styled.div`
  width: ${OVERVIEW_WRAPPER_WIDTH}px;

  div {
    flex-flow: wrap;
    gap: 8px 16px;
  }
`;
