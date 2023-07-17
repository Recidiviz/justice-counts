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

export const METRIC_BOX_DESKTOP_WIDTH = 280;

export const AgencyOverviewWrapper = styled.div`
  max-width: ${METRIC_BOX_DESKTOP_WIDTH * 4 + 48 + 1}px;
  margin: ${AGENCY_DASHBOARD_HEADER_BAR_HEIGHT + 96}px auto;
  display: flex;
  flex-direction: column;
  padding: 0 24px 73px 24px;

  @media only screen and (max-width: ${METRIC_BOX_DESKTOP_WIDTH * 2 + 48}px) {
    max-width: 100%;
    padding: 0 17px 50px 8px;
  }
`;

export const AgencyOverviewHeader = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  padding-bottom: 96px;
  border-bottom: 1px solid ${palette.highlight.grey3};
  margin-bottom: 24px;
`;

export const AgencyTitle = styled.div`
  ${typography.sizeCSS.headline};
  width: 50%;
`;

export const AgencyDescription = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: end;
  ${typography.sizeCSS.normal};
`;

export const AgencyHomepage = styled.a`
  color: ${palette.solid.blue};
  text-decoration: none;
`;

export const MetricsViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

export const SectorChipsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 24px;
  margin-bottom: 64px;
`;

export const SectorChip = styled.div<{ active: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ active }) =>
    active ? palette.highlight.grey1 : palette.highlight.grey8};
  color: ${({ active }) =>
    active ? palette.highlight.grey8 : palette.solid.white};
  padding: 8px 16px;
  ${typography.sizeCSS.normal};
  width: fit-content;
  border-radius: 8px;
  text-transform: capitalize;
  cursor: pointer;
`;

export const CategorizedMetricsContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 96px;
`;

export const CategoryTitle = styled.div`
  ${typography.sizeCSS.large};
  margin-bottom: 8px;

  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;

export const CategoryDescription = styled.div`
  ${typography.sizeCSS.normal};
  color: ${palette.highlight.grey8};
  margin-bottom: 32px;
`;

export const MetricsContainer = styled.div<{ maxMetricsInRow: number }>`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  max-width: ${({ maxMetricsInRow }) =>
    maxMetricsInRow * METRIC_BOX_DESKTOP_WIDTH + 1}px;
  border-left: 1px solid ${palette.highlight.grey3};
  border-top: 1px solid ${palette.highlight.grey3};

  @media only screen and (max-width: ${METRIC_BOX_DESKTOP_WIDTH * 2 + 48}px) {
    max-width: 100%;
    flex-direction: column;
    border-left: none;
    border-top: none;
  }
`;

export const MetricBox = styled.div`
  width: ${METRIC_BOX_DESKTOP_WIDTH}px;
  max-width: ${METRIC_BOX_DESKTOP_WIDTH}px;
  height: 223px;
  padding: 24px;
  border-right: 1px solid ${palette.highlight.grey3};
  border-bottom: 1px solid ${palette.highlight.grey3};

  display: flex;
  flex-direction: column;

  &:hover {
    background-color: ${palette.highlight.grey1};
    cursor: pointer;
  }

  @media only screen and (max-width: ${METRIC_BOX_DESKTOP_WIDTH * 2 + 48}px) {
    border-left: 1px solid ${palette.highlight.grey3};
    border-top: 1px solid ${palette.highlight.grey3};
  }
`;

export const MetricBoxTitle = styled.div`
  ${typography.sizeCSS.small};
  color: ${palette.highlight.grey8};
  letter-spacing: 2px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  word-break: break-word;
  overflow: hidden;
  margin-bottom: auto;
`;

export const MetricBoxContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: end;

  @media only screen and (max-width: ${METRIC_BOX_DESKTOP_WIDTH * 2 + 48}px) {
    justify-content: start;
  }
`;

export const MetricBoxGraphContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;

  @media only screen and (max-width: ${METRIC_BOX_DESKTOP_WIDTH * 2 + 48}px) {
    margin-bottom: 0;
  }
`;

export const MiniChartContainer = styled.div`
  width: 100%;
  height: 85px;

  .recharts-wrapper {
    cursor: pointer !important;
  }
`;

export const MetricBoxGraphRange = styled.div`
  ${typography.sizeCSS.normal};
  color: ${palette.highlight.grey8};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

export const NotFoundWrapper = styled.div`
  //margin-top: ${AGENCY_DASHBOARD_HEADER_BAR_HEIGHT + 96}px;
  //margin-bottom: 96px;
  display: flex;
  flex-direction: column;
  gap: 48px;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
`;

export const NotFoundTitle = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  text-align: center;
  ${typography.sizeCSS.headline};
`;

export const NotFoundText = styled.div`
  ${typography.sizeCSS.large};
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
  align-items: center;
  text-align: center;

  span {
    ${typography.sizeCSS.medium};
  }

  a {
    ${typography.sizeCSS.medium};
    text-decoration: none;
    color: ${palette.solid.blue};
  }
`;
