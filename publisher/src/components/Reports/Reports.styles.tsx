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
import { DropdownMenu, DropdownToggle } from "@recidiviz/design-system";
import styled from "styled-components/macro";

export const PageHeader = styled.div`
  width: 100%;
  background: ${palette.solid.white};
  position: fixed;
  z-index: 2;
`;

export const ReportsHeader = styled(PageHeader)`
  top: ${HEADER_BAR_HEIGHT}px;

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    padding: 24px 24px 8px 24px;
  }
`;

export const PageTitle = styled.div`
  ${typography.sizeCSS.headline}
  margin-top: 40px;
  padding: 0px 22px;

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    ${typography.sizeCSS.medium}
    margin-top: 0;
    padding: 0;
  }
`;

export const TabbedBar = styled.div<{ noPadding?: boolean }>`
  ${typography.sizeCSS.normal}
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  padding: ${({ noPadding }) => (noPadding ? `0` : `0px 22px`)};
  border-bottom: 1px solid ${palette.highlight.grey9};

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    padding-bottom: 12px;
  }
`;

export const TabbedOptions = styled.div`
  display: flex;
  align-items: center;
`;

export const TabbedItem = styled.div<{
  selected?: boolean;
  capitalize?: boolean;
}>`
  padding: 24px 0 16px 0;
  margin-right: 20px;
  color: ${({ selected }) =>
    selected ? palette.solid.blue : palette.highlight.grey9};
  border-bottom: ${({ selected }) =>
    selected ? `3px solid ${palette.solid.blue}` : `3px solid transparent`};
  transition: color 0.3s ease;
  ${({ capitalize }) => capitalize && `text-transform: capitalize;`}

  &:hover {
    cursor: pointer;
    color: ${palette.solid.blue};
  }
`;

export const TabbedActionsWrapper = styled.div`
  display: flex;
  gap: 15px;
`;

export const ReportActions = styled.div`
  display: flex;
`;

export const ReportActionsItem = styled.div<{
  disabled?: boolean;
}>`
  display: flex;
  align-items: center;
  margin-left: 16px;
  transition: 0.2s ease;
  color: ${({ disabled }) =>
    disabled ? palette.highlight.grey8 : palette.solid.blue};

  &:hover {
    ${({ disabled }) =>
      !disabled
        ? `
        cursor: pointer;
        opacity: 0.8;
      `
        : `
        cursor: default;
      `}
  }
`;

export const ReportActionsSelectIcon = styled.div<{
  disabled?: boolean;
}>`
  width: 11px;
  height: 11px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 4.5px;
  border: 1px solid
    ${({ disabled }) =>
      disabled ? palette.highlight.grey8 : palette.solid.blue};
  border-radius: 50%;

  &::after {
    content: "";
    height: 1px;
    width: 6px;
    background-color: ${({ disabled }) =>
      disabled ? palette.highlight.grey8 : palette.solid.blue};
  }
`;

export const ReportActionsNewIcon = styled(ReportActionsSelectIcon)`
  &::before {
    content: "";
    position: absolute;
    height: 6px;
    width: 1px;
    background-color: ${palette.solid.blue};
  }
`;

export const DropdownContainer = styled.div`
  display: none;
  width: 100%;
  height: 56px;
  border-bottom: 1px solid ${palette.highlight.grey9};
  align-items: center;

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    display: flex;
  }

  & > div {
    width: 100%;
  }
`;

export const DisaggregationsDropdownContainer = styled(DropdownContainer)`
  border-top: 1px solid ${palette.highlight.grey9};
  margin-bottom: 32px;
  height: 40px;
`;

export const StatusFilterDropdownToggle = styled(DropdownToggle)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: start;
  gap: 12px;
  align-items: center;
  padding-left: 0;
  color: ${palette.solid.darkgrey};
  ${typography.sizeCSS.medium};

  &:active,
  &:hover,
  &:focus,
  &[aria-expanded="true"] {
    color: ${palette.solid.darkgrey};
  }
`;

export const DisaggregationsDropdownToggle = styled(StatusFilterDropdownToggle)`
  justify-content: space-between;
  ${typography.sizeCSS.normal};
  padding-right: 0;
  color: ${palette.solid.blue};
`;

export const DisaggregationsDropdownToggleName = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

export const StatusFilterDropdownMenu = styled(DropdownMenu)`
  width: 100%;
  overflow-y: scroll;
  z-index: 10;
  margin-top: 11px;
  box-shadow: 0px 0px 1px rgba(23, 28, 43, 0.1),
    0px 4px 8px rgba(23, 28, 43, 0.04), 0px 8px 56px rgba(23, 28, 43, 0.1);
  border-radius: 4px;
`;

export const DisaggregationsDropdownMenu = styled(StatusFilterDropdownMenu)`
  margin-top: 4px;
`;

export const Table = styled.div`
  width: 100%;
  padding: 170px 22px 50px 22px;
  overflow: auto;

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    padding-top: 115px;
  }
`;

export const Row = styled.div<{
  noHover?: boolean;
  selected?: boolean;
  isRowReportYear?: boolean;
}>`
  width: 100%;
  display: flex;
  justify-content: start;
  align-items: center;
  padding: 10px 0;
  color: ${({ noHover }) =>
    noHover ? palette.highlight.grey9 : palette.solid.darkgrey};
  transition: 0.3s ease;
  ${({ noHover }) =>
    noHover ? typography.sizeCSS.normal : typography.sizeCSS.large}
  ${({ selected }) =>
    selected && `background-color: ${palette.solid.lightgreen};`}

  &:hover {
    ${({ noHover }) =>
      noHover
        ? ``
        : `cursor: pointer;
           background-color: ${palette.solid.lightgreen};
    `}
  }

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    padding: ${({ isRowReportYear }) =>
      isRowReportYear ? "8px 0 0 0" : "8px 0"};
  }
`;

export const LabelRow = styled(Row)`
  &:hover {
    cursor: unset;
    background-color: unset;
  }

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    padding: 16px 0 0 0;
  }
`;

export const Cell = styled.div<{ capitalize?: boolean }>`
  min-width: 200px;
  display: flex;
  flex: 1 1 250px;
  justify-content: start;
  align-items: center;
  position: relative;
  font-size: 1.2rem;
  text-transform: ${({ capitalize }) => capitalize && "capitalize"};
  padding-right: 40px;
  white-space: nowrap;

  span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &:first-child {
    flex: 2 1 200px;
  }

  &:last-child {
    justify-content: flex-end;
    padding-right: unset;
  }

  @media only screen and (max-width: ${MIN_DESKTOP_WIDTH}px) {
    &:nth-child(2) {
      display: none;
    }
  }

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    ${typography.sizeCSS.normal};
    &:nth-child(4) {
      display: none;
    }
    &:nth-child(3) {
      padding-right: unset;
    }
  }
`;

export const LabelCell = styled(Cell)`
  ${typography.sizeCSS.normal}
  color: ${palette.highlight.grey9};
`;

export const AdditionalEditorsTooltip = styled.div`
  ${typography.sizeCSS.normal}
  padding: 10px 20px;
  background: ${palette.solid.blue};
  color: ${palette.solid.white};
  position: absolute;
  z-index: 1;
  top: 32px;
  right: 0;
  border-radius: 2px;
  text-align: center;
  box-shadow: 2px 2px 8px ${palette.highlight.grey5};
  display: flex;
`;

export const NoReportsDisplay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 50px;
`;

export const EmptySelectionCircle = styled.div`
  width: 16px;
  height: 16px;
  border: 1px solid ${palette.highlight.grey4};
  border-radius: 50%;
  margin-right: 8px;
`;

export const SelectedCheckmark = styled.img`
  width: 16px;
  height: 16px;
  margin-right: 8px;
`;

export const AndOthersSpan = styled.span`
  margin-left: 8px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

export const CommaSpan = styled.span`
  &::after {
    content: ",";
  }
  margin-left: 0px;
  margin-right: 2px;
`;
