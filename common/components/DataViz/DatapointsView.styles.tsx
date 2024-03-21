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
  MIN_DESKTOP_WIDTH,
  MIN_TABLET_WIDTH,
  palette,
  typography,
} from "@justice-counts/common/components/GlobalStyles";
import { PANEL_RIGHT_TOP_BUTTONS_CONTAINER_HEIGHT } from "@justice-counts/publisher/src/components/DataViz/MetricsDataChart.styled";
import { Dropdown, DropdownMenuItem } from "@recidiviz/design-system";
import React from "react";
// eslint-disable-next-line no-restricted-imports
import styled from "styled-components";

import { CustomDropdown } from "../Dropdown";

const FOOTER_CONTAINER_HEIGHT = 52;
const DATAPOINTS_VIEW_CONTAINER_TOP_OFFSET =
  HEADER_BAR_HEIGHT + PANEL_RIGHT_TOP_BUTTONS_CONTAINER_HEIGHT;

export const MetricHeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 58px;
  margin-bottom: 9px;
  white-space: nowrap;

  @media only screen and (max-width: ${MIN_DESKTOP_WIDTH}px) {
    height: auto;
  }
`;

export const ExtendedDropdownMenuItem = styled(DropdownMenuItem)<{
  highlight?: boolean;
  noPadding?: boolean;
}>`
  min-width: 264px;
  display: flex;
  align-items: center;
  font-family: ${typography.family};
  ${typography.sizeCSS.normal}
  color: ${({ highlight }) =>
    highlight ? palette.solid.red : palette.solid.darkgrey};
  height: auto;
  padding: 0;
  gap: 8px;

  ${({ noPadding }) =>
    !noPadding &&
    `  
      padding: 16px;
      
      &:first-child {
        padding: 10px 16px 16px 16px;
      }
      
      &:last-child {
        padding: 16px 16px 10px 16px;
      }
    `}
  &:not(:last-child) {
    border-bottom: 1px solid ${palette.solid.offwhite};
  }

  &:focus {
    background-color: transparent;
    color: ${({ highlight }) =>
      highlight ? palette.solid.red : palette.solid.darkgrey};
  }

  &:hover {
    color: ${palette.solid.blue};
    background-color: transparent;

    svg path {
      stroke: ${palette.solid.blue};
    }
  }
`;

export const DatapointsViewContainer = styled.div<{
  maxHeightViewport?: boolean;
}>`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  position: sticky;
  top: ${DATAPOINTS_VIEW_CONTAINER_TOP_OFFSET}px;
  ${({ maxHeightViewport }) =>
    maxHeightViewport &&
    `max-height: calc(100vh - ${
      DATAPOINTS_VIEW_CONTAINER_TOP_OFFSET + FOOTER_CONTAINER_HEIGHT
    }px)`}
`;

export const DatapointsViewHeaderWrapper = styled.div`
  background-color: ${palette.solid.white};
  z-index: 2;

  @media only screen and (max-width: ${MIN_DESKTOP_WIDTH}px) {
    position: static;
    z-index: 1;
  }
`;

export const DatapointsViewControlsContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 42px;
  border: 1px solid ${palette.highlight.grey9};

  & ${CustomDropdown} {
    border-right: 1px solid ${palette.highlight.grey9};
    padding: 0 8px;

    &:last-child {
      border-right: none;
    }
  }
`;

export const MetricInsightsContainer = styled.div<{
  selfWidth: number;
  enableHideByWidth: boolean;
}>`
  display: flex;
  visibility: visible;
  flex-direction: row;

  ${({ selfWidth, enableHideByWidth }) =>
    enableHideByWidth &&
    `@media only screen and (max-width: calc(1148px + ${selfWidth}px)) {
    visibility: hidden;
    position: absolute;
    z-index: -1;
  }`};
  @media only screen and(max-width: ${MIN_TABLET_WIDTH}px) {
    flex-direction: column;
  }
`;

const MetricInsightContainer = styled.div`
  margin-right: 32px;

  &:last-child {
    margin-right: 0;
  }

  @media only screen and (max-width: ${MIN_DESKTOP_WIDTH - 1}px) {
    text-align: left;
    margin-bottom: 16px;

    &:last-child {
      text-align: left;
      margin-left: 0;
    }
  }
`;

const MetricInsightTitle = styled.div`
  ${typography.sizeCSS.normal}
`;

const MetricInsightValue = styled.div`
  ${typography.sizeCSS.title}
  line-height: 32px;
  margin-bottom: 4px;
`;

interface MetricInsightProps {
  title: string;
  value: string;
}

export const MetricInsight: React.FC<MetricInsightProps> = ({
  title,
  value,
}) => (
  <MetricInsightContainer>
    <MetricInsightValue>{value}</MetricInsightValue>
    <MetricInsightTitle>{title}</MetricInsightTitle>
  </MetricInsightContainer>
);

export const BottomMetricInsightsContainer = styled.div`
  margin: 24px 0;
`;

export const DatapointsViewControlsRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  margin-top: 32px;

  @media only screen and (max-width: ${MIN_DESKTOP_WIDTH}px) {
    display: none;
  }
`;

export const MobileFiltersRow = styled.div`
  display: none;

  @media only screen and (max-width: ${MIN_DESKTOP_WIDTH}px) {
    display: flex;
    border-top: 1px solid ${palette.highlight.grey9};
    padding-top: 8px;
  }
`;

export const MobileFiltersButton = styled.div`
  ${typography.sizeCSS.small}
  padding: 4px 10px;
  border: 1px solid ${palette.highlight.grey4};
  border-radius: 24px;

  &::after {
    content: "▾ Filters";
  }

  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`;

export const SelectMetricsButtonContainer = styled.div`
  height: 40px;
  padding-left: 16px;
  padding-right: 16px;
  display: flex;
  align-items: center;
  border-radius: 2px;
  background: ${palette.solid.blue};
  gap: 8px;
  color: ${palette.solid.white};

  &:hover {
    cursor: pointer;
    background: ${palette.solid.darkblue};
  }
`;

export const SelectMetricsButtonText = styled.div`
  ${typography.sizeCSS.normal}
  font-weight: 400;

  &::after {
    content: "Select Metric";
  }
`;

export const ExtendedDropdown = styled(Dropdown)`
  & > button {
    margin-top: 8px;
    margin-bottom: 8px;
    transition-duration: 0ms;
    background: none;
    padding: 0;
    border: none;
  }

  &:hover > button {
    background: none;
  }
`;
