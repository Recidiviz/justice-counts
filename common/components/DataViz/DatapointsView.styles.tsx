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
  palette,
  TABLET_WIDTH,
  typography,
} from "@justice-counts/common/components/GlobalStyles";
import {
  Dropdown,
  DropdownMenu,
  DropdownMenuItem,
  DropdownToggle,
} from "@recidiviz/design-system";
import React from "react";
import styled from "styled-components/macro";

export const MetricHeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 58px;
  margin-bottom: 9px;
  white-space: nowrap;
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

export const DatapointsViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

export const DatapointsViewHeaderWrapper = styled.div`
  position: sticky;
  top: 50px;
  background-color: ${palette.solid.white};
  z-index: 2;
`;

export const DatapointsViewControlsContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  border: 1px solid ${palette.highlight.grey9};
`;

const DatapointsViewDropdown = styled(Dropdown)`
  display: flex;
  flex-grow: 1;
  flex-basis: 0;
  min-width: 0;
  border-left: 1px solid ${palette.highlight.grey9};

  & > button {
    transition-duration: 0ms;
    border-width: 0;
  }

  &:first-child {
    border-left: none;
  }
`;

const DatapointsViewDropdownToggleContainer = styled(DropdownToggle)`
  font-family: ${typography.family};
  padding: 0;
  min-height: unset;
  line-height: 0;
  position: relative;
  flex-grow: 1;
  flex-basis: 0;
  color: ${palette.solid.darkgrey};
  text-align: start;

  &:hover {
    color: ${palette.solid.darkgrey};
  }

  &[aria-expanded="true"] {
    color: ${palette.solid.darkgrey};
  }
`;
const DatapointsViewDropdownToggleSelection = styled.div`
  height: 40px;
  padding-top: 7px;
  padding-left: 22px;
  width: 100%;
  ${typography.sizeCSS.normal}
  color: ${palette.solid.darkgrey};
  line-height: 1.6rem;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;

  &:hover {
    cursor: pointer;
    background-color: ${palette.highlight.lightblue1};
    color: ${palette.solid.blue};
  }
`;
const DatapointsViewDropdownToggleTitle = styled.div`
  position: absolute;
  ${typography.sizeCSS.small}
  pointer-events: none;
  top: -20px;
  left: 0;
`;

const DatapointsViewDropdownToggleArrow = styled.div`
  top: 2px;
  left: -7px;
  position: absolute;
  font-size: 6px;
  transform: rotate(45deg);
  padding: 16px;
  pointer-events: none;

  &::after {
    content: "◢";
  }
`;

interface DatapointsViewControlsDropdownMenuProps {
  title: string;
  selectedValue: string;
}

const DatapointsViewControlsDropdownMenu: React.FC<
  DatapointsViewControlsDropdownMenuProps
> = ({ title, selectedValue }) => (
  <DatapointsViewDropdownToggleContainer kind="borderless">
    <DatapointsViewDropdownToggleTitle>
      {title}
    </DatapointsViewDropdownToggleTitle>
    <DatapointsViewDropdownToggleSelection>
      {selectedValue}
    </DatapointsViewDropdownToggleSelection>
    <DatapointsViewDropdownToggleArrow />
  </DatapointsViewDropdownToggleContainer>
);

interface DatapointsViewControlsDropdownProps {
  title: string;
  selectedValue: string;
  onSelect: (value: string) => void;
  options: string[];
}

export const DatapointsViewControlsDropdown: React.FC<
  DatapointsViewControlsDropdownProps
> = ({ title, selectedValue, onSelect, options }) => (
  <DatapointsViewDropdown>
    <DatapointsViewControlsDropdownMenu
      title={title}
      selectedValue={selectedValue}
    />
    <DropdownMenu>
      {options.map((value) => (
        <ExtendedDropdownMenuItem
          key={value}
          onClick={() => {
            onSelect(value);
          }}
          highlight={selectedValue === value}
        >
          {value}
        </ExtendedDropdownMenuItem>
      ))}
    </DropdownMenu>
  </DatapointsViewDropdown>
);

export const MetricInsightsContainer = styled.div<{ selfWidth: number }>`
  display: flex;
  visibility: visible;
  flex-direction: row;
  justify-content: flex-end;

  ${({
    selfWidth,
  }) => `@media only screen and (max-width: calc(1148px + ${selfWidth}px)) {
    visibility: hidden;
    position: absolute;
    z-index: -1;
  }`}
`;

const MetricInsightContainer = styled.div`
  margin-right: 32px;

  &:last-child {
    margin-right: 0;
  }

  @media only screen and (max-width: ${TABLET_WIDTH - 1}px) {
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
  gap: 24px;
  margin-top: 32px;

  @media only screen and (max-width: ${TABLET_WIDTH - 1}px) {
    display: none;
  }
`;

export const MobileFiltersRow = styled.div`
  display: none;

  @media only screen and (max-width: ${TABLET_WIDTH - 1}px) {
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

export const MobileSelectMetricsButtonContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  path {
    fill: ${palette.solid.darkgrey};
  }
  position: fixed;
  bottom: 24px;
  justify-content: center;
  left: 0;
  right: 0;
  pointer-events: none;

  @media only screen and (min-width: ${TABLET_WIDTH}px) {
    display: none;
  }
`;

export const MobileSelectMetricsButton = styled.div`
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 10px;
  border: 1px solid ${palette.highlight.grey4};
  border-radius: 24px;
  background: ${palette.solid.white};

  &:hover {
    cursor: pointer;
    opacity: 0.8;
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

export const MobileSelectMetricsModalContainer = styled.div`
  z-index: 3;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: ${palette.solid.blue};
  color: ${palette.solid.white};
  overflow-y: auto;
`;
