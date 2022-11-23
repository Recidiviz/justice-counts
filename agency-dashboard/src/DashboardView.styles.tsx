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
  COMMON_DESKTOP_WIDTH,
  palette,
  TABLET_WIDTH,
  typography,
} from "@justice-counts/common/components/GlobalStyles";
import styled from "styled-components/macro";

export const Container = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
  display: flex;
  justify-content: stretch;
  align-items: stretch;
  padding-top: 64px;
`;

export const LeftPanel = styled.div`
  margin-left: 24px;
  margin-right: 24px;
  width: 424px;
  min-width: 424px;
  margin-right: 126px;

  @media only screen and (max-width: ${COMMON_DESKTOP_WIDTH - 1}px) {
    display: none;
  }
`;

export const RightPanel = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  align-items: stretch;
  width: calc(100% - 574px);
  padding-left: 24px;
  padding-right: 24px;

  @media only screen and (max-width: ${TABLET_WIDTH - 1}px) {
    padding-left: 16px;
    padding-right: 16px;
  }
`;

export const BackButtonContainer = styled.div`
  ${typography.sizeCSS.normal}
  padding-top: 8px;
  padding-right: 8px;
  padding-bottom: 8px;
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    cursor: pointer;
    color: ${palette.solid.blue};
  }

  &:hover path {
    fill: ${palette.solid.blue};
  }

  &::after {
    content: "Agency Overview";
  }
`;

export const RightPanelBackButtonContainer = styled(BackButtonContainer)`
  @media only screen and (min-width: ${COMMON_DESKTOP_WIDTH}px) {
    display: none;
  }
`;

export const MetricTitle = styled.div`
  ${typography.sizeCSS.headline}
  margin-top: 36px;
  margin-bottom: 40px;
  hyphens: auto;
  overflow-wrap: break-word;
`;

export const RightPanelMetricTitle = styled(MetricTitle)`
  margin-bottom: 24px;

  @media only screen and (min-width: ${COMMON_DESKTOP_WIDTH}px) {
    display: none;
  }

  @media only screen and (max-width: ${TABLET_WIDTH - 1}px) {
    ${typography.sizeCSS.title}
    margin-bottom: 16px;
  }
`;

export const MetricOverviewContent = styled.div`
  ${typography.sizeCSS.medium}
  margin-top: 36px;

  @media only screen and (max-width: ${TABLET_WIDTH - 1}px) {
    ${typography.sizeCSS.normal}
  }
`;

export const RightPanelMetricOverviewContent = styled(MetricOverviewContent)`
  margin-top: 16px;

  @media only screen and (min-width: ${COMMON_DESKTOP_WIDTH}px) {
    display: none;
  }
`;

export const MetricOverviewActionsContainer = styled.div`
  display: flex;
  margin-top: 24px;
  padding-bottom: 32px;
`;

export const RightPanelMetricOverviewActionsContainer = styled(
  MetricOverviewActionsContainer
)`
  @media only screen and (min-width: ${COMMON_DESKTOP_WIDTH}px) {
    display: none;
  }

  @media only screen and (max-width: ${TABLET_WIDTH - 1}px) {
    flex-direction: column;
    padding-bottom: 64px;
  }
`;

export const MetricOverviewActionButtonContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;

  &:hover {
    cursor: pointer;
    color: ${palette.solid.blue};
  }

  &:hover path {
    stroke: ${palette.solid.blue};
  }

  &:first-child {
    padding-left: 0px;
  }

  @media only screen and (max-width: ${TABLET_WIDTH - 1}px) {
    padding-left: 0px;
  }
`;

export const MetricOverviewActionButtonText = styled.div`
  ${typography.sizeCSS.normal}
  margin-left: 8px;
`;
