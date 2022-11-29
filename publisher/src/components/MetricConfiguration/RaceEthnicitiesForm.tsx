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

import { observer } from "mobx-react-lite";
import React from "react";
import { useParams } from "react-router-dom";

import { useStore } from "../../stores";
import { BinaryRadioButton } from "../Forms";
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
  RaceSelectionButton,
  RadioButtonGroupWrapper,
  SpecifyEthnicityWrapper,
  Subheader,
} from ".";

export const RaceEthnicitiesForm = observer(() => {
  const { agencyId } = useParams();
  const { metricConfigStore } = useStore();
  const {
    ethnicitiesByRace,
    updateAllRaceEthnicitiesToDefaultState,
    updateRaceDimensions,
    saveMetricSettings,
  } = metricConfigStore;
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

  return (
    <RaceEthnicitiesContainer>
      <RaceEthnicitiesDisplay>
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
                const updatedDimensions =
                  updateAllRaceEthnicitiesToDefaultState(
                    "CAN_SPECIFY_ETHNICITY",
                    raceEthnicityGridStates
                  );
                saveMetricSettings(updatedDimensions, agencyId);
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
                const updatedDimensions =
                  updateAllRaceEthnicitiesToDefaultState(
                    "NO_ETHNICITY_HISPANIC_AS_RACE",
                    raceEthnicityGridStates
                  );
                saveMetricSettings(updatedDimensions, agencyId);
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
                <RaceSelectionButton
                  selected={!specifiesHispanicAsRace}
                  onClick={() => {
                    const updatedDimensions =
                      updateAllRaceEthnicitiesToDefaultState(
                        "NO_ETHNICITY_HISPANIC_NOT_SPECIFIED",
                        raceEthnicityGridStates
                      );
                    saveMetricSettings(updatedDimensions, agencyId);
                  }}
                >
                  No
                </RaceSelectionButton>
                <RaceSelectionButton
                  selected={specifiesHispanicAsRace}
                  onClick={() => {
                    const updatedDimensions =
                      updateAllRaceEthnicitiesToDefaultState(
                        "NO_ETHNICITY_HISPANIC_AS_RACE",
                        raceEthnicityGridStates
                      );
                    saveMetricSettings(updatedDimensions, agencyId);
                  }}
                >
                  Yes
                </RaceSelectionButton>
              </RaceSelection>
            </Race>
          )}

          {/* Races (Enable/Disable) */}
          {Object.entries(ethnicitiesByRace).map(([race, ethnicities]) => {
            const raceEnabled = Boolean(
              Object.values(ethnicities).find((ethnicity) => ethnicity.enabled)
            );

            return (
              <Race key={race}>
                <RaceDisplayName>{race}</RaceDisplayName>
                <RaceSelection>
                  <RaceSelectionButton
                    selected={!raceEnabled}
                    onClick={() => {
                      let switchedGridStateUpdatedDimensions;
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
                        switchedGridStateUpdatedDimensions =
                          updateAllRaceEthnicitiesToDefaultState(
                            "NO_ETHNICITY_HISPANIC_NOT_SPECIFIED",
                            raceEthnicityGridStates
                          );
                      }

                      const updatedDimensions = updateRaceDimensions(
                        race,
                        false,
                        currentState,
                        raceEthnicityGridStates
                      );

                      if (switchedGridStateUpdatedDimensions) {
                        /** Add the updated dimension from disabling the Unknown race to the switchedGridStateUpdatedDimensions */
                        switchedGridStateUpdatedDimensions.disaggregations[0].dimensions.push(
                          ...updatedDimensions.disaggregations[0].dimensions
                        );
                        return saveMetricSettings(
                          switchedGridStateUpdatedDimensions,
                          agencyId
                        );
                      }
                      saveMetricSettings(updatedDimensions, agencyId);
                    }}
                  >
                    No
                  </RaceSelectionButton>
                  <RaceSelectionButton
                    selected={raceEnabled}
                    onClick={() => {
                      const updatedDimensions = updateRaceDimensions(
                        race,
                        true,
                        currentState,
                        raceEthnicityGridStates
                      );
                      saveMetricSettings(updatedDimensions, agencyId);
                    }}
                  >
                    Yes
                  </RaceSelectionButton>
                </RaceSelection>
              </Race>
            );
          })}
        </RaceContainer>
      </RaceEthnicitiesDisplay>
    </RaceEthnicitiesContainer>
  );
});
