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
  HEADER_BAR_HEIGHT,
  palette,
} from "@justice-counts/common/components/GlobalStyles";
import styled from "styled-components/macro";

import { MAIN_PANEL_MAX_WIDTH } from "../ReviewMetrics/ReviewMetrics.styles";
import {
  CONFIRMATION_DIALOGUE_SIDE_PANEL_WIDTH,
  SIDE_PANEL_HORIZONTAL_PADDING,
} from "./ReportDataEntry.styles";
import {
  ReportSummaryProgressIndicatorWrapper,
  ReportSummarySection,
  ReportSummaryWrapper,
} from "./ReportSummaryPanel";

const MAIN_PANEL_AND_SIDE_PANEL_MIN_WIDTH =
  CONFIRMATION_DIALOGUE_SIDE_PANEL_WIDTH +
  +MAIN_PANEL_MAX_WIDTH +
  SIDE_PANEL_HORIZONTAL_PADDING * 2;

export const ConfirmationSummaryWrapper = styled(ReportSummaryWrapper)`
  width: ${CONFIRMATION_DIALOGUE_SIDE_PANEL_WIDTH}px;
  padding-top: ${56 + HEADER_BAR_HEIGHT}px;
  bottom: 100px;

  @media only screen and (max-width: ${MAIN_PANEL_AND_SIDE_PANEL_MIN_WIDTH}px) {
    display: none;
  }
`;

export const ConfirmationSummaryProgressIndicatorWrapper = styled(
  ReportSummaryProgressIndicatorWrapper
)`
  margin-top: 0;
  height: calc(100vh - ${HEADER_BAR_HEIGHT}px);
`;

export const ConfirmationSummarySection = styled(ReportSummarySection)`
  color: ${palette.solid.darkgrey};
`;

export const MetricDisplayName = styled.div`
  max-width: 238px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
