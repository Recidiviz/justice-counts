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
  palette,
  typography,
} from "@justice-counts/common/components/GlobalStyles";
import styled from "styled-components/macro";

export const Container = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: stretch;
  align-items: stretch;
  padding-top: 64px;
`;

export const LeftPanel = styled.div`
  margin-top: 16px;
  margin-left: 24px;
  margin-right: 24px;
  width: 424px;
  min-width: 424px;
  margin-right: 126px;
`;

export const RightPanel = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  align-items: stretch;
`;

export const RightPanelTopContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

export const LeftPanelBackButton = styled.div`
  ${typography.sizeCSS.normal}
  float: left;
  padding-top: 8px;
  padding-right: 8px;
  padding-bottom: 8px;

  &:hover {
    cursor: pointer;
    color: ${palette.solid.blue};
  }
`;

export const MetricTitle = styled.div`
  ${typography.sizeCSS.headline}
  margin-top: 86px;
`;

export const MetricOverviewTitle = styled.div`
  ${typography.sizeCSS.large}
  margin-top: 48px;

  &::after {
    content: "Metric Overview";
  }
`;

export const MetricOverviewContent = styled.div`
  ${typography.sizeCSS.medium}
  margin-top: 16px;
`;

export const MetricOverviewActionsContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 24px;
`;

export const MetricOverviewActionButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
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
`;

export const MetricOverviewActionButtonText = styled.div`
  ${typography.sizeCSS.normal}
  margin-left: 8px;
`;

export const AllMetricsButtonContainer = styled.div`
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 8px;
  padding-bottom: 8px;
  margin-top: 8px;
  margin-bottom: 8px;
  display: flex;
  flex-direction: row;
  align-items: center;

  &:hover {
    cursor: pointer;
    color: ${palette.solid.blue};
  }

  &:hover path {
    fill: ${palette.solid.blue};
  }
`;

export const AllMetricsButtonText = styled.div`
  ${typography.sizeCSS.normal}
  margin-left: 8px;
  margin-right: 8px;
`;

export const AllMetricsButtonCountContainer = styled.div`
  background: ${palette.solid.blue};
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0px 8px;
  gap: 8px;

  width: 25px;
  height: 20px;
  border-radius: 24px;

  ${typography.sizeCSS.small}
  font-size: 13px;
`;
