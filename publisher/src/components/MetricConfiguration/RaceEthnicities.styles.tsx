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

import { BinaryRadioGroupWrapper } from "../Forms";
import {
  baseDisabledFadedOverlayCSS,
  DefinitionDisplayName,
  DefinitionItem,
  Definitions,
  DefinitionsDescription,
  DefinitionsDisplayContainer,
  DefinitionSelection,
  DefinitionsTitle,
  MetricOnOffWrapper,
} from ".";

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
        opacity: 0.5;
      }
    `}

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    padding-top: 0;
  }
`;

export const CalloutBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 20px 60px 20px 20px;
  margin-bottom: 27px;
  border-radius: 2px;
  border: 1px solid ${palette.solid.blue};
  box-shadow: 0px 2px 4px rgba(0, 115, 229, 0.25);
  transition: 0.2s ease;

  svg {
    position: absolute;
    right: 20px;
  }

  &:hover {
    cursor: pointer;
    background-color: ${palette.highlight.blue};
  }
`;

export const GridHeaderContainer = styled.div`
  ${typography.sizeCSS.small}
  color: ${palette.highlight.grey5};
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
  gap: 7px;
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
  ${typography.sizeCSS.normal}

  span {
    color: ${palette.solid.blue};
  }
`;

export const RaceEthnicitiesTable = styled.div`
  width: 100%;
`;

export const RaceEthnicitiesRow = styled.div`
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
  gap: 70px;
`;
export const EthnicityCell = styled.div<{ enabled?: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid ${palette.highlight.grey4};
  ${({ enabled }) => enabled && `background: ${palette.solid.blue};`}
`;

export const SpecifyEthnicityWrapper = styled(MetricOnOffWrapper)`
  margin-bottom: 35px;
`;

export const RaceEthnicitiesContainer = styled(DefinitionsDisplayContainer)`
  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    padding-bottom: 0;
  }
`;

export const RaceEthnicitiesDisplay = styled.div<{ enabled?: boolean | null }>`
  width: 100%;
  position: relative;
  ${({ enabled }) => !enabled && baseDisabledFadedOverlayCSS}
`;

export const RaceEthnicitiesTitle = styled(DefinitionsTitle)``;
export const RaceEthnicitiesDescription = styled(DefinitionsDescription)`
  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    display: none;
  }
`;
export const RaceContainer = styled(Definitions)``;
export const RaceWrapper = styled(DefinitionItem)``;
export const RaceDisplayName = styled(DefinitionDisplayName)``;
export const RaceSelection = styled(DefinitionSelection)``;
export const RaceEthnicityRadioButtonGroupWrapper = styled(
  BinaryRadioGroupWrapper
)`
  display: flex;

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    gap: 4px;
    align-items: center;
  }
`;
