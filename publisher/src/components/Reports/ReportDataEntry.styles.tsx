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
  palette,
  typography,
} from "@justice-counts/common/components/GlobalStyles";
import React from "react";
import styled from "styled-components/macro";

export const SIDE_PANEL_WIDTH = 360;
export const CONFIRMATION_DIALOGUE_SIDE_PANEL_WIDTH = 295;
export const DATA_ENTRY_WIDTH = 644;
export const SIDE_PANEL_HORIZONTAL_PADDING = 24;
export const TWO_PANEL_MAX_WIDTH = DATA_ENTRY_WIDTH + SIDE_PANEL_WIDTH * 2; // data entry panel (644) + side panels (360 * 2) (each side panel includes 24px left and right padding)
export const ONE_PANEL_MAX_WIDTH =
  DATA_ENTRY_WIDTH + SIDE_PANEL_WIDTH + SIDE_PANEL_HORIZONTAL_PADDING; // data entry panel (644) + left side panel (360) + right padding from the right side panel (24)
export const SINGLE_COLUMN_MAX_WIDTH =
  DATA_ENTRY_WIDTH + SIDE_PANEL_HORIZONTAL_PADDING * 2; // data entry panel (644) + left and right padding (24 * 2)
export const BREAKPOINT_HEIGHT = 750;

export const ReportDataEntryWrapper = styled.div`
  z-index: 4;
  height: fit-content;
  background-color: ${palette.solid.white};
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: -${HEADER_BAR_HEIGHT}px;
  padding-top: ${HEADER_BAR_HEIGHT}px;
`;

export const PublishDataWrapper = styled.div`
  width: ${SIDE_PANEL_WIDTH}px;
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1;
  padding: ${HEADER_BAR_HEIGHT + 31}px ${SIDE_PANEL_HORIZONTAL_PADDING}px 0
    ${SIDE_PANEL_HORIZONTAL_PADDING}px;
  height: 100%;

  @media only screen and (max-width: ${TWO_PANEL_MAX_WIDTH}px) {
    display: none;
  }
`;

export const FieldDescriptionTitle = styled.div`
  margin-bottom: 10px;
  color: ${palette.solid.darkgrey};
`;

export const FieldDescriptionContainer = styled.div`
  ${typography.sizeCSS.normal}
  padding-top: 16px;
  color: ${palette.highlight.grey9};
`;

export type FieldDescriptionProps = { title: string; description: string };

export const FieldDescription: React.FC<{
  fieldDescription: FieldDescriptionProps;
}> = ({ fieldDescription }) => (
  <FieldDescriptionContainer>
    <FieldDescriptionTitle>{fieldDescription.title}</FieldDescriptionTitle>
    {fieldDescription.description}
  </FieldDescriptionContainer>
);
