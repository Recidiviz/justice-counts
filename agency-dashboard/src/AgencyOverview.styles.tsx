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
  typography,
} from "@justice-counts/common/components/GlobalStyles";
import styled from "styled-components/macro";

const METRIC_BLOCK_DESKTOP_WIDTH = 280;

export const AgencyOverviewWrapper = styled.div`
  max-width: ${METRIC_BLOCK_DESKTOP_WIDTH * 4}px;
  margin: ${HEADER_BAR_HEIGHT + 14}px auto;
  display: flex;
  flex-direction: column;

  @media only screen and (max-width: ${METRIC_BLOCK_DESKTOP_WIDTH * 2}px) {
    max-width: 320px;
    padding: 0 17px 0 8px;
  }
`;

export const PageTitle = styled.div`
  ${typography.sizeCSS.medium};
  margin-bottom: 24px;

  @media only screen and (max-width: ${METRIC_BLOCK_DESKTOP_WIDTH * 2}px) {
    ${typography.sizeCSS.normal};
    margin-bottom: 16px;
  }
`;

export const AgencyTitle = styled.div`
  ${typography.sizeCSS.headline};
  margin-bottom: 24px;

  @media only screen and (max-width: ${METRIC_BLOCK_DESKTOP_WIDTH * 2}px) {
    ${typography.sizeCSS.title};
    line-height: 38px;
    margin-bottom: 16px;
  }
`;

export const Description = styled.div`
  max-width: 424px;
  ${typography.sizeCSS.normal};
  margin-bottom: 32px;
`;

export const MetricsCount = styled.div`
  ${typography.sizeCSS.title};
  margin-bottom: 32px;

  span {
    color: ${palette.solid.blue};
  }

  @media only screen and (max-width: ${METRIC_BLOCK_DESKTOP_WIDTH * 2}px) {
    ${typography.sizeCSS.medium};
  }
`;

export const MetricsViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

export const CategorizedMetricsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media only screen and (max-width: ${METRIC_BLOCK_DESKTOP_WIDTH * 2}px) {
    margin-bottom: 9px;
  }
`;

export const CategoryTitle = styled.div`
  ${typography.sizeCSS.medium}
  margin-bottom: 16px;

  @media only screen and (max-width: ${METRIC_BLOCK_DESKTOP_WIDTH * 2}px) {
    ${typography.sizeCSS.small};
    color: ${palette.highlight.grey9};
    margin-bottom: 9px;
  }
`;

export const MetricsContainer = styled.div`
  display: flex;
  flex-direction: row;

  @media only screen and (max-width: ${METRIC_BLOCK_DESKTOP_WIDTH * 2}px) {
    margin-bottom: column;
  }
`;

export const MetricCategory = styled.div`
  height: 100px;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: ${palette.solid.blue};

  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;
