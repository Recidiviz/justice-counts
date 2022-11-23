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
  margin-top: 32px;
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
export const DatapointsTableNamesContainer = styled.div`
  width: 240px;
  min-width: 240px;
  margin-top: 33px;
`;
export const DatapointsTableNamesTable = styled.table`
  border-collapse: collapse;
`;
export const DatapointsTableNamesTableBody = styled.tbody``;
export const DatapointsTableBottomBorder = styled.tr`
  border-bottom: 1px solid ${palette.highlight.grey3};
`;
export const DatapointsTableNamesRow = styled.tr``;
export const DatapointsTableNamesCell = styled.td`
  padding-top: 4px;
  padding-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 18px;
  font-weight: 400;
  width: 240px;
  max-width: 240px;
  height: 32px;

  &:hover {
    color: ${palette.solid.darkgrey};
  }
`;
export const DatapointsTableNamesDivider = styled.td`
  ${typography.sizeCSS.small}
  padding-top: 8px;
  padding-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${palette.solid.darkgrey};
`;
export const DatapointsTableDetailsContainer = styled.div<{
  useDataPageStyles?: boolean;
}>`
  position: relative;
  display: flex;
  max-width: ${({ useDataPageStyles }) =>
    useDataPageStyles ? "calc(100% - 240px)" : "624px"};
  border-left: 1px solid ${palette.highlight.grey3};
`;
export const DatapointsTableDetailScrollContainer = styled.div`
  overflow-x: scroll;
  padding-bottom: 10px;
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
export const DatapointsTableDetailsRow = styled.tr<{
  isTotalRow?: boolean;
}>`
  font-weight: ${({ isTotalRow }) => (isTotalRow ? "600" : "400")};
`;
export const DatapointsTableDetailsRowHeader = styled.th`
  ${typography.sizeCSS.small}
  padding-left: 15px;
  padding-right: 32px;
  padding-bottom: 8px;
  padding-top: 8px;
  text-align: center;

  color: ${palette.solid.darkgrey};
`;
export const DatapointsTableDetailsCell = styled.td<{
  isColumnHovered: boolean;
  isRowHovered: boolean;
}>`
  padding-left: 15px;
  padding-right: 32px;
  padding-bottom: 4px;
  padding-top: 4px;
  font-size: 18px;
  height: 32px;
  text-align: center;
  white-space: nowrap;

  color: ${({ isColumnHovered }) => isColumnHovered && palette.solid.darkgrey};
  color: ${({ isRowHovered }) => isRowHovered && palette.solid.darkgrey};
`;
export const DatapointsTableDetailsDivider = styled.tr`
  height: 32.5px;
`;
export const OrangeText = styled.span`
  color: ${palette.solid.orange};
`;

export const StrikethroughText = styled.span`
  text-decoration: line-through;
`;
