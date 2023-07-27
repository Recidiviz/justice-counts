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
  AGENCY_DASHBOARD_HEADER_BAR_HEIGHT,
  palette,
  typography,
} from "@justice-counts/common/components/GlobalStyles";
import styled from "styled-components/macro";

const CATEGORY_METRIC_BOX_WIDTH = 547;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: ${AGENCY_DASHBOARD_HEADER_BAR_HEIGHT}px;
  margin-bottom: ${AGENCY_DASHBOARD_HEADER_BAR_HEIGHT}px;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 40px;
  width: ${CATEGORY_METRIC_BOX_WIDTH * 2}px;
`;

export const Divider = styled.div`
  width: 100%;
  border-bottom: 1px solid ${palette.highlight.grey4};
`;

export const TopBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  width: ${CATEGORY_METRIC_BOX_WIDTH}px;
  padding-top: 32px;
  gap: 24px;

  & > div > div {
    min-width: unset;
  }
`;

export const CategoryTitle = styled.div`
  ${typography.sizeCSS.title};
`;

export const CategoryDescription = styled.div`
  ${typography.sizeCSS.normal};
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
  gap: 32px;
`;

export const MetricsFilters = styled.div`
  display: flex;
  flex-direction: row;
  gap: 32px;
`;

export const MetricsFilterButton = styled.div<{ active: boolean }>`
  ${typography.sizeCSS.normal};
  color: ${({ active }) =>
    active ? palette.solid.blue : palette.solid.darkgrey};
  cursor: pointer;
`;

export const MetricsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

export const MetricBox = styled.div`
  width: ${CATEGORY_METRIC_BOX_WIDTH}px;
  padding: 40px 0;
  display: flex;
  flex-direction: column;
  align-items: start;
  box-shadow: 1px 0 0 0 ${palette.solid.lightgrey},
    0 1px 0 0 ${palette.solid.lightgrey}, 1px 1px 0 0 ${palette.solid.lightgrey},
    1px 0 0 0 ${palette.solid.lightgrey} inset,
    0 1px 0 0 ${palette.solid.lightgrey} inset;
`;

export const MetricName = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  ${typography.sizeCSS.large};
  margin-bottom: 16px;
  padding: 0 72px;
`;

export const MetricDescription = styled.div`
  ${typography.sizeCSS.normal};
  margin-bottom: 40px;
  padding: 0 72px;
`;

export const MetricDataVizContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 72px 0 19px;
  width: 100%;
  height: 254px;

  .recharts-bar-rectangle {
    cursor: pointer !important;
  }
`;
