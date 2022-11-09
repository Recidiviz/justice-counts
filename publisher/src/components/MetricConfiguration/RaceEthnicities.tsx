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
  races,
  RaceSelection,
  RaceSelectionButton,
  RadioButtonGroupWrapper,
  SpecifyEthnicityWrapper,
  Subheader,
} from ".";

export const RaceEthnicities = () => {
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
              id="metric-config-specify-ethnicity-yes"
              name="metric-config-specify-ethnicity"
              label="Yes"
              value="yes"
            />
            <BinaryRadioButton
              type="radio"
              id="metric-config-specify-ethnicity-no"
              name="metric-config-specify-ethnicity"
              label="No"
              value="no"
            />
          </RadioButtonGroupWrapper>
        </SpecifyEthnicityWrapper>

        <Header>
          Which of the following categories does that case management system
          capture for race?
        </Header>
        <Subheader>
          Fill out a response for each of the following race categories.
        </Subheader>

        <RaceContainer>
          {races.map((race) => (
            <Race key={race}>
              <RaceDisplayName>{race}</RaceDisplayName>
              <RaceSelection>
                <RaceSelectionButton>No</RaceSelectionButton>
                <RaceSelectionButton>Yes</RaceSelectionButton>
              </RaceSelection>
            </Race>
          ))}
        </RaceContainer>
      </RaceEthnicitiesDisplay>
    </RaceEthnicitiesContainer>
  );
};
