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

import {
  HEADER_BAR_HEIGHT,
  palette,
  typography,
} from "@justice-counts/common/components/GlobalStyles";
import styled, { css } from "styled-components/macro";

import { Button } from "../DataUpload";
import {
  MAIN_PANEL_MAX_WIDTH,
  MainPanel,
  SectionTitle,
  SectionTitleNumber,
} from "../ReviewMetrics/ReviewMetrics.styles";
import { CONFIRMATION_DIALOGUE_SIDE_PANEL_WIDTH } from "./ReportDataEntry.styles";

const CONTAINER_HORIZONTAL_PADDING = 24;
const MAIN_PANEL_AND_TWO_SIDE_PANELS_MIN_WIDTH =
  CONFIRMATION_DIALOGUE_SIDE_PANEL_WIDTH * 2 + MAIN_PANEL_MAX_WIDTH;
const MAIN_PANEL_AND_ONE_SIDE_PANEL_MIN_WIDTH =
  CONFIRMATION_DIALOGUE_SIDE_PANEL_WIDTH +
  MAIN_PANEL_MAX_WIDTH +
  CONTAINER_HORIZONTAL_PADDING * 2;

export const ConfirmationButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
`;

export const PublishConfirmButton = styled(Button)<{ disabled: boolean }>`
  padding-right: 22px;
  padding-left: 22px;
  background-color: ${({ disabled }) =>
    disabled ? palette.highlight.grey5 : palette.solid.green};
  color: ${palette.solid.white};

  &:hover {
    cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
    opacity: ${({ disabled }) => (disabled ? 1 : 0.9)};
    background-color: ${({ disabled }) =>
      disabled ? palette.highlight.grey5 : palette.solid.green};
  }

  &::after {
    content: "Publish";
  }
`;

export const ConfirmationDialogueTopBarButton = styled(Button)`
  white-space: nowrap;
`;

export const ConfirmationDialogueWrapper = styled.div`
  background: ${palette.solid.white};
  display: flex;
  justify-content: center;
  position: fixed;
  top: ${HEADER_BAR_HEIGHT}px;
  overflow: scroll;
  height: 100vh;
  width: 100%;
  padding-left: ${CONFIRMATION_DIALOGUE_SIDE_PANEL_WIDTH}px;
  padding-right: ${CONFIRMATION_DIALOGUE_SIDE_PANEL_WIDTH}px;

  @media only screen and (max-width: ${MAIN_PANEL_AND_TWO_SIDE_PANELS_MIN_WIDTH}px) {
    padding-right: ${CONTAINER_HORIZONTAL_PADDING}px;
    justify-content: start;
  }

  @media only screen and (max-width: ${MAIN_PANEL_AND_ONE_SIDE_PANEL_MIN_WIDTH}px) {
    padding-left: ${CONTAINER_HORIZONTAL_PADDING}px;
    justify-content: center;
  }
`;

export const MetricsPreviewWrapper = styled(MainPanel)`
  margin-top: 56px;
`;

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

export const HorizontalLine = styled.div`
  width: 100%;
  position: absolute;
  top: 7px;
  border: 1px solid ${palette.solid.darkgrey};
  border-radius: 2px;
`;

export const VerticalLine = styled.div`
  height: 100%;
  position: absolute;
  left: 7px;
  border: 1px solid ${palette.solid.darkgrey};
  border-radius: 2px;
`;

export const Metric = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  justify-content: space-between;
  border-top: 1px solid ${palette.highlight.grey3};
  padding-top: 16px;
  margin-top: 32px;

  &:last-child {
    padding-bottom: ${HEADER_BAR_HEIGHT + 128}px;
  }

  &:hover ${MetricCollapseSignWrapper}:not(:hover) {
    display: block;
  }
`;

export const MetricHeader = styled.div<{ hasValue: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  color: ${({ hasValue }) =>
    hasValue ? palette.solid.darkgrey : palette.highlight.grey8};

  &:hover {
    cursor: pointer;
  }
`;

export const MetricTitleWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const MetricTitle = styled(SectionTitle)`
  &:hover {
    cursor: pointer;
  }
`;

export const MetricTitleNumber = styled(SectionTitleNumber)<{
  hasError: boolean;
}>`
  background-color: ${({ hasError }) =>
    hasError ? palette.solid.red : palette.solid.blue};
`;

export const MetricValue = styled.div`
  ${typography.sizeCSS.title}
`;

export const MetricDetailWrapper = styled.div<{ isExpanded: boolean }>`
  flex: 0 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: stretch;

  @media only screen and (max-width: ${MAIN_PANEL_MAX_WIDTH +
    CONTAINER_HORIZONTAL_PADDING * 2}px) {
    flex: 0 1 auto;
  }

  display: ${({ isExpanded }) => (isExpanded ? "block" : "none")};
`;

export const MetricSubTitleContainer = styled.div<{ secondary?: boolean }>`
  ${typography.sizeCSS.small}
  margin-bottom: 16px;
  margin-top: 16px;
  ${({ secondary }) =>
    secondary &&
    css`
      color: ${palette.highlight.grey7};
      margin-bottom: 8px;
    `}
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

export const DisaggregationBreakdownContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  &:hover ${DisaggregationBreakdown}:not(:hover) {
    opacity: 0.5;
  }
`;

export const BreakdownLabelContainer = styled.div`
  display: flex;
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

export const BreakdownErrorImg = styled(ErrorImg)`
  transform: translate(0, 2px);
`;

export const ContextErrorImg = styled(ErrorImg)`
  width: 12px;
  height: 12px;
  transform: translate(0, 1px);
`;
