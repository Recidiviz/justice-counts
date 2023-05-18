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

import blueCheckIcon from "@justice-counts/common/assets/status-check-icon.png";
import { Button } from "@justice-counts/common/components/Button";
import { RadioButton } from "@justice-counts/common/components/RadioButton";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { useParams } from "react-router-dom";

import { useStore } from "../../stores";
import { useSettingsSearchParams } from "../Settings";
import {
  Ethnicity,
  raceEthnicityGridStates,
} from "./RaceEthnicitiesGridStates";
import * as Styled from "./RaceEthnicitiesModalForm.styled";
import { sortRaces } from "./utils";

export const RACE_ETHNICITIES_DESCRIPTION =
  "This breakdown asks for combinations of race and ethnicity, and should be based on what data is available via your case management system. Answering all of the questions below will fill out the grid for this breakdown.";

type RaceEthnicitiesModalFormProps = {
  closeModal: () => void;
};

function RaceEthnicitiesModalForm({
  closeModal,
}: RaceEthnicitiesModalFormProps) {
  const { agencyId } = useParams() as { agencyId: string };
  const [settingsSearchParams] = useSettingsSearchParams();
  const { metricConfigStore } = useStore();
  const {
    getEthnicitiesByRace,
    updateRacesDimensions,
    updateAllRaceEthnicitiesToDefaultState,
    saveMetricSettings,
  } = metricConfigStore;
  const { system: systemSearchParam, metric: metricSearchParam } =
    settingsSearchParams;

  const ethnicitiesByRace =
    (systemSearchParam &&
      metricSearchParam &&
      getEthnicitiesByRace(systemSearchParam, metricSearchParam)) ||
    {};
  const ethnicitiesByRaceArray = Object.entries(ethnicitiesByRace);

  const [canSpecifyEthnicity, setCanSpecifyEthnicity] = useState(
    ethnicitiesByRaceArray.filter(([_, ethnicities]) => {
      /** At least one Race where all three Ethnicities are enabled */
      return (
        ethnicities[Ethnicity.HISPANIC_OR_LATINO].enabled &&
        ethnicities[Ethnicity.NOT_HISPANIC_OR_LATINO].enabled &&
        ethnicities[Ethnicity.UNKNOWN_ETHNICITY].enabled
      );
    }).length > 0
  );
  const [specifiesHispanicAsRace, setSpecifiesHispanicAsRace] = useState(
    ethnicitiesByRaceArray.filter(([race, ethnicities]) => {
      /** Unknown Race has both Hispanic and Not Hispanic enabled */
      return (
        race === "Unknown" &&
        ethnicities[Ethnicity.HISPANIC_OR_LATINO].enabled &&
        ethnicities[Ethnicity.NOT_HISPANIC_OR_LATINO].enabled
      );
    }).length > 0
  );
  const [racesStatusObject, setRacesStatusObject] = useState(
    Object.entries(ethnicitiesByRace)
      .sort(sortRaces)
      .reduce((acc, [race, ethnicities]) => {
        const raceEnabled = Boolean(
          Object.values(ethnicities).find((ethnicity) => ethnicity.enabled)
        );

        return { ...acc, [race]: raceEnabled };
      }, {})
  );

  const determineCurrentState = () => {
    if (canSpecifyEthnicity) {
      return "CAN_SPECIFY_ETHNICITY";
    }
    if (specifiesHispanicAsRace) {
      return "NO_ETHNICITY_HISPANIC_AS_RACE";
    }
    return "NO_ETHNICITY_HISPANIC_NOT_SPECIFIED";
  };

  const handleUpdateRacesDimensions = () => {
    if (!systemSearchParam || !metricSearchParam) return;
    const currentState = determineCurrentState();

    updateAllRaceEthnicitiesToDefaultState(
      currentState,
      raceEthnicityGridStates,
      systemSearchParam,
      metricSearchParam
    );

    const updatedDimensions = updateRacesDimensions(
      racesStatusObject,
      currentState,
      raceEthnicityGridStates,
      systemSearchParam,
      metricSearchParam
    );
    saveMetricSettings(updatedDimensions, agencyId);
  };

  return (
    <Styled.Wrapper>
      <Styled.InnerWrapper>
        <Styled.Header>Breakdown</Styled.Header>
        <Styled.Title>Race & Ethnicity Form</Styled.Title>
        <Styled.Description>{RACE_ETHNICITIES_DESCRIPTION}</Styled.Description>
        <Styled.SpecifyEthnicityPrompt>
          Are you able to record an individual’s <strong>ethnicity</strong> (
          {Ethnicity.HISPANIC_OR_LATINO}, {Ethnicity.NOT_HISPANIC_OR_LATINO}, or{" "}
          {Ethnicity.UNKNOWN_ETHNICITY}) separately from their race in your case
          management system?
        </Styled.SpecifyEthnicityPrompt>
        <Styled.SpecifyEthnicityButtonsContainer>
          <RadioButton
            type="radio"
            id="specify-ethnicity-yes"
            name="specify-ethnicity"
            label="Yes"
            value="yes"
            checked={canSpecifyEthnicity}
            onChange={() => setCanSpecifyEthnicity(true)}
          />
          <RadioButton
            type="radio"
            id="specify-ethnicity-no"
            name="specify-ethnicity"
            label="No"
            value="no"
            checked={!canSpecifyEthnicity}
            onChange={() => setCanSpecifyEthnicity(false)}
          />
        </Styled.SpecifyEthnicityButtonsContainer>
        <Styled.RaceListHeader>
          Which of the following categories does your case management system
          capture for race?
        </Styled.RaceListHeader>
        <Styled.RaceList>
          {!canSpecifyEthnicity && (
            <Styled.RaceListItem
              onClick={() => {
                if (!specifiesHispanicAsRace) {
                  setRacesStatusObject({ ...racesStatusObject, Unknown: true });
                }
                setSpecifiesHispanicAsRace(!specifiesHispanicAsRace);
              }}
            >
              {specifiesHispanicAsRace ? (
                <Styled.EnabledRaceIcon src={blueCheckIcon} alt="" />
              ) : (
                <Styled.DisabledRaceIcon />
              )}
              {Ethnicity.HISPANIC_OR_LATINO}
            </Styled.RaceListItem>
          )}
          {Object.entries(racesStatusObject).map(([race, enabled]) => (
            <Styled.RaceListItem
              key={race}
              onClick={() => {
                if (race === "Unknown" && enabled && !canSpecifyEthnicity) {
                  setSpecifiesHispanicAsRace(false);
                }
                setRacesStatusObject({
                  ...racesStatusObject,
                  [race]: !enabled,
                });
              }}
            >
              {enabled ? (
                <Styled.EnabledRaceIcon src={blueCheckIcon} alt="" />
              ) : (
                <Styled.DisabledRaceIcon />
              )}{" "}
              {race}
            </Styled.RaceListItem>
          ))}
        </Styled.RaceList>
        <Styled.BottomButtonsContainer>
          <Button label="Cancel" onClick={closeModal} />
          <Button
            label="Save"
            onClick={() => {
              handleUpdateRacesDimensions();
              closeModal();
            }}
            buttonColor="blue"
          />
        </Styled.BottomButtonsContainer>
      </Styled.InnerWrapper>
    </Styled.Wrapper>
  );
}

export default observer(RaceEthnicitiesModalForm);
