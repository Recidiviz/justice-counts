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
  margin: 0 15px;
  padding: 5px 0 14px 0;
  border-bottom: 1px solid ${palette.highlight.grey9};
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
`;
export const DatapointsTableNamesContainer = styled.div`
  width: 240px;
  min-width: 240px;
  padding-top: 33px;
  border-right: 1px solid ${palette.highlight.grey3};
`;
export const DatapointsTableNamesTable = styled.table`
  border-collapse: collapse;
`;
export const DatapointsTableNamesTableBody = styled.tbody``;
export const DatapointsTableNamesRow = styled.tr``;
export const DatapointsTableNamesCell = styled.td`
  padding-top: 4px;
  padding-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 18px;
  font-weight: 400;
  max-width: 232px;
  height: 32px;
`;
export const DatapointsTableNamesDivider = styled.td`
  ${typography.sizeCSS.small}
  padding-top: 8px;
  padding-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
export const DatapointsTableDetailsContainer = styled.div<{
  useDataPageStyles?: boolean;
}>`
  position: relative;
  display: flex;
  max-width: ${({ useDataPageStyles }) =>
    useDataPageStyles ? "calc(100% - 240px)" : "624px"};
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
  margin: 0 32px 0 15px;
`;
export const DatapointsTableDetailsRowHead = styled.thead``;
export const DatapointsTableDetailsRowBody = styled.tbody``;
export const DatapointsTableDetailsRow = styled.tr``;
export const DatapointsTableDetailsRowHeader = styled.th`
  ${typography.sizeCSS.small}
  padding-left: 15px;
  padding-right: 32px;
  padding-bottom: 8px;
  padding-top: 8px;
  text-align: center;
`;
export const DatapointsTableDetailsCell = styled.td`
  padding-left: 15px;
  padding-right: 32px;
  padding-bottom: 4px;
  padding-top: 4px;
  font-size: 18px;
  height: 32px;
  font-weight: 400;
  text-align: center;
  white-space: nowrap;
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
