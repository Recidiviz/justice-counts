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
  FOOTER_HEIGHT_WITH_MARGIN,
  HEADER_BAR_HEIGHT,
  MIN_DESKTOP_WIDTH,
  MIN_TABLET_WIDTH,
  palette,
  PANEL_RIGHT_TOP_BUTTONS_CONTAINER_HEIGHT,
  typography,
} from "@justice-counts/common/components/GlobalStyles";
// eslint-disable-next-line import/no-extraneous-dependencies
import { DropdownContainer } from "@justice-counts/publisher/src/components/Reports/CreateReport.styled";
import { Dropdown, DropdownMenuItem } from "@recidiviz/design-system";
import React from "react";
// eslint-disable-next-line no-restricted-imports
import styled from "styled-components";

import { CustomDropdown, CustomDropdownToggle } from "../Dropdown";

const DATAPOINTS_VIEW_CONTAINER_TOP_OFFSET =
  HEADER_BAR_HEIGHT + PANEL_RIGHT_TOP_BUTTONS_CONTAINER_HEIGHT + 1;

export const MetricHeaderWrapper = styled.div<{ isColumn?: boolean }>`
  display: flex;
  flex-direction: ${({ isColumn }) => (isColumn ? "column" : "row")};
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 16px;
  padding-top: 24px;
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
      DATAPOINTS_VIEW_CONTAINER_TOP_OFFSET + FOOTER_HEIGHT_WITH_MARGIN
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

export const DatapointsViewControlsContainer = styled(DropdownContainer)`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;

  & ${CustomDropdown} {
    max-width: 300px;
  }
  & ${CustomDropdownToggle} {
    height: 32px;
  }
`;

export const MetricInsightsContainer = styled.div<{
  selfWidth: number;
  enableHideByWidth: boolean;
}>`
  display: flex;
  visibility: visible;
  flex-direction: row;

  @media only screen and(max-width: ${MIN_TABLET_WIDTH}px) {
    flex-direction: column;
  }
`;

const MetricInsightContainer = styled.div`
  margin-right: 32px;

  &:last-child {
    margin-right: 0;
  }
`;

const MetricInsightTitle = styled.div`
  ${typography.sizeCSS.normal}
`;

const MetricInsightValue = styled.div`
  ${typography.sizeCSS.large}
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

export const DatapointsViewControlsRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  padding: 24px 0;

  @media only screen and (max-width: ${MIN_DESKTOP_WIDTH}px) {
    display: none;
  }
`;

export const MobileFiltersRow = styled.div`
  display: none;

  @media only screen and (max-width: ${MIN_DESKTOP_WIDTH}px) {
    display: flex;
    padding: 16px 0;
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

export const ChartNote = styled.div`
  ${typography.sizeCSS.small}
  font-weight: 500;
  padding: 16px 36px 32px;
  margin: 0 -36px;
  border-top: 1px solid ${palette.solid.lightgrey4};

  @media only screen and (max-width: ${MIN_DESKTOP_WIDTH}px) {
    margin: 0 -24px;
    padding: 16px 24px;
  }
`;
