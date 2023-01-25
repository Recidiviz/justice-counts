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

import addIcon from "@justice-counts/common/assets/add-icon.png";
import blackCheck from "@justice-counts/common/assets/black-check-icon.png";
import React, { useState } from "react";

import rightArrow from "../assets/right-arrow.svg";
import {
  BlueCheckIcon,
  Checkbox,
  CheckboxWrapper,
} from "../MetricConfiguration";
import { SettingProps } from "./AgencySettings";
import {
  AddIcon,
  AddJurisdictionsExclusionsLink,
  AgencyInfoBlockDescription,
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
  JurisdictionsListArea,
  JurisdictionsSearchResult,
  JurisdictionsSearchResultContainer,
  TransparentButton,
} from "./AgencySettings.styles";
import { AgencySettingsEditModeModal } from "./AgencySettingsEditModeModal";

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
  const { isSettingInEditMode, openSetting, removeEditMode, allowEdit } =
    settingProps;

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isExclusionsViewActive, setIsExclusionsViewActive] = useState(false);
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
  const checkedAreas = checkedJurisdictionsIds.length;
  const hasInclusions = includedJurisdictions.length > 0;
  const hasExclusions = excludedJurisdictions.length > 0;

  const handleSaveClick = () => {
    removeEditMode();
  };
  // I guess I will compare store jurisdictions ids with locals and based on that will show modal or just close edit mode
  const handleCancelClick = () => {
    removeEditMode();
  };
  const handleModalConfirm = () => {
    setIsConfirmModalOpen(false);
    removeEditMode();
  };
  const getLocationName = (name: string, state: string | null) =>
    `${name}${state ? `, ${state}` : ""}`;
  const getSearchResult = (searchValue: string) => {
    if (searchValue === "") {
      setSearchResult([]);
      return;
    }
    // with ids will be much easier
    const matchedData = jurisdictions.filter((entry) =>
      entry.name.toLowerCase().startsWith(searchValue.toLowerCase())
    );
    const addedJurisdictions = [
      ...includedJurisdictions,
      ...excludedJurisdictions,
    ].map((area) => `${area.name}, ${area.state}`);
    const matchedDataWithoutAddedAreas = matchedData.filter(
      (area) => !addedJurisdictions.includes(`${area.name}, ${area.state}`)
    );
    setSearchResult(matchedDataWithoutAddedAreas);
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
  const handleAddArea = (area: {
    id: string;
    type: string;
    name: string;
    state: string;
  }) => {
    if (isExclusionsViewActive) {
      setExcludedJurisdictions([...excludedJurisdictions, area]);
      setInputValue("");
    } else {
      setIncludedJurisdictions([...includedJurisdictions, area]);
      setInputValue("");
    }
  };

  if (isSettingInEditMode) {
    return (
      <AgencySettingsEditModeModal
        openCancelModal={handleCancelClick}
        isConfirmModalOpen={isConfirmModalOpen}
        closeCancelModal={() => setIsConfirmModalOpen(false)}
        handleCancelModalConfirm={handleModalConfirm}
      >
        <>
          <AgencySettingsBlockTitle isEditModeActive>
            {isExclusionsViewActive
              ? "Which jurisdiction should be excluded?"
              : "Jurisdictions"}
          </AgencySettingsBlockTitle>
          <AgencySettingsBlockDescription>
            Add counties, states, or cities that{" "}
            {isExclusionsViewActive && "DO NOT"} correspond with your agency.
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
                      onClick={() => handleAddArea(result)}
                    >
                      {getLocationName(result.name, result.state)}
                      <div>
                        {result.type} <AddIcon src={addIcon} alt="" />
                      </div>
                    </JurisdictionsSearchResult>
                  ))}
                </JurisdictionsSearchResultContainer>
              ))}
          </JurisdictionsInputWrapper>

          {!isExclusionsViewActive && (
            <>
              <AgencySettingsBlockSubDescription>
                Areas included
              </AgencySettingsBlockSubDescription>
              <JurisdictionsListArea>
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
                        <BlueCheckIcon src={blackCheck} alt="" enabled />
                      </CheckboxWrapper>
                    </JurisdictionCheckBlock>
                  </AgencySettingsInfoRow>
                ))}
              </JurisdictionsListArea>
            </>
          )}

          {isExclusionsViewActive && (
            <>
              <AgencySettingsBlockSubDescription>
                Areas excluded
              </AgencySettingsBlockSubDescription>
              <JurisdictionsListArea>
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
                        <BlueCheckIcon src={blackCheck} alt="" enabled />
                      </CheckboxWrapper>
                    </JurisdictionCheckBlock>
                  </AgencySettingsInfoRow>
                ))}
              </JurisdictionsListArea>
            </>
          )}

          <JurisdictionsEditModeFooter>
            {isExclusionsViewActive ? (
              <JurisdictionsEditModeFooterLeftBlock>
                {hasInclusions
                  ? `${includedJurisdictions.length} ${
                      includedJurisdictions.length > 1 ? "areas" : "area"
                    } included`
                  : "Need to declare included areas?"}
                <AddJurisdictionsExclusionsLink
                  onClick={() =>
                    setIsExclusionsViewActive(!isExclusionsViewActive)
                  }
                >
                  {hasInclusions ? "View and Edit" : "Add them"}
                </AddJurisdictionsExclusionsLink>
              </JurisdictionsEditModeFooterLeftBlock>
            ) : (
              <JurisdictionsEditModeFooterLeftBlock>
                {hasExclusions
                  ? `${excludedJurisdictions.length} ${
                      excludedJurisdictions.length > 1 ? "areas" : "area"
                    } excluded`
                  : "Need to declare excluded areas?"}
                <AddJurisdictionsExclusionsLink
                  onClick={() =>
                    setIsExclusionsViewActive(!isExclusionsViewActive)
                  }
                >
                  {hasExclusions ? "View and Edit" : "Add them"}
                </AddJurisdictionsExclusionsLink>
              </JurisdictionsEditModeFooterLeftBlock>
            )}
            {checkedJurisdictionsIds.length === 0 ? (
              <EditModeButtonsContainer>
                <TransparentButton onClick={handleCancelClick}>
                  Cancel
                </TransparentButton>
                <FilledButton onClick={handleSaveClick}>Save</FilledButton>
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
                  {`Remove ${checkedAreas} ${
                    checkedAreas > 1 ? "areas" : "area"
                  }`}
                </TransparentButton>
              </EditModeButtonsContainer>
            )}
          </JurisdictionsEditModeFooter>
        </>
      </AgencySettingsEditModeModal>
    );
  }

  return (
    <>
      <AgencySettingsBlock id="jurisdictions">
        <AgencySettingsBlockTitle>Jurisdictions</AgencySettingsBlockTitle>

        <AgencySettingsBlockDescription>
          The following are within the agency’s jurisdiction.
        </AgencySettingsBlockDescription>
        {!includedJurisdictions.length && !excludedJurisdictions.length && (
          <AgencyInfoBlockDescription hasTopMargin>
            No jurisdictions added.
          </AgencyInfoBlockDescription>
        )}
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
        {allowEdit && (
          <EditButtonContainer>
            <EditButton onClick={openSetting}>
              Edit jurisdictions
              <img src={rightArrow} alt="" />
            </EditButton>
          </EditButtonContainer>
        )}
      </AgencySettingsBlock>
    </>
  );
};
