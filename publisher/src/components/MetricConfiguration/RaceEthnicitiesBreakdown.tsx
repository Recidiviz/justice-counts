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

import React from "react";

import { ReactComponent as RightArrowIcon } from "../assets/right-arrow.svg";
import {
  CalloutBox,
  Description,
  EthnicitiesRow,
  Ethnicity,
  EthnicityCell,
  EthnicityLabel,
  GridEthnicitiesHeader,
  GridHeaderContainer,
  GridRaceHeader,
  RaceCell,
  RaceEthnicitiesBreakdownContainer,
  RaceEthnicitiesRow,
  RaceEthnicitiesTable,
  races,
} from ".";

export const RaceEthnicitiesBreakdown = () => {
  return (
    <RaceEthnicitiesBreakdownContainer>
      <CalloutBox>
        <Description>
          Answer the questions on the <span>Race and Ethnicity</span> form; the
          grid below will reflect your responses.
        </Description>

        <RightArrowIcon />
      </CalloutBox>

      <GridHeaderContainer>
        <GridRaceHeader>Race</GridRaceHeader>
        <GridEthnicitiesHeader>
          <EthnicityLabel>
            Ethnicity <RightArrowIcon />
          </EthnicityLabel>
          <Ethnicity>Hispanic</Ethnicity>
          <Ethnicity>Not Hispanic</Ethnicity>
          <Ethnicity>Unknown</Ethnicity>
        </GridEthnicitiesHeader>
      </GridHeaderContainer>

      <RaceEthnicitiesTable>
        {races.map((race, index) => (
          <RaceEthnicitiesRow key={race}>
            <RaceCell>{race}</RaceCell>
            <EthnicitiesRow>
              <EthnicityCell visible={index % 1 === 0} />
              <EthnicityCell />
              <EthnicityCell />
            </EthnicitiesRow>
          </RaceEthnicitiesRow>
        ))}
      </RaceEthnicitiesTable>
    </RaceEthnicitiesBreakdownContainer>
  );
};
