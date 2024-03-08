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
  MIN_TABLET_WIDTH,
  palette,
  typography,
} from "@justice-counts/common/components/GlobalStyles";
import styled, { css } from "styled-components/macro";

export const RaceEthnicitiesBreakdownContainer = styled.div<{
  disaggregationEnabled?: boolean;
}>`
  padding-top: 14px;
  position: relative;

  ${({ disaggregationEnabled }) =>
    !disaggregationEnabled &&
    css`
      &::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        background: ${palette.solid.white};
        opacity: 0.6;
      }
    `};
  @media only screen and(max-width: ${MIN_TABLET_WIDTH}px) {
    padding-top: 0;
  }
`;

export const CalloutBox = styled.div<{ isMetricEnabled: boolean }>`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 20px 60px 20px 20px;
  margin-bottom: 27px;
  border-radius: 2px;
  border: 1px solid ${palette.solid.blue};
  transition: 0.2s ease;

  svg {
    position: absolute;
    right: 20px;
  }

  &:hover {
    cursor: pointer;
    background-color: ${palette.solid.lightgrey2};
  }

  ${({ isMetricEnabled }) =>
    !isMetricEnabled &&
    `
      opacity: 0.7;

      &:hover {
        cursor: unset;  
        background-color: unset;
      }
  `}
`;

export const GridHeaderContainer = styled.div`
  ${typography.sizeCSS.small}
  font-weight: 500;
  color: ${palette.highlight.grey8};
  width: 100%;
  display: flex;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid ${palette.highlight.grey4};
`;

export const GridRaceHeader = styled.div`
  width: 100%;
`;
export const GridEthnicitiesHeader = styled.div`
  display: flex;
  gap: 30px;
  justify-content: space-between;
`;

export const EthnicityLabel = styled.div`
  width: 100%;
  display: flex;
  align-items: center;

  svg {
    margin-left: 3px;
    width: 10px;

    path {
      fill: ${palette.highlight.grey5};
    }
  }
`;

export const EthnicityName = styled.div`
  color: ${palette.solid.darkgrey};
  text-align: center;
  min-width: 80px;
`;

export const Description = styled.div`
  ${typography.body}
  span {
    color: ${palette.solid.blue};
  }
`;

export const RaceEthnicitiesTable = styled.div`
  width: 100%;
`;

export const RaceEthnicitiesRow = styled.div`
  ${typography.body}
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;

  &:not(:last-child) {
    border-bottom: 1px solid ${palette.highlight.grey4};
  }
`;

export const RaceCell = styled.div``;

export const EthnicitiesRow = styled.div`
  display: flex;
  margin-right: 28px;
  gap: 90px;
`;
export const EthnicityCell = styled.div<{ enabled?: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid ${palette.highlight.grey4};
  ${({ enabled }) => enabled && `background: ${palette.solid.blue};`}
`;

export const RaceWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;
