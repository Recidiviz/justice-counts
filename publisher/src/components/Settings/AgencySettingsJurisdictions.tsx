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

import blueCheck from "@justice-counts/common/assets/status-check-icon.png";
import React, { useState } from "react";

import rightArrow from "../assets/right-arrow.svg";
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
  JurisdictionsInputWrapper,
  JurisdictionsSearchResult,
  JurisdictionsSearchResultContainer,
  TransparentButton,
} from "./AgencySettings.styles";
import { AgencySettingsConfirmModal } from "./AgencySettingsConfirmModal";

const includedJurisdictionsMock = [
  { state: "FL", name: "St. Lucie", type: "County" },
  { state: "FL", name: "Suwannee", type: "County" },
  { state: "GA", name: "Ben Hill", type: "County" },
];

const excludedJurisdictionsMock = [
  { state: "FL", name: "Washington", type: "County" },
];

const jurisdictionsMock = [
  { state: "FL", name: "St. Lucie", type: "County" },
  { state: "FL", name: "Santa Rosa", type: "County" },
  { state: "FL", name: "Sarasota", type: "County" },
  { state: "FL", name: "Seminole", type: "County" },
  { state: "FL", name: "Sumter", type: "County" },
  { state: "FL", name: "Suwannee", type: "County" },
  { state: "FL", name: "Taylor", type: "County" },
  { state: "FL", name: "Union", type: "County" },
  { state: "FL", name: "Volusia", type: "County" },
  { state: "FL", name: "Wakulla", type: "County" },
  { state: "FL", name: "Walton", type: "County" },
  { state: "FL", name: "Washington", type: "County" },
  { state: "GA", name: "Appling", type: "County" },
  { state: "GA", name: "Atkinson", type: "County" },
  { state: "GA", name: "Bacon", type: "County" },
  { state: "GA", name: "Baker", type: "County" },
  { state: "GA", name: "Baldwin", type: "County" },
  { state: "GA", name: "Banks", type: "County" },
  { state: "GA", name: "Barrow", type: "County" },
  { state: "GA", name: "Bartow", type: "County" },
  { state: "GA", name: "Ben Hill", type: "County" },
  { state: "GA", name: "Berrien", type: "County" },
  { state: "GA", name: "Bibb", type: "County" },
  { state: "GA", name: "Bleckley", type: "County" },
  { state: "GA", name: "Brantley", type: "County" },
  { state: "GA", name: "Brooks", type: "County" },
];

// whole data and flow is mocked
export const AgencySettingsJurisdictions: React.FC<{
  settingProps: SettingProps;
}> = ({ settingProps }) => {
  const {
    isSettingInEditMode,
    openSetting,
    removeEditMode,
    modalConfirmHelper,
    clearSettingToOpen,
    isAnimationShowing,
    removeAnimation,
  } = settingProps;

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [searchResult, setSearchResult] = useState<
    { id: string; type: string; name: string; state: string }[]
  >([]);

  const [checkedJurisdictionsIds, setCheckedJurisdictionsIds] = useState<
    string[]
  >([]);
  const [includedJurisdictions, setIncludedJurisdictions] = useState(() =>
    includedJurisdictionsMock.map((entry) => ({
      ...entry,
      id: `${entry.name}${entry.state}`,
    }))
  );
  const [excludedJurisdictions, setExcludedJurisdictions] = useState(
    excludedJurisdictionsMock.map((entry) => ({
      ...entry,
      id: `${entry.name}${entry.state}`,
    }))
  );

  const jurisdictions = jurisdictionsMock.map((entry) => ({
    ...entry,
    id: `${entry.name}${entry.state}`,
  }));

  const getLocationName = (name: string, state: string | null) =>
    `${name}${state ? `, ${state}` : ""}`;
  const getSearchResult = (searchValue: string) => {
    if (searchValue === "") {
      setSearchResult([]);
      return;
    }
    const matchData = jurisdictions.filter((entry) =>
      entry.name.toLowerCase().startsWith(searchValue.toLowerCase())
    );
    setSearchResult(matchData);
  };
  const handleCheckedJurisdictionsIds = (jurisdictionId: string) => {
    setCheckedJurisdictionsIds(
      checkedJurisdictionsIds.includes(jurisdictionId)
        ? checkedJurisdictionsIds.filter((id) => id !== jurisdictionId)
        : [...checkedJurisdictionsIds, jurisdictionId]
    );
  };
  const handleRemoveJurisdictions = (jurisdictionIds: string[]) => {
    const newIncludedJurisdictions = includedJurisdictions.filter(
      (jurisdiction) => !jurisdictionIds.includes(jurisdiction.id)
    );
    const newExcludedJurisdictions = excludedJurisdictions.filter(
      (jurisdiction) => !jurisdictionIds.includes(jurisdiction.id)
    );
    setIncludedJurisdictions(newIncludedJurisdictions);
    setExcludedJurisdictions(newExcludedJurisdictions);
    setCheckedJurisdictionsIds([]);
  };

  const handleModalConfirm = () => {
    setIsConfirmModalOpen(false);
    modalConfirmHelper();
  };
  const handleModalReject = () => {
    setIsConfirmModalOpen(false);
    clearSettingToOpen();
  };

  return (
    <>
      <AgencySettingsBlock
        id="jurisdictions"
        isEditModeActive={isSettingInEditMode}
        isAnimationShowing={isAnimationShowing}
        onAnimationEnd={removeAnimation}
      >
        <AgencySettingsBlockTitle>Jurisdictions</AgencySettingsBlockTitle>
        {isSettingInEditMode ? (
          <>
            <AgencySettingsBlockDescription>
              Select the appropriate geographic area that corresponds with your
              agency. You can indicate multiple cities, counties, states, or
              other census areas that fall within your agency’s jurisdiction, or
              the ones that are excluded from your agency.
            </AgencySettingsBlockDescription>
            <JurisdictionsInputWrapper>
              <JurisdictionsInput
                placeholder="Type in the name of your jurisdiction (for example, Thurston County)"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  getSearchResult(e.target.value);
                }}
              />
              {!!inputValue &&
                (searchResult.length === 0 ? (
                  <JurisdictionsSearchResultContainer>
                    <JurisdictionsSearchResult>
                      No matches
                    </JurisdictionsSearchResult>
                  </JurisdictionsSearchResultContainer>
                ) : (
                  <JurisdictionsSearchResultContainer>
                    {searchResult.map((result) => (
                      <JurisdictionsSearchResult
                        key={result.id}
                        hasAction
                        onClick={() => {
                          setIncludedJurisdictions([
                            ...includedJurisdictions,
                            result,
                          ]);
                          setInputValue("");
                        }}
                      >
                        {getLocationName(result.name, result.state)}
                        <span>{result.type}</span>
                      </JurisdictionsSearchResult>
                    ))}
                  </JurisdictionsSearchResultContainer>
                ))}
            </JurisdictionsInputWrapper>

            {includedJurisdictions.length > 0 && (
              <AgencySettingsBlockSubDescription>
                Areas included
              </AgencySettingsBlockSubDescription>
            )}
            {includedJurisdictions.map(({ id, type, name, state }) => (
              <AgencySettingsInfoRow
                key={id}
                hasHover
                onClick={() => handleCheckedJurisdictionsIds(id)}
              >
                {getLocationName(name, state)}
                <JurisdictionCheckBlock>
                  {type}
                  <CheckboxWrapper>
                    <Checkbox
                      type="checkbox"
                      checked={checkedJurisdictionsIds.includes(id)}
                      onChange={() => handleCheckedJurisdictionsIds(id)}
                    />
                    <BlueCheckIcon src={blueCheck} alt="" enabled />
                  </CheckboxWrapper>
                </JurisdictionCheckBlock>
              </AgencySettingsInfoRow>
            ))}
            {excludedJurisdictions.length > 0 && (
              <AgencySettingsBlockSubDescription
                hasTopMargin={includedJurisdictions.length > 0}
              >
                Areas excluded
              </AgencySettingsBlockSubDescription>
            )}
            {excludedJurisdictions.map(({ id, type, name, state }) => (
              <AgencySettingsInfoRow
                key={id}
                hasHover
                onClick={() => handleCheckedJurisdictionsIds(id)}
              >
                {getLocationName(name, state)}
                <JurisdictionCheckBlock>
                  {type}
                  <CheckboxWrapper>
                    <Checkbox
                      type="checkbox"
                      checked={checkedJurisdictionsIds.includes(id)}
                      onChange={() => handleCheckedJurisdictionsIds(id)}
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
              {checkedJurisdictionsIds.length === 0 ? (
                <EditModeButtonsContainer>
                  <TransparentButton
                    onClick={() => setIsConfirmModalOpen(true)}
                  >
                    Cancel
                  </TransparentButton>
                  <FilledButton onClick={removeEditMode}>Save</FilledButton>
                </EditModeButtonsContainer>
              ) : (
                <EditModeButtonsContainer>
                  <TransparentButton
                    color="blue"
                    onClick={() => setCheckedJurisdictionsIds([])}
                  >
                    Cancel
                  </TransparentButton>
                  <TransparentButton
                    color="red"
                    onClick={() =>
                      handleRemoveJurisdictions(checkedJurisdictionsIds)
                    }
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
            {includedJurisdictions.length > 0 && (
              <AgencySettingsBlockSubDescription>
                Areas included
              </AgencySettingsBlockSubDescription>
            )}
            {includedJurisdictions.map(({ type, name, state }) => (
              <AgencySettingsInfoRow key={name}>
                {getLocationName(name, state)}
                <span>{type}</span>
              </AgencySettingsInfoRow>
            ))}
            {excludedJurisdictions.length > 0 && (
              <AgencySettingsBlockSubDescription
                hasTopMargin={includedJurisdictions.length > 0}
              >
                Areas excluded
              </AgencySettingsBlockSubDescription>
            )}
            {excludedJurisdictions.map(({ type, name, state }) => (
              <AgencySettingsInfoRow key={name}>
                {getLocationName(name, state)}
                <span>{type}</span>
              </AgencySettingsInfoRow>
            ))}
            <EditButtonContainer>
              <EditButton
                onClick={() => openSetting(() => setIsConfirmModalOpen(true))}
              >
                Edit jurisdictions
                <img src={rightArrow} alt="" />
              </EditButton>
            </EditButtonContainer>
          </>
        )}
      </AgencySettingsBlock>
      <AgencySettingsConfirmModal
        isModalOpen={isConfirmModalOpen}
        closeModal={handleModalReject}
        handleConfirm={handleModalConfirm}
      />
    </>
  );
};
