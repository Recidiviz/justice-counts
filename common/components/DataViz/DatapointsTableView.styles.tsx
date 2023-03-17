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

import styled from "styled-components/macro";

import { palette, typography } from "../GlobalStyles";

export const DatapointsTableViewTitleWrapper = styled.div`
  padding: 5px 0 14px 0;
  border-bottom: 1px solid ${palette.highlight.grey9};
  position: sticky;
  top: 50px;
  background-color: ${palette.solid.white};
  z-index: 2;
`;
export const DatapointsTableContainer = styled.div<{
  useDataPageStyles?: boolean;
}>`
  margin-top: ${({ useDataPageStyles }) => (useDataPageStyles ? "32px" : "0")};
  width: 100%;
  display: flex;
  flex-direction: row;
  padding: ${({ useDataPageStyles }) =>
    useDataPageStyles ? "0 15px 0 15px" : "0"};

  &:hover {
    & > * {
      color: ${palette.highlight.grey8};
    }
  }
`;
export const DatapointsTableNamesContainer = styled.div<{
  useDataPageStyles?: boolean;
}>`
  width: ${({ useDataPageStyles }) => (useDataPageStyles ? "240px" : "400px")};
  min-width: ${({ useDataPageStyles }) =>
    useDataPageStyles ? "240px" : "400px"};
  margin-top: ${({ useDataPageStyles }) => (useDataPageStyles ? "33px" : "0")};
`;
export const DatapointsTableNamesTable = styled.table`
  border-collapse: collapse;
`;
export const DatapointsTableNamesTableBody = styled.tbody``;
export const DatapointsTableBottomBorder = styled.tr`
  border-bottom: 1px solid ${palette.highlight.grey3};
`;
export const DatapointsTableNamesRow = styled.tr``;
export const DatapointsTableNamesCell = styled.td<{
  isTotalRow?: boolean;
  useDataPageStyles?: boolean;
}>`
  padding-top: ${({ isTotalRow, useDataPageStyles }) =>
    isTotalRow && useDataPageStyles ? "42px" : "4px"};
  padding-bottom: ${({ isTotalRow }) => (isTotalRow ? "29px" : "4px")};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 18px;
  font-weight: 500;
  width: 240px;
  max-width: 400px;
  height: 32px;

  &:hover {
    color: ${palette.solid.darkgrey};
  }
`;
export const DatapointsMetricNameCell = styled(DatapointsTableNamesCell)`
  ${typography.sizeCSS.title};
  color: ${palette.solid.darkgrey};
  line-height: 38px;
  padding: 0 0 31px 0;
`;
export const DatapointsTableNamesDivider = styled.td`
  ${typography.sizeCSS.small}
  padding-top: 8px;
  padding-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${palette.highlight.grey8};
`;
export const DatapointsTableDetailsContainer = styled.div<{
  useDataPageStyles?: boolean;
}>`
  position: relative;
  display: flex;
  max-width: ${({ useDataPageStyles }) =>
    useDataPageStyles ? "calc(100% - 240px)" : "calc(100% - 400px)"};
`;
export const DatapointsTableDetailScrollContainer = styled.div`
  overflow-x: auto;
`;
export const DatapointsTableDetailsContainerOverlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;
export const DatapointsTableDetailsContainerOverlayLeftGradient = styled.div`
  background: linear-gradient(
    0.25turn,
    rgb(255, 255, 255, 1),
    rgb(255, 255, 255, 0)
  );
  width: 15px;
  height: 100%;
`;
export const DatapointsTableDetailsContainerOverlayRightGradient = styled.div`
  background: linear-gradient(
    0.25turn,
    rgb(255, 255, 255, 0),
    rgb(255, 255, 255, 1)
  );
  width: 32px;
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
`;
export const DatapointsTableDetailsTable = styled.table`
  border-collapse: collapse;
  margin: 1px 32px 0 0;
`;
export const DatapointsTableDetailsRowHead = styled.thead``;
export const DatapointsTableDetailsRowBody = styled.tbody``;
export const DatapointsTableDetailsRow = styled.tr``;
export const DatapointsTableDetailsRowHeader = styled.th<{
  useDataPageStyles?: boolean;
  isColHovered?: boolean;
}>`
  ${typography.sizeCSS.normal}
  padding-left: 15px;
  padding-right: 32px;
  padding-bottom: 38px;
  padding-top: 8px;
  text-align: center;

  color: ${({ useDataPageStyles, isColHovered }) => {
    if (useDataPageStyles) return palette.solid.darkgrey;
    return isColHovered ? palette.solid.white : palette.solid.darkgrey;
  }};

  span {
    background-color: ${({ useDataPageStyles, isColHovered }) => {
      if (useDataPageStyles) return palette.solid.white;
      return isColHovered ? palette.solid.blue : palette.solid.offwhite;
    }};
    padding: 5px 8px;
    font-weight: 700;
  }
`;
export const DatapointsTableDetailsCell = styled.td<{
  isColumnHovered: boolean;
  isRowHovered: boolean;
  isTotalRow?: boolean;
}>`
  padding-left: 15px;
  padding-right: 32px;
  padding-bottom: ${({ isTotalRow }) => (isTotalRow ? "29px" : "4px")};
  padding-top: 4px;
  font-size: 18px;
  height: 32px;
  text-align: center;
  white-space: nowrap;

  color: ${({ isColumnHovered }) => isColumnHovered && palette.solid.darkgrey};
  color: ${({ isRowHovered }) => isRowHovered && palette.solid.darkgrey};
`;
export const DatapointsTableDetailsDivider = styled.tr`
  height: 32px;
`;
export const OrangeText = styled.span`
  color: ${palette.solid.orange};
`;

export const StrikethroughText = styled.span`
  text-decoration: line-through;
`;
