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
  margin-bottom: 9px;
`;

export const MetricTitleWrapper = styled.div`
  display: flex;
  gap: 18px;
  align-items: center;
`;

export const MetricTitle = styled.div`
  ${typography.sizeCSS.title}
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
  padding: 0 15px 0 15px;
`;

export const DatapointsViewControlsContainer = styled.div`
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid ${palette.highlight.grey9};
  border-top: 1px solid ${palette.highlight.grey9};
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
    color: ${palette.solid.blue};
  }
`;
const DatapointsViewDropdownToggleSelection = styled.div`
  height: 64px;
  padding: 32px 32px 0px 8px;
  width: 100%;
  ${typography.sizeCSS.large}
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
  padding: 8px 8px 0;
  position: absolute;
  ${typography.sizeCSS.small}
  pointer-events: none;
  top: 0;
  left: 0;
`;

const DatapointsViewDropdownToggleArrow = styled.div`
  bottom: 0;
  right: 0;
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

export const MetricInsightsRow = styled.div`
  display: flex;
  flex-direction: row;
`;

const MetricInsightContainer = styled.div`
  margin-right: 32px;

  &:last-child {
    margin-right: 0;
    margin-left: auto;
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
