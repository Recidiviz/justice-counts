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

import {
  HEADER_BAR_HEIGHT,
  palette,
  typography,
} from "@justice-counts/common/components/GlobalStyles";
import styled from "styled-components/macro";

import {
  SystemChip,
  SystemChipsContainer,
} from "../AgencyOverview/AgencyOverview.styles";

const MIN_METRIC_BOX_WIDTH = 507;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: ${HEADER_BAR_HEIGHT}px;
  margin-bottom: ${HEADER_BAR_HEIGHT}px;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 32px;
  width: 100%;
  padding: 0 96px;
`;

export const TopBlock = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: start;
  padding-top: 16px;

  & > div > div {
    min-width: unset;
  }
`;

export const AgencyTitle = styled.div`
  max-width: 70%;
  ${typography.sizeCSS.headline};
  margin-bottom: 50px;
`;

export const CategoryTitle = styled.div`
  ${typography.sizeCSS.title};
  margin-bottom: 16px;
`;

export const CategoryDescription = styled.div`
  ${typography.sizeCSS.normal};
  width: ${MIN_METRIC_BOX_WIDTH}px;
  margin-bottom: 16px;
`;

export const TopBlockControls = styled.div`
  display: flex;
  flex-direction: row;
  gap: 40px;
`;

export const TopBlockControl = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  ${typography.sizeCSS.normal};

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const MetricsBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
`;

export const MetricsFilters = styled.div`
  display: flex;
  flex-direction: row;
  gap: 32px;
`;

export const MetricsFilterButton = styled.div<{ active: boolean }>`
  ${typography.sizeCSS.normal};
  color: ${({ active }) =>
    active ? palette.solid.blue : palette.highlight.grey9};
  cursor: pointer;
`;

export const MetricsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;

  @media only screen and (max-width: 1220px) {
    flex-direction: column;
    flex-wrap: unset;
  }
`;

export const MetricBox = styled.div`
  width: 50%;
  min-width: ${MIN_METRIC_BOX_WIDTH}px;
  padding-top: 16px;
  padding-bottom: 100px;
  display: flex;
  flex-direction: column;
  align-items: start;

  &:not(:first-child) {
    padding: 100px 96px 100px 0;
  }

  @media only screen and (max-width: 1220px) {
    width: 100%;
  }
`;

export const MetricName = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  ${typography.sizeCSS.title};
  margin-bottom: 16px;
`;

export const MetricDescription = styled.div`
  ${typography.sizeCSS.normal};
  margin-bottom: 24px;
`;

export const MetricDataVizContainer = styled.div`
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  height: 647px;

  .recharts-bar-rectangle {
    cursor: pointer !important;
  }
`;

export const MetricDescriptionBarChartWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const BreakdownsTitle = styled.h3`
  ${typography.sizeCSS.medium};
  margin-left: 50px;
`;

export const CustomSystemChipsContainer = styled(SystemChipsContainer)`
  width: 100%;
  max-width: 93%;
  margin-bottom: 0;
  padding-bottom: 24px;
  border-bottom: 1px solid ${palette.highlight.grey4};
`;

export const CustomSystemChip = styled(SystemChip)``;
