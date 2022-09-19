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

import { DataUploadContainer } from "../DataUpload";
import { HEADER_BAR_HEIGHT, palette, typography } from "../GlobalStyles";

export const MAIN_PANEL_MAX_WIDTH = 864;

export const Container = styled(DataUploadContainer)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const MainPanel = styled.div`
  width: 100%;
  max-width: ${MAIN_PANEL_MAX_WIDTH}px;
  margin-top: ${56 + HEADER_BAR_HEIGHT}px;
  margin-bottom: 128px;
`;

export const Heading = styled.div`
  ${typography.sizeCSS.headline}

  span {
    color: ${palette.solid.blue};
  }
`;

export const Subheading = styled.div`
  margin-top: 16px;
  font-size: 18px;
  font-weight: 400;
  line-height: 30px;

  a {
    color: ${palette.solid.blue};
  }
`;

export const SectionContainer = styled.div`
  margin-top: 32px;
  padding-top: 16px;
  display: flex;
  align-items: center;
  justify-content: stretch;
  flex-direction: column;
  border-top: 1px solid ${palette.highlight.grey3};
`;

export const SectionTitleContainer = styled.div`
  display: inline-flex;
  align-items: center;
  max-width: 100%;
  width: 100%;
  flex: 1;
`;
export const SectionTitleNumber = styled.div`
  width: 40px;
  min-width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${palette.solid.blue};
  color: ${palette.solid.white};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const SectionTitle = styled.div`
  margin-left: 16px;
  ${typography.sizeCSS.title}
  flex: 1;
  padding-right: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const SectionTitleMonths = styled.div`
  background-color: ${palette.solid.blue};
  padding-left: 8px;
  padding-right: 8px;
  padding-top: 4px;
  padding-bottom: 4px;
  margin-left: 16px;
  ${typography.sizeCSS.small}
  color: ${palette.solid.white};
  white-space: nowrap;
`;

export const DatapointsTableContainer = styled.div`
  margin-top: 16px;
  width: 100%;
  display: flex;
  flex-direction: row;
`;

export const DatapointsTableNamesContainer = styled.div`
  width: 240px;
  min-width: 240px;
  padding-top: 34px;
  border-right: 1px solid ${palette.highlight.grey3};
`;
export const DatapointsTableNamesRow = styled.div`
  padding-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 18px;
  font-weight: 400;
`;
export const DatapointsTableNamesDivider = styled.div`
  ${typography.sizeCSS.small}
  padding-top: 8px;
  padding-bottom: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const DatapointsTableDetailsContainer = styled.div`
  overflow-x: scroll;
`;
export const DatapointsTableDetailsTable = styled.table``;
export const DatapointsTableDetailsRowHead = styled.thead``;
export const DatapointsTableDetailsRowBody = styled.tbody``;
export const DatapointsTableDetailsRow = styled.tr``;
export const DatapointsTableDetailsRowHeader = styled.th`
  ${typography.sizeCSS.small}
  padding-bottom: 16px;
  text-align: center;
`;
export const DatapointsTableDetailsCell = styled.td`
  padding-left: 32px;
  padding-right: 32px;
  padding-bottom: 8px;
  font-size: 18px;
  font-weight: 400;
  text-align: center;
`;
export const DatapointsTableDetailsDivider = styled.tr`
  height: 32px;
`;
