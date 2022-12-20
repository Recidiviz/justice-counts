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

export const METRIC_BOX_DESKTOP_WIDTH = 280;

export const AgencyOverviewWrapper = styled.div`
  max-width: ${METRIC_BOX_DESKTOP_WIDTH * 4 + 48 + 1}px;
  margin: ${HEADER_BAR_HEIGHT + 14}px auto;
  display: flex;
  flex-direction: column;
  padding: 0 24px 73px 24px;

  @media only screen and (max-width: ${METRIC_BOX_DESKTOP_WIDTH * 2 + 48}px) {
    max-width: 320px;
    padding: 0 17px 50px 8px;
  }
`;

export const PageTitle = styled.div`
  ${typography.sizeCSS.medium};
  margin-bottom: 24px;

  @media only screen and (max-width: ${METRIC_BOX_DESKTOP_WIDTH * 2 + 48}px) {
    ${typography.sizeCSS.normal};
    margin-bottom: 16px;
  }
`;

export const AgencyTitle = styled.div`
  ${typography.sizeCSS.headline};
  margin-bottom: 24px;

  @media only screen and (max-width: ${METRIC_BOX_DESKTOP_WIDTH * 2 + 48}px) {
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

  @media only screen and (max-width: ${METRIC_BOX_DESKTOP_WIDTH * 2 + 48}px) {
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

  @media only screen and (max-width: ${METRIC_BOX_DESKTOP_WIDTH * 2 + 48}px) {
    margin-bottom: 9px;
  }
`;

export const CategoryTitle = styled.div`
  ${typography.sizeCSS.medium}
  max-width: ${METRIC_BOX_DESKTOP_WIDTH}px;

  @media only screen and (max-width: ${METRIC_BOX_DESKTOP_WIDTH * 2 + 48}px) {
    ${typography.sizeCSS.small};
    color: ${palette.highlight.grey9};
  }
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
    flex-direction: column;
    border-left: none;
    border-top: none;
  }
`;

export const MetricBox = styled.div<{ isPublished: boolean }>`
  width: 280px;
  max-width: 280px;
  height: 352px;
  padding: 5px 14px 14px 14px;
  border-right: 1px solid ${palette.highlight.grey3};
  border-bottom: 1px solid ${palette.highlight.grey3};

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  ${({ isPublished }) =>
    isPublished &&
    `&:hover {
    cursor: pointer;
    background-color: ${palette.solid.blue};
    border-right: 1px solid ${palette.solid.blue};
    border-bottom: 1px solid ${palette.solid.blue};
    box-shadow: -1px -1px ${palette.solid.blue}, 0 -1px ${palette.solid.blue},
      -1px 0 ${palette.solid.blue};
    color: ${palette.solid.white};
  }`}

  @media only screen and (max-width: ${METRIC_BOX_DESKTOP_WIDTH * 2 + 48}px) {
    border-right: none;
    border-bottom: none;

    height: auto;
    padding: 6px 0;
    border-top: 1px solid ${palette.solid.darkgrey};
    flex-direction: row;
    justify-content: space-between;

    ${({ isPublished }) =>
      isPublished &&
      `&:hover {
        cursor: pointer;
        background-color: transparent;
        border-right: none;
        border-bottom: none;
        box-shadow: none;
        color: ${palette.solid.darkgrey};
    }`}
  }
`;

export const MetricBoxTitle = styled.div<{ isPublished: boolean }>`
  ${typography.sizeCSS.title};
  color: ${({ isPublished }) => !isPublished && palette.highlight.grey8};

  @media only screen and (max-width: ${METRIC_BOX_DESKTOP_WIDTH * 2 + 48}px) {
    width: 135px;
    ${typography.sizeCSS.medium};
  }
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
  gap: 8px;
  margin-bottom: 58px;

  @media only screen and (max-width: ${METRIC_BOX_DESKTOP_WIDTH * 2 + 48}px) {
    margin-bottom: 0;
  }
`;

// remove border after actual graph implemented
export const MetricBoxGraphImage = styled.img`
  width: 128px;
  height: 85px;
  filter: brightness(0) invert(0.8);

  ${MetricBox}:hover & {
    filter: none;
  }

  @media only screen and (max-width: ${METRIC_BOX_DESKTOP_WIDTH * 2 + 48}px) {
    width: 38px;
    height: 24px;

    ${MetricBox}:hover & {
      filter: brightness(0) invert(0.8);
    }
  }
`;

export const MetricBoxGraphLastUpdate = styled.div`
  ${typography.sizeCSS.small};

  @media only screen and (max-width: ${METRIC_BOX_DESKTOP_WIDTH * 2 + 48}px) {
    display: none;
  }
`;

export const MetricBoxFooter = styled.div<{ isPublished: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  ${typography.sizeCSS.medium};
  color: ${({ isPublished }) => !isPublished && palette.highlight.grey8};

  img {
    transform: rotate(180deg);

    ${MetricBox}:hover & {
      filter: brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%)
        hue-rotate(261deg) brightness(108%) contrast(101%);
    }
  }

  @media only screen and (max-width: ${METRIC_BOX_DESKTOP_WIDTH * 2 + 48}px) {
    display: ${({ isPublished }) => isPublished && "none"};
    ${typography.sizeCSS.small};
    align-items: start;
  }
`;
