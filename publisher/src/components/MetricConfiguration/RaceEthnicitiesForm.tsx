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

import { debounce } from "lodash";
import { observer } from "mobx-react-lite";
import React, { useRef } from "react";
import { useParams } from "react-router-dom";

import { useStore } from "../../stores";
import { BinaryRadioButton } from "../Forms";
import { getActiveSystemMetricKey, useSettingsSearchParams } from "../Settings";
import {
  Header,
  Race,
  RaceContainer,
  RaceDisplayName,
  RaceEthnicitiesContainer,
  RaceEthnicitiesDescription,
  RaceEthnicitiesDisplay,
  RaceEthnicitiesTitle,
  raceEthnicityGridStates,
  RaceSelection,
  RadioButtonGroupWrapper,
  sortRaces,
  SpecifyEthnicityWrapper,
  Subheader,
} from ".";

export const RaceEthnicitiesForm = observer(() => {
  const { agencyId } = useParams();
  const [settingsSearchParams] = useSettingsSearchParams();
  const { metricConfigStore } = useStore();
  const {
    metrics,
    getEthnicitiesByRace,
    updateAllRaceEthnicitiesToDefaultState,
    updateRaceDimensions,
    saveMetricSettings,
  } = metricConfigStore;

  const { system: systemSearchParam, metric: metricSearchParam } =
    settingsSearchParams;

  const systemMetricKey = getActiveSystemMetricKey(settingsSearchParams);

  const ethnicitiesByRace =
    (systemSearchParam &&
      metricSearchParam &&
      getEthnicitiesByRace(systemSearchParam, metricSearchParam)) ||
    {};

  const ethnicitiesByRaceArray = Object.entries(ethnicitiesByRace);

  const canSpecifyEthnicity =
    ethnicitiesByRaceArray.filter(([_, ethnicities]) => {
      /** At least one Race where all three Ethnicities are enabled */
      return (
        ethnicities.Hispanic.enabled &&
        ethnicities["Not Hispanic"].enabled &&
        ethnicities["Unknown Ethnicity"].enabled
      );
    }).length > 0;

  const specifiesHispanicAsRace =
    ethnicitiesByRaceArray.filter(([race, ethnicities]) => {
      /** Unknown Race has both Hispanic and Not Hispanic enabled */
      return (
        race === "Unknown" &&
        ethnicities.Hispanic.enabled &&
        ethnicities["Not Hispanic"].enabled
      );
    }).length > 0;

  const determineCurrentState = () => {
    if (canSpecifyEthnicity) {
      return "CAN_SPECIFY_ETHNICITY";
    }
    if (specifiesHispanicAsRace) {
      return "NO_ETHNICITY_HISPANIC_AS_RACE";
    }
    return "NO_ETHNICITY_HISPANIC_NOT_SPECIFIED";
  };

  const currentState = determineCurrentState();

  const debouncedSave = useRef(debounce(saveMetricSettings, 1000)).current;

  return (
    <RaceEthnicitiesContainer>
      <RaceEthnicitiesDisplay enabled={metrics[systemMetricKey]?.enabled}>
        <RaceEthnicitiesTitle>Race and Ethnicity</RaceEthnicitiesTitle>

        <RaceEthnicitiesDescription>
          This breakdown asks for combinations of race and ethnicity, and should
          be based on what data is available via your case management system.
          Answering all of the questions below will fill out the grid for this
          breakdown.
        </RaceEthnicitiesDescription>

        <SpecifyEthnicityWrapper>
          <Header>
            Does your case management system allow you to specify an
            individual’s <strong>ethnicity</strong> (Hispanic, Non-Hispanic, or
            Unknown) for this metric?
          </Header>

          <RadioButtonGroupWrapper>
            <BinaryRadioButton
              type="radio"
              id="specify-ethnicity-yes"
              name="specify-ethnicity"
              label="Yes"
              value="yes"
              checked={canSpecifyEthnicity}
              onChange={() => {
                if (!systemSearchParam || !metricSearchParam) return;
                const updatedDimensions =
                  updateAllRaceEthnicitiesToDefaultState(
                    "CAN_SPECIFY_ETHNICITY",
                    raceEthnicityGridStates,
                    systemSearchParam,
                    metricSearchParam
                  );
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                debouncedSave(updatedDimensions, agencyId!);
              }}
            />
            <BinaryRadioButton
              type="radio"
              id="specify-ethnicity-no"
              name="specify-ethnicity"
              label="No"
              value="no"
              checked={!canSpecifyEthnicity}
              onChange={() => {
                if (!systemSearchParam || !metricSearchParam) return;
                const updatedDimensions =
                  updateAllRaceEthnicitiesToDefaultState(
                    "NO_ETHNICITY_HISPANIC_AS_RACE",
                    raceEthnicityGridStates,
                    systemSearchParam,
                    metricSearchParam
                  );
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                debouncedSave(updatedDimensions, agencyId!);
              }}
            />
          </RadioButtonGroupWrapper>
        </SpecifyEthnicityWrapper>

        <Header>
          Which of the following categories does your case management system
          capture for race?
        </Header>
        <Subheader>
          Fill out a response for each of the following race categories.
        </Subheader>

        <RaceContainer>
          {/* Hispanic/Latino as Race (if user cannot specify ethnicity) */}
          {!canSpecifyEthnicity && (
            <Race>
              <RaceDisplayName>Hispanic/Latino</RaceDisplayName>
              <RaceSelection>
                <RadioButtonGroupWrapper>
                  <BinaryRadioButton
                    type="radio"
                    id="hispanic-latino-no"
                    name="hispanic-latino"
                    label="No"
                    value="no"
                    checked={!specifiesHispanicAsRace}
                    lastOptionBlue
                    buttonSize="small"
                    onChange={() => {
                      if (!systemSearchParam || !metricSearchParam) return;
                      const updatedDimensions =
                        updateAllRaceEthnicitiesToDefaultState(
                          "NO_ETHNICITY_HISPANIC_NOT_SPECIFIED",
                          raceEthnicityGridStates,
                          systemSearchParam,
                          metricSearchParam
                        );
                      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                      debouncedSave(updatedDimensions, agencyId!);
                    }}
                  />
                  <BinaryRadioButton
                    type="radio"
                    id="hispanic-latino-yes"
                    name="hispanic-latino"
                    label="Yes"
                    value="yes"
                    checked={specifiesHispanicAsRace}
                    lastOptionBlue
                    buttonSize="small"
                    onChange={() => {
                      if (!systemSearchParam || !metricSearchParam) return;
                      const updatedDimensions =
                        updateAllRaceEthnicitiesToDefaultState(
                          "NO_ETHNICITY_HISPANIC_AS_RACE",
                          raceEthnicityGridStates,
                          systemSearchParam,
                          metricSearchParam
                        );
                      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                      debouncedSave(updatedDimensions, agencyId!);
                    }}
                  />
                </RadioButtonGroupWrapper>
              </RaceSelection>
            </Race>
          )}

          {/* Races (Enable/Disable) */}
          {Object.entries(ethnicitiesByRace)
            .sort(sortRaces)
            .map(([race, ethnicities]) => {
              const raceEnabled = Boolean(
                Object.values(ethnicities).find(
                  (ethnicity) => ethnicity.enabled
                )
              );

              return (
                <Race key={race}>
                  <RaceDisplayName>{race}</RaceDisplayName>
                  <RaceSelection>
                    <RadioButtonGroupWrapper>
                      <BinaryRadioButton
                        type="radio"
                        id={`${race}-no`}
                        name={`${race}`}
                        label="No"
                        value="no"
                        checked={!raceEnabled}
                        lastOptionBlue
                        buttonSize="small"
                        onChange={() => {
                          if (!systemSearchParam || !metricSearchParam) return;
                          /**
                           * When Unknown Race is disabled in NO_ETHNICITY_HISPANIC_AS_RACE state, we automatically switch
                           * to the NO_ETHNICITY_HISPANIC_NOT_SPECIFIED state because the Unknown Race (Hispanic/Latino Ethnicity)
                           * dimension is the only dimension an agency can specify their numbers for Hispanic/Latino as a Race (while
                           * in the NO_ETHNICITY_HISPANIC_AS_RACE state).
                           */
                          if (
                            race === "Unknown" &&
                            currentState === "NO_ETHNICITY_HISPANIC_AS_RACE"
                          ) {
                            updateAllRaceEthnicitiesToDefaultState(
                              "NO_ETHNICITY_HISPANIC_NOT_SPECIFIED",
                              raceEthnicityGridStates,
                              systemSearchParam,
                              metricSearchParam
                            );
                          }

                          const updatedDimensions = updateRaceDimensions(
                            race,
                            false,
                            currentState,
                            raceEthnicityGridStates,
                            systemSearchParam,
                            metricSearchParam
                          );
                          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                          debouncedSave(updatedDimensions, agencyId!);
                        }}
                      />
                      <BinaryRadioButton
                        type="radio"
                        id={`${race}-yes`}
                        name={`${race}`}
                        label="Yes"
                        value="yes"
                        checked={raceEnabled}
                        lastOptionBlue
                        buttonSize="small"
                        onChange={() => {
                          if (!systemSearchParam || !metricSearchParam) return;
                          const updatedDimensions = updateRaceDimensions(
                            race,
                            true,
                            currentState,
                            raceEthnicityGridStates,
                            systemSearchParam,
                            metricSearchParam
                          );
                          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                          debouncedSave(updatedDimensions, agencyId!);
                        }}
                      />
                    </RadioButtonGroupWrapper>
                  </RaceSelection>
                </Race>
              );
            })}
        </RaceContainer>
      </RaceEthnicitiesDisplay>
    </RaceEthnicitiesContainer>
  );
});
