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

import { observer } from "mobx-react-lite";
import React from "react";

import { useStore } from "../../stores";
import { ReactComponent as RightArrowIcon } from "../assets/right-arrow.svg";
import { useSettingsSearchParams } from "../Settings";
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
  sortRaces,
} from ".";

export const RaceEthnicitiesGrid: React.FC<{
  disaggregationEnabled: boolean;
  onClick: () => void;
}> = observer(({ disaggregationEnabled, onClick }) => {
  const [settingsSearchParams] = useSettingsSearchParams();
  const { metricConfigStore } = useStore();
  const { getEthnicitiesByRace } = metricConfigStore;

  const { system: systemSearchParam, metric: metricSearchParam } =
    settingsSearchParams;
  const ethnicitiesByRace =
    (systemSearchParam &&
      metricSearchParam &&
      getEthnicitiesByRace(systemSearchParam, metricSearchParam)) ||
    {};

  return (
    <RaceEthnicitiesBreakdownContainer
      disaggregationEnabled={disaggregationEnabled}
    >
      <CalloutBox onClick={onClick}>
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
          <Ethnicity>Hispanic or Latino</Ethnicity>
          <Ethnicity>Not Hispanic</Ethnicity>
          <Ethnicity>Unknown</Ethnicity>
        </GridEthnicitiesHeader>
      </GridHeaderContainer>

      <RaceEthnicitiesTable>
        {Object.entries(ethnicitiesByRace)
          .sort(sortRaces)
          .map(([race, ethnicities]) => (
            <RaceEthnicitiesRow key={race}>
              <RaceCell>{race}</RaceCell>
              <EthnicitiesRow>
                {Object.values(ethnicities).map((ethnicity) => (
                  <EthnicityCell
                    key={ethnicity.key}
                    enabled={ethnicity.enabled}
                  />
                ))}
              </EthnicitiesRow>
            </RaceEthnicitiesRow>
          ))}
      </RaceEthnicitiesTable>
    </RaceEthnicitiesBreakdownContainer>
  );
});
