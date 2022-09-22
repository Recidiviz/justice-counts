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
  margin-top: 22px;
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

export const SectionTitleOverwrites = styled(SectionTitleMonths)`
  background-color: ${palette.solid.orange};
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
  padding-top: 33px;
`;

export const DatapointsTableNamesTable = styled.table`
  border-collapse: collapse;
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

export const DatapointsTableDetailsContainer = styled.div`
  position: relative;
  display: flex;
  max-width: 624px;
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
  width: 32px;
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
  margin: 0 32px;
`;
export const DatapointsTableDetailsRowHead = styled.thead``;
export const DatapointsTableDetailsRowBody = styled.tbody``;
export const DatapointsTableDetailsRow = styled.tr``;
export const DatapointsTableDetailsRowHeader = styled.th`
  ${typography.sizeCSS.small}
  padding-bottom: 8px;
  padding-top: 8px;
  text-align: center;
  border: 1px solid ${palette.highlight.grey3};
`;
export const DatapointsTableDetailsCell = styled.td`
  padding-left: 32px;
  padding-right: 32px;
  padding-bottom: 4px;
  padding-top: 4px;
  font-size: 18px;
  height: 32px;
  font-weight: 400;
  text-align: center;
  border: 1px solid ${palette.highlight.grey3};
  white-space: nowrap;
`;
export const DatapointsTableDetailsDivider = styled.tr`
  height: 32px;
  border: 1px solid ${palette.highlight.grey3};
`;
