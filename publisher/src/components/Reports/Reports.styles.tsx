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

import { BadgeColors } from "@justice-counts/common/components/Badge";
import {
  CustomDropdown,
  CustomDropdownMenu,
  CustomDropdownMenuItem,
  CustomDropdownToggle,
} from "@justice-counts/common/components/Dropdown";
import {
  HEADER_BAR_HEIGHT,
  MIN_DESKTOP_WIDTH,
  MIN_MOBILE_WIDTH,
  MIN_TABLET_WIDTH,
  palette,
  typography,
} from "@justice-counts/common/components/GlobalStyles";
import styled from "styled-components/macro";

import { DISCLAIMER_BANNER_HEIGHT } from "../primitives";

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
  ${typography.sizeCSS.largeTitle}
  font-size: 32px;
  margin-top: 48px;
  margin-bottom: 14px;
  padding: 0 24px;

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
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  margin: ${({ noPadding }) => (noPadding ? `0` : `0 24px`)};
  border-bottom: 1px solid ${palette.highlight.grey2};

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    padding-top: 24px;
    padding-bottom: 12px;
    border-bottom: none;
  }
`;

export const TabbedBarContainer = styled.div`
  & > div {
    border: 0;
  }
  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    display: none;
  }
`;

export const BulkActionModeTitle = styled.div`
  padding: 10px 0;
  ${typography.sizeCSS.normal};

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    ${typography.sizeCSS.medium}
    margin-top: 0;
    padding: 0;
  }
`;

export const ReportActions = styled.div`
  height: 36px;
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
    padding: 8px 16px;
  }

  & ${CustomDropdownMenu} {
    min-width: 100%;
    margin-top: 8px;
    box-shadow: 0px 0px 4px 0px ${palette.highlight.grey6};
  }

  & ${CustomDropdownMenuItem} {
    border: 0;
  }
`;

export const ReportsFilterDropdownContainer = styled.div`
  display: none;
  width: 100%;
  height: 56px;
  border-bottom: 1px solid ${palette.highlight.grey2};
  border-top: 1px solid ${palette.highlight.grey2};
  align-items: center;

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    display: flex;
  }
`;

export const Table = styled.div<{
  isSuperagency?: boolean;
  disclaimerBannerHeight?: number;
}>`
  width: 100%;
  padding: ${({ isSuperagency, disclaimerBannerHeight }) =>
      isSuperagency
        ? `${156 + (disclaimerBannerHeight ?? DISCLAIMER_BANNER_HEIGHT)}px`
        : `156px`}
    0 50px 0;
  margin: 0 24px;
  overflow: auto;

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    padding-top: ${({ isSuperagency, disclaimerBannerHeight }) =>
      isSuperagency
        ? `${152 + (disclaimerBannerHeight ?? DISCLAIMER_BANNER_HEIGHT)}px`
        : `152px`};
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
  padding: 16px 8px;
  color: ${({ noHover }) =>
    noHover ? palette.highlight.grey9 : palette.solid.darkgrey};
  transition: 0.3s ease;
  border-bottom: 1px solid ${palette.highlight.grey2};

  ${({ noHover }) =>
    noHover ? typography.sizeCSS.normal : typography.sizeCSS.large}
  ${({ selected }) =>
    selected && `background-color: ${palette.highlight.grey1};`}
  &:hover {
    ${({ noHover }) =>
      noHover
        ? ``
        : `cursor: pointer;
           background-color: ${palette.highlight.grey1};
    `}
  }
`;

export const LabelRow = styled(Row)`
  &:hover {
    cursor: unset;
    background-color: unset;
  }
`;

export const Cell = styled.div<{ capitalize?: boolean }>`
  min-width: 200px;
  display: flex;
  flex: 1 1 250px;
  justify-content: start;
  align-items: center;
  position: relative;
  ${typography.sizeCSS.normal};
  font-weight: 400;
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
    &:nth-child(3) {
      display: none;
    }
  }

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    ${typography.sizeCSS.normal};
    &:nth-child(5) {
      display: none;
    }

    &:nth-child(4) {
      padding-right: unset;
    }
  }

  @media only screen and (max-width: ${MIN_MOBILE_WIDTH}px) {
    ${typography.sizeCSS.normal};
    &:nth-child(2) {
      display: none;
    }
  }
`;

export const LabelCell = styled(Cell)`
  ${typography.caption};
  font-size: 12px;
  text-transform: uppercase;
  color: ${palette.highlight.grey8};
`;

export const LabelStatus = styled.div<{ color: BadgeColors }>`
  ${typography.sizeCSS.normal};
  font-weight: 400;
  color: ${({ color }) => {
    if (color === "RED") {
      return palette.solid.red;
    }
    if (color === "GREEN") {
      return palette.solid.green;
    }
    if (color === "ORANGE") {
      return palette.solid.orange;
    }
    return palette.highlight.grey5;
  }};
`;

export const EditorsTooltipContainer = styled.div`
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

export const EditorsContentCellContainer = styled.div`
  width: fit-content;
  display: flex;
  flex-direction: row;
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

export const ButtonWithMiniLoaderContainer = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
`;
