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
import styled from "styled-components/macro";

export const METRIC_BOX_DESKTOP_WIDTH = 280;

export const AgencyOverviewWrapper = styled.div`
  max-width: ${METRIC_BOX_DESKTOP_WIDTH * 4 + 48 + 1}px;
  margin: ${HEADER_BAR_HEIGHT + 96}px auto 64px auto;
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
  gap: 50px;
  padding-bottom: 96px;
  border-bottom: 1px solid ${palette.highlight.grey3};
  margin-bottom: 24px;
  position: relative;
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
  width: 50%;
`;

export const AgencyHomepage = styled.a`
  color: ${palette.solid.blue};
  text-decoration: none;
`;

export const MetricsViewContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const SystemChipsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 24px;
  margin-bottom: 64px;
`;

export const SystemChip = styled.div<{ active: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ active }) =>
    active ? palette.highlight.grey8 : palette.highlight.grey1};
  color: ${({ active }) =>
    active ? palette.solid.white : palette.highlight.grey8};
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

  &:last-child {
    margin-bottom: 0;
  }
`;

export const CategoryTitle = styled.div<{ hasHover?: boolean }>`
  ${typography.sizeCSS.large};
  margin-bottom: 8px;

  ${({ hasHover }) =>
    hasHover &&
    `&:hover {
    text-decoration: underline;
    cursor: pointer;
  }`}
`;

export const CategoryDescription = styled.div`
  ${typography.sizeCSS.normal};
  color: ${palette.highlight.grey8};
  margin-bottom: 32px;
`;

export const MetricsContainer = styled.div<{ hasHover?: boolean }>`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: fit-content;

  @media only screen and (max-width: ${METRIC_BOX_DESKTOP_WIDTH * 2 + 48}px) {
    max-width: 100%;
    flex-direction: column;
  }

  &:hover {
    & > div {
      background-color: ${({ hasHover }) =>
        hasHover ? palette.highlight.grey1 : palette.solid.white};
      cursor: ${({ hasHover }) => (hasHover ? "pointer" : "auto")};
    }
  }
`;

export const MetricBox = styled.div`
  width: ${METRIC_BOX_DESKTOP_WIDTH}px;
  max-width: ${METRIC_BOX_DESKTOP_WIDTH}px;
  height: 223px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  // dark grey palette color with 0.15 opacity converted to opaque color in order to look properly
  box-shadow: 1px 0 0 0 ${palette.solid.lightgrey},
    0 1px 0 0 ${palette.solid.lightgrey}, 1px 1px 0 0 ${palette.solid.lightgrey},
    1px 0 0 0 ${palette.solid.lightgrey} inset,
    0 1px 0 0 ${palette.solid.lightgrey} inset;
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

export const DemoLabel = styled.div`
  ${typography.sizeCSS.medium};
  width: fit-content;
  position: absolute;
  bottom: 0px;
  color: ${palette.solid.white};
  background: ${palette.solid.blue};
  padding: 8px 16px;
  margin-bottom: 28px;
`;
