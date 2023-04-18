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

import {
  MAIN_PANEL_MAX_WIDTH,
  SectionTitle,
} from "../ReviewMetrics/ReviewMetrics.styles";

const CONTAINER_HORIZONTAL_PADDING = 24;

export const MetricCollapseSignWrapper = styled.div<{ isExpanded: boolean }>`
  width: 16px;
  height: 16px;
  position: relative;
  margin-left: 10px;
  display: ${({ isExpanded }) => (isExpanded ? "none" : "block")};

  &:hover {
    display: block;
  }
`;

export const Metric = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  justify-content: space-between;

  padding-top: 72px;
  margin-top: -24px;

  &:last-child {
    padding-bottom: ${HEADER_BAR_HEIGHT + 128}px;
  }

  &:hover ${MetricCollapseSignWrapper}:not(:hover) {
    display: block;
  }
`;

export const MetricTitle = styled(SectionTitle)`
  &:hover {
    cursor: pointer;
  }
`;

export const MetricValue = styled.div`
  ${typography.sizeCSS.title}
`;

export const Breakdown = styled.div<{ missing?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  font-size: 18px;
  line-height: 18px;
  font-weight: 500;
`;

export const DisaggregationBreakdown = styled(Breakdown)<{ error?: boolean }>`
  color: ${({ error }) => (error ? palette.solid.red : palette.solid.darkgrey)};
`;

export const BreakdownLabel = styled.div`
  display: flex;
  flex: 1;
`;

export const BreakdownValue = styled.div<{
  missing?: boolean;
  error?: boolean;
}>`
  display: flex;
  flex: 1;
  justify-content: flex-end;
  font-style: ${({ missing }) => missing && "italic"};
  color: ${({ error }) => (error ? palette.solid.red : palette.solid.darkgrey)};
`;

export const ContextContainer = styled(Breakdown)<{ verticalOnly?: boolean }>`
  flex-direction: ${({ verticalOnly }) => (verticalOnly ? "column" : "row")};

  @media only screen and (max-width: ${MAIN_PANEL_MAX_WIDTH +
    CONTAINER_HORIZONTAL_PADDING * 2}px) {
    flex-direction: column;
  }
`;

export const ContextValue = styled(BreakdownValue)`
  justify-content: flex-start;
`;

export const ErrorImg = styled.img`
  margin-left: 4px;
  width: 16px;
  height: 16px;
`;

export const EmptyIcon = styled.div`
  width: 16px;
  height: 16px;
  border: 1px solid ${palette.highlight.grey4};
  border-radius: 100%;
`;
