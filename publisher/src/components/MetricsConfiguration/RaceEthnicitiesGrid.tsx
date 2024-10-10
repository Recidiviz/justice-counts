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

import { observer } from "mobx-react-lite";
import React from "react";

import { useStore } from "../../stores";
import { useSettingsSearchParams } from "../AgencySettings";
import { ReactComponent as RightArrowIcon } from "../assets/right-arrow.svg";
import * as Styled from "./RaceEthnicitiesGrid.styled";
import { Ethnicity } from "./RaceEthnicitiesGridStates";
import { sortRaces } from "./utils";

export const RaceEthnicitiesGrid: React.FC<{
  disaggregationEnabled: boolean;
  isMetricEnabled: boolean;
  onClick: () => void;
}> = observer(({ disaggregationEnabled, isMetricEnabled, onClick }) => {
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
    <Styled.RaceEthnicitiesBreakdownContainer
      disaggregationEnabled={disaggregationEnabled}
    >
      <Styled.CalloutBox
        onClick={() => {
          if (isMetricEnabled) {
            onClick();
          }
        }}
        isMetricEnabled={isMetricEnabled}
      >
        <Styled.Description>
          Answer the questions on the <span>Race and Ethnicity</span> form; the
          grid below will reflect your responses.
        </Styled.Description>
        <RightArrowIcon />
      </Styled.CalloutBox>

      <Styled.GridHeaderContainer>
        <Styled.GridRaceHeader>Race</Styled.GridRaceHeader>
        <Styled.GridEthnicitiesHeader>
          <Styled.EthnicityLabel>
            Ethnicity <RightArrowIcon />
          </Styled.EthnicityLabel>
          <Styled.EthnicityName>
            {Ethnicity.HISPANIC_OR_LATINO}
          </Styled.EthnicityName>
          <Styled.EthnicityName>
            {Ethnicity.NOT_HISPANIC_OR_LATINO}
          </Styled.EthnicityName>
          <Styled.EthnicityName>
            {Ethnicity.UNKNOWN_ETHNICITY}
          </Styled.EthnicityName>
        </Styled.GridEthnicitiesHeader>
      </Styled.GridHeaderContainer>

      <Styled.RaceEthnicitiesTable>
        {Object.entries(ethnicitiesByRace)
          .sort(sortRaces)
          .map(([race, ethnicities]) => (
            <Styled.RaceEthnicitiesRow key={race}>
              <Styled.RaceCell>{race}</Styled.RaceCell>
              <Styled.EthnicitiesRow>
                {Object.values(ethnicities).map((ethnicity) => (
                  <Styled.EthnicityCell
                    key={ethnicity.key}
                    enabled={ethnicity.enabled}
                  />
                ))}
              </Styled.EthnicitiesRow>
            </Styled.RaceEthnicitiesRow>
          ))}
      </Styled.RaceEthnicitiesTable>
    </Styled.RaceEthnicitiesBreakdownContainer>
  );
});
