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

/* eslint-disable camelcase */
import addIcon from "@justice-counts/common/assets/add-icon.svg";
import blackCheck from "@justice-counts/common/assets/black-check-icon.svg";
import jurisdictionsData from "@justice-counts/common/fips_with_county_subdivisions.json";
import { Jurisdiction } from "@justice-counts/common/types";
import React, { useEffect, useState } from "react";

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
  EditButton,
  EditButtonContainer,
  EditModeButtonsContainer,
  FilledButton,
  JurisdictionAreaType,
  JurisdictionCheckBlock,
  JurisdictionsEditModeFooter,
  JurisdictionsEditModeFooterLeftBlock,
  JurisdictionsInfoRow,
  JurisdictionsInput,
  JurisdictionsInputWrapper,
  JurisdictionsListArea,
  JurisdictionsSearchResult,
  JurisdictionsSearchResultContainer,
  SeeMoreButton,
  TransparentButton,
} from "./AgencySettings.styles";
import { AgencySettingsEditModeModal } from "./AgencySettingsEditModeModal";

const jurisdictions: Jurisdiction[] = (jurisdictionsData as Jurisdiction[]).map(
  (entry) => ({
    ...entry,
    area_name:
      entry.area_name === entry.state_name
        ? entry.area_name
        : `${entry.area_name}, ${entry.state_abbrev}`,
  })
);

// whole flow is mocked
export const AgencySettingsJurisdictions: React.FC<{
  settingProps: SettingProps;
}> = ({ settingProps }) => {
  const { isSettingInEditMode, openSetting, removeEditMode, allowEdit } =
    settingProps;

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isExclusionsViewActive, setIsExclusionsViewActive] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [totalSearchResultsShow, setTotalSearchResultsShow] = useState(10);
  const [searchResult, setSearchResult] = useState<Jurisdiction[]>([]);
  const [includedJurisdictions, setIncludedJurisdictions] = useState<
    Jurisdiction[]
  >([]);
  const [excludedJurisdictions, setExcludedJurisdictions] = useState<
    Jurisdiction[]
  >([]);
  const [checkedJurisdictionsIds, setCheckedJurisdictionsIds] = useState<
    string[]
  >([]);

  const checkedAreasCount = checkedJurisdictionsIds.length;
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
  const handleAddArea = (area: Jurisdiction) => {
    if (isExclusionsViewActive) {
      setExcludedJurisdictions([...excludedJurisdictions, area]);
      setInputValue("");
    } else {
      setIncludedJurisdictions([...includedJurisdictions, area]);
      setInputValue("");
    }
  };

  // helpers
  const getSearchResult = (searchValue: string) => {
    const matchedData = jurisdictions.filter((entry) =>
      entry.area_name.toLowerCase().startsWith(searchValue.toLowerCase().trim())
    );
    const addedJurisdictions = [
      ...includedJurisdictions,
      ...excludedJurisdictions,
    ].map((entry) => entry.id);
    const matchedDataWithoutAddedAreas = matchedData.filter(
      (entry) => !addedJurisdictions.includes(entry.id)
    );
    setSearchResult(matchedDataWithoutAddedAreas);
  };

  const removeUnderscore = (value: string) => value.replaceAll("_", " ");

  useEffect(() => {
    if (inputValue === "") {
      setTotalSearchResultsShow(10);
    }
  }, [inputValue]);

  useEffect(() => {
    if (!isSettingInEditMode) {
      setInputValue("");
      setIsExclusionsViewActive(false);
    }
  }, [isSettingInEditMode]);

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
            Add counties, states, or counties subdivisions that{" "}
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
                  {searchResult
                    .slice(0, totalSearchResultsShow)
                    .map((result) => (
                      <JurisdictionsSearchResult
                        key={result.id}
                        hasAction
                        onClick={() => handleAddArea(result)}
                      >
                        {result.area_name}
                        <JurisdictionAreaType>
                          {removeUnderscore(result.type)}{" "}
                          <AddIcon src={addIcon} alt="" />
                        </JurisdictionAreaType>
                      </JurisdictionsSearchResult>
                    ))}
                  {!!inputValue &&
                    searchResult.length > totalSearchResultsShow && (
                      <SeeMoreButton
                        hasAction
                        onClick={() =>
                          setTotalSearchResultsShow(totalSearchResultsShow + 10)
                        }
                      >
                        See more
                      </SeeMoreButton>
                    )}
                </JurisdictionsSearchResultContainer>
              ))}
          </JurisdictionsInputWrapper>

          {!isExclusionsViewActive && (
            <>
              <AgencySettingsBlockSubDescription>
                Areas included
              </AgencySettingsBlockSubDescription>
              <JurisdictionsListArea>
                {includedJurisdictions.map(({ id, type, area_name }) => (
                  <JurisdictionsInfoRow
                    key={id}
                    hasHover
                    onClick={() => handleCheckedJurisdictionsIds(id)}
                  >
                    {area_name}
                    <JurisdictionCheckBlock>
                      {removeUnderscore(type)}
                      <CheckboxWrapper>
                        <Checkbox
                          type="checkbox"
                          checked={checkedJurisdictionsIds.includes(id)}
                          onChange={() => handleCheckedJurisdictionsIds(id)}
                        />
                        <BlueCheckIcon src={blackCheck} alt="" enabled />
                      </CheckboxWrapper>
                    </JurisdictionCheckBlock>
                  </JurisdictionsInfoRow>
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
                {excludedJurisdictions.map(({ id, type, area_name }) => (
                  <JurisdictionsInfoRow
                    key={id}
                    hasHover
                    onClick={() => handleCheckedJurisdictionsIds(id)}
                  >
                    {area_name}
                    <JurisdictionCheckBlock>
                      {removeUnderscore(type)}
                      <CheckboxWrapper>
                        <Checkbox
                          type="checkbox"
                          checked={checkedJurisdictionsIds.includes(id)}
                          onChange={() => handleCheckedJurisdictionsIds(id)}
                        />
                        <BlueCheckIcon src={blackCheck} alt="" enabled />
                      </CheckboxWrapper>
                    </JurisdictionCheckBlock>
                  </JurisdictionsInfoRow>
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
                  {`Remove ${checkedAreasCount} ${
                    checkedAreasCount > 1 ? "areas" : "area"
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
        {includedJurisdictions.map(({ id, type, area_name }) => (
          <JurisdictionsInfoRow key={id}>
            {area_name}
            <JurisdictionAreaType>
              {removeUnderscore(type)}
            </JurisdictionAreaType>
          </JurisdictionsInfoRow>
        ))}
        {excludedJurisdictions.length > 0 && (
          <AgencySettingsBlockSubDescription
            hasTopMargin={includedJurisdictions.length > 0}
          >
            Areas excluded
          </AgencySettingsBlockSubDescription>
        )}
        {excludedJurisdictions.map(({ id, type, area_name }) => (
          <JurisdictionsInfoRow key={id}>
            {area_name}
            <JurisdictionAreaType>
              {removeUnderscore(type)}
            </JurisdictionAreaType>
          </JurisdictionsInfoRow>
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
