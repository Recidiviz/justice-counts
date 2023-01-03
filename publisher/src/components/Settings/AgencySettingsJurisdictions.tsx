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

import React, { useState } from "react";

import rightArrow from "../assets/right-arrow.svg";
import blueCheck from "../assets/status-check-icon.png";
import {
  BlueCheckIcon,
  Checkbox,
  CheckboxWrapper,
} from "../MetricConfiguration";
import { SettingProps } from "./AgencySettings";
import {
  AddJurisdictionsExclusionsLink,
  AgencySettingsBlock,
  AgencySettingsBlockDescription,
  AgencySettingsBlockSubDescription,
  AgencySettingsBlockTitle,
  AgencySettingsInfoRow,
  EditButton,
  EditButtonContainer,
  EditModeButtonsContainer,
  FilledButton,
  JurisdictionCheckBlock,
  JurisdictionsEditModeFooter,
  JurisdictionsEditModeFooterLeftBlock,
  JurisdictionsInput,
  TransparentButton,
} from "./AgencySettings.styles";

const includedJurisdictionsMock = [
  { type: "County", name: "Thurston County", state: "WA" },
  { type: "State", name: "California", state: null },
  { type: "City", name: "Pittsburgh", state: "CA" },
];

const excludedJurisdictionsMock = [
  { type: "City", name: "Piano", state: "CA" },
];

export const AgencySettingsJurisdictions: React.FC<{
  settingProps: SettingProps;
}> = ({ settingProps }) => {
  const {
    isSettingInEditMode,
    openSetting,
    closeSetting,
    showAnimation,
    removeAnimation,
  } = settingProps;

  const [searchValue, setSearchValue] = useState("");
  const [checkedJurisdictions, setCheckedJurisdictions] = useState<string[]>(
    []
  );

  return (
    <AgencySettingsBlock
      id="jurisdictions"
      editMode={isSettingInEditMode}
      showAnimation={showAnimation}
      onAnimationEnd={removeAnimation}
    >
      <AgencySettingsBlockTitle>Jurisdictions</AgencySettingsBlockTitle>
      {isSettingInEditMode ? (
        <>
          <AgencySettingsBlockDescription>
            Select the appropriate geographic area that corresponds with your
            agency. You can indicate multiple cities, counties, states, or other
            census areas that fall within your agency’s jurisdiction, or the
            ones that are excluded from your agency.
          </AgencySettingsBlockDescription>
          <JurisdictionsInput
            isEmpty={!searchValue}
            placeholder="Type in the name of your jurisdiction (for example, Thurston County)"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          {includedJurisdictionsMock.length > 0 && (
            <AgencySettingsBlockSubDescription>
              Areas included
            </AgencySettingsBlockSubDescription>
          )}
          {includedJurisdictionsMock.map(({ type, name, state }) => (
            <AgencySettingsInfoRow key={name}>
              {`${name}${state ? `, ${state}` : ""}`}
              <JurisdictionCheckBlock>
                {type}
                <CheckboxWrapper>
                  <Checkbox
                    type="checkbox"
                    checked={checkedJurisdictions.includes(name)}
                    onChange={() =>
                      setCheckedJurisdictions(
                        checkedJurisdictions.includes(name)
                          ? checkedJurisdictions.filter(
                              (jurisdiction) => jurisdiction !== name
                            )
                          : [...checkedJurisdictions, name]
                      )
                    }
                  />
                  <BlueCheckIcon src={blueCheck} alt="" enabled />
                </CheckboxWrapper>
              </JurisdictionCheckBlock>
            </AgencySettingsInfoRow>
          ))}
          {excludedJurisdictionsMock.length > 0 && (
            <AgencySettingsBlockSubDescription
              hasTopMargin={includedJurisdictionsMock.length > 0}
            >
              Areas excluded
            </AgencySettingsBlockSubDescription>
          )}
          {excludedJurisdictionsMock.map(({ type, name, state }) => (
            <AgencySettingsInfoRow key={name}>
              {`${name}${state ? `, ${state}` : ""}`}
              <JurisdictionCheckBlock>
                {type}
                <CheckboxWrapper>
                  <Checkbox
                    type="checkbox"
                    checked={checkedJurisdictions.includes(name)}
                    onChange={() =>
                      setCheckedJurisdictions(
                        checkedJurisdictions.includes(name)
                          ? checkedJurisdictions.filter(
                              (jurisdiction) => jurisdiction !== name
                            )
                          : [...checkedJurisdictions, name]
                      )
                    }
                  />
                  <BlueCheckIcon src={blueCheck} alt="" enabled />
                </CheckboxWrapper>
              </JurisdictionCheckBlock>
            </AgencySettingsInfoRow>
          ))}
          <JurisdictionsEditModeFooter>
            <JurisdictionsEditModeFooterLeftBlock>
              Need exclusions?{" "}
              <AddJurisdictionsExclusionsLink>
                Add them
              </AddJurisdictionsExclusionsLink>
            </JurisdictionsEditModeFooterLeftBlock>
            {checkedJurisdictions.length === 0 ? (
              <EditModeButtonsContainer>
                <TransparentButton onClick={closeSetting}>
                  Cancel
                </TransparentButton>
                <FilledButton onClick={closeSetting}>Save</FilledButton>
              </EditModeButtonsContainer>
            ) : (
              <EditModeButtonsContainer>
                <TransparentButton
                  color="blue"
                  onClick={() => setCheckedJurisdictions([])}
                >
                  Cancel
                </TransparentButton>
                <TransparentButton
                  color="red"
                  onClick={() => setCheckedJurisdictions([])}
                >
                  Remove
                </TransparentButton>
              </EditModeButtonsContainer>
            )}
          </JurisdictionsEditModeFooter>
        </>
      ) : (
        <>
          <AgencySettingsBlockDescription>
            The following are within the agency’s jurisdiction.
          </AgencySettingsBlockDescription>
          {includedJurisdictionsMock.length > 0 && (
            <AgencySettingsBlockSubDescription>
              Areas included
            </AgencySettingsBlockSubDescription>
          )}
          {includedJurisdictionsMock.map(({ type, name, state }) => (
            <AgencySettingsInfoRow key={name}>
              {`${name}${state ? `, ${state}` : ""}`}
              <span>{type}</span>
            </AgencySettingsInfoRow>
          ))}
          {excludedJurisdictionsMock.length > 0 && (
            <AgencySettingsBlockSubDescription
              hasTopMargin={includedJurisdictionsMock.length > 0}
            >
              Areas excluded
            </AgencySettingsBlockSubDescription>
          )}
          {excludedJurisdictionsMock.map(({ type, name, state }) => (
            <AgencySettingsInfoRow key={name}>
              {`${name}${state ? `, ${state}` : ""}`}
              <span>{type}</span>
            </AgencySettingsInfoRow>
          ))}
          <EditButtonContainer>
            <EditButton onClick={openSetting}>
              Edit jurisdictions
              <img src={rightArrow} alt="" />
            </EditButton>
          </EditButtonContainer>
        </>
      )}
    </AgencySettingsBlock>
  );
};
