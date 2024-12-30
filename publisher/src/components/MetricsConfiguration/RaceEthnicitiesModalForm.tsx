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

import { ReactComponent as InfoIcon } from "@justice-counts/common/assets/info-icon.svg";
import { Button } from "@justice-counts/common/components/Button";
import {
  CheckboxOption,
  CheckboxOptions,
} from "@justice-counts/common/components/CheckboxOptions";
import {
  RadioButton,
  RadioButtonsWrapper,
} from "@justice-counts/common/components/RadioButton";
import { Tooltip } from "@justice-counts/common/components/Tooltip";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useStore } from "../../stores";
import {
  getActiveSystemMetricKey,
  useSettingsSearchParams,
} from "../AgencySettings";
import { RACE_ETHNICITY_DISAGGREGATION_KEY } from "./constants";
import * as Styled from "./ModalForm.styled";
import {
  Ethnicity,
  raceEthnicityGridStates,
} from "./RaceEthnicitiesGridStates";
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
    disaggregations,
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

  const hispanicOrLatinoOption: CheckboxOption | undefined =
    !canSpecifyEthnicity
      ? {
          key: Ethnicity.HISPANIC_OR_LATINO,
          label: Ethnicity.HISPANIC_OR_LATINO,
          checked: Boolean(specifiesHispanicAsRace),
          onChangeOverride: () => {
            if (!specifiesHispanicAsRace) {
              setRacesStatusObject({
                ...racesStatusObject,
                Unknown: true,
              });
            }
            setSpecifiesHispanicAsRace(!specifiesHispanicAsRace);
          },
        }
      : undefined;

  const systemMetricKey = getActiveSystemMetricKey(settingsSearchParams);

  const currentOtherDescription =
    disaggregations[systemMetricKey]?.[
      RACE_ETHNICITY_DISAGGREGATION_KEY
    ].contexts?.find((context) => context.key === "OTHER_RACE_DESCRIPTION")
      ?.value || "";

  const [otherDescription, setOtherDescription] = useState(
    currentOtherDescription
  );
  const [isOtherChecked, setOtherChecked] = useState(Boolean(otherDescription));

  useEffect(() => {
    setOtherDescription(currentOtherDescription);
  }, [currentOtherDescription]);

  useEffect(() => {
    setRacesStatusObject((prev) => ({
      ...prev,
      Other: Boolean(otherDescription),
    }));
  }, [otherDescription]);

  const raceEthnicityOptions: CheckboxOption[] = [
    ...(hispanicOrLatinoOption ? [hispanicOrLatinoOption] : []),
    ...Object.entries(racesStatusObject).map(([race, enabled]) => {
      const disabledUnknownRace =
        race === "Unknown" && specifiesHispanicAsRace && !canSpecifyEthnicity;

      if (race === "Other") {
        const otherDescriptionParams = {
          isEnabled: race === "Other" && isOtherChecked,
          placeholder:
            "Please describe additional definition/clarification of the 'Other' selection.",
          value: currentOtherDescription,
          onChange: (value: string) => setOtherDescription(value),
        };

        return {
          key: race,
          label: race,
          checked: Boolean(otherDescription),
          otherDescription: otherDescriptionParams,
        };
      }

      return {
        key: race,
        label: race,
        checked: Boolean(enabled),
        disabled: disabledUnknownRace,
        icon: disabledUnknownRace ? <InfoIcon id="unknown-race" /> : undefined,
      };
    }),
  ];

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
      metricSearchParam,
      otherDescription
    );
    saveMetricSettings(updatedDimensions, agencyId);
  };

  return (
    <Styled.Wrapper>
      <Styled.Content>
        <Styled.Header>
          Race & Ethnicity Form{" "}
          <Styled.CloseButton onClick={closeModal}>&#10005;</Styled.CloseButton>
        </Styled.Header>
        <Styled.ScrollableInnerWrapper>
          <Styled.Description>
            {RACE_ETHNICITIES_DESCRIPTION}
          </Styled.Description>
          <Styled.SpecifyEthnicityPrompt>
            Are you able to record an individual’s <strong>ethnicity</strong> (
            {Ethnicity.HISPANIC_OR_LATINO}, {Ethnicity.NOT_HISPANIC_OR_LATINO},
            or {Ethnicity.UNKNOWN_ETHNICITY}) separately from their race in your
            case management system?
          </Styled.SpecifyEthnicityPrompt>
          <RadioButtonsWrapper spacing={{ bottom: 32 }}>
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
          </RadioButtonsWrapper>
          <Styled.ToggleSwitchesListHeader>
            Which of the following categories does your case management system
            capture for race?
          </Styled.ToggleSwitchesListHeader>
          <Styled.CheckboxWrapper>
            <CheckboxOptions
              options={raceEthnicityOptions}
              onChange={({ key, checked }) => {
                if (key === "Other") {
                  setOtherChecked(!checked);

                  if (checked) {
                    // Clear otherDescription if "Other" is unchecked
                    setOtherDescription("");
                  }

                  setRacesStatusObject((prev) => ({
                    ...prev,
                    Other: Boolean(otherDescription),
                  }));
                } else {
                  setRacesStatusObject({
                    ...racesStatusObject,
                    [key]: !checked,
                  });
                }
              }}
            />
            <Tooltip
              anchorId="unknown-race"
              position="top-start"
              content="The Justice Counts data model requires the Unknown Race category to be turned on if the Hispanic or Latino Race category is turned on."
              noArrow
            />
          </Styled.CheckboxWrapper>
        </Styled.ScrollableInnerWrapper>
        <Styled.BottomButtonsContainer>
          <Button
            label="Save"
            onClick={() => {
              handleUpdateRacesDimensions();
              closeModal();
            }}
            buttonColor="blue"
          />
        </Styled.BottomButtonsContainer>
      </Styled.Content>
    </Styled.Wrapper>
  );
}

export default observer(RaceEthnicitiesModalForm);
