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
  CustomDropdown,
  CustomDropdownToggle,
} from "@justice-counts/common/components/Dropdown";
import {
  HEADER_BAR_HEIGHT,
  MIN_DESKTOP_WIDTH,
  MIN_TABLET_WIDTH,
  palette,
  typography,
} from "@justice-counts/common/components/GlobalStyles";
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

export const DesktopRecordsPageTitle = styled.div`
  ${typography.sizeCSS.headline}
  margin-top: 40px;
  padding: 0 22px;

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    display: none;
  }
`;

export const MobileRecordsPageTitle = styled.div`
  display: none;

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    ${typography.sizeCSS.medium}
    display: block;
  }
`;

export const ActionsWrapper = styled.div<{ noPadding?: boolean }>`
  ${typography.sizeCSS.normal}
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  padding: ${({ noPadding }) => (noPadding ? `0` : `0 22px`)};
  border-bottom: 1px solid ${palette.highlight.grey9};

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    padding-bottom: 12px;
    border-bottom: none;
  }
`;

export const TabbedBarContainer = styled.div`
  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    display: none;
  }
`;

export const BulkActionModeTitle = styled.div`
  padding: 24px 0 19px 0;
  ${typography.sizeCSS.large};

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    ${typography.sizeCSS.medium}
    margin-top: 0;
    padding: 0;
  }
`;

export const ReportActions = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
`;

export const BulkActionsDropdownContainer = styled.div`
  & ${CustomDropdown} {
    border: 1px solid ${palette.highlight.grey4};
    border-radius: 3px;
  }

  & ${CustomDropdownToggle} {
    padding: 9px 14px;
  }
`;

export const RemoveRecordsNumber = styled.span`
  color: ${palette.solid.red};
`;

export const ReportsFilterDropdownContainer = styled.div`
  display: none;
  width: 100%;
  height: 56px;
  border-bottom: 1px solid ${palette.highlight.grey9};
  border-top: 1px solid ${palette.highlight.grey9};
  align-items: center;

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    display: flex;
  }
`;

export const Table = styled.div`
  width: 100%;
  padding: 170px 0 50px 0;
  overflow: auto;

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    padding-top: 132px;
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
  padding: 10px 24px;
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
      isRowReportYear ? "8px 24px 0 24px" : "8px 24px"};
  }
`;

export const LabelRow = styled(Row)`
  &:hover {
    cursor: unset;
    background-color: unset;
  }

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    padding: 16px 24px 0 24px;
  }
`;

export const Cell = styled.div<{ capitalize?: boolean }>`
  min-width: 200px;
  display: flex;
  flex: 1 1 250px;
  justify-content: start;
  align-items: center;
  position: relative;
  ${typography.sizeCSS.medium};
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
  left: 0;
  max-width: 300px;
  border-radius: 3px;
  text-align: center;
  box-shadow: 2px 2px 8px ${palette.highlight.grey5};
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 2px;
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

export const MiniLoaderWrapper = styled.div`
  position: absolute;
  z-index: 3;
  display: flex;
  align-items: center;
`;

export const ReviewButtonContainer = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
`;
