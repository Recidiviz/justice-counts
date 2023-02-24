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

/* eslint-disable camelcase */
import addIcon from "@justice-counts/common/assets/add-icon.svg";
import blackCheck from "@justice-counts/common/assets/black-check-icon.svg";
import mappedJurisdictionsJSONData from "@justice-counts/common/fips_with_county_subdivisions.json";
import { Jurisdiction } from "@justice-counts/common/types";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useStore } from "../../stores";
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

const mappedJurisdictionsData = mappedJurisdictionsJSONData as unknown as {
  [id: string]: Jurisdiction;
};

export const AgencySettingsJurisdictions: React.FC<{
  settingProps: SettingProps;
}> = observer(({ settingProps }) => {
  const { agencyId } = useParams() as { agencyId: string };
  const { isSettingInEditMode, openSetting, removeEditMode, allowEdit } =
    settingProps;
  const { agencyStore } = useStore();
  const {
    includedJurisdictionsIds,
    excludedJurisdictionsIds,
    updateAgencyJurisdictions,
    saveAgencyJurisdictions,
  } = agencyStore;

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isExclusionsViewActive, setIsExclusionsViewActive] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [totalSearchResultsShow, setTotalSearchResultsShow] = useState(10);
  const [searchResult, setSearchResult] = useState<Jurisdiction[]>([]);
  const [editedIncludedJurisdictionsIds, setEditedIncludedJurisdictionsIds] =
    useState<string[]>(includedJurisdictionsIds);
  const [editedExcludedJurisdictionsIds, setEditedExcludedJurisdictionsIds] =
    useState<string[]>(excludedJurisdictionsIds);
  const [checkedJurisdictionsIds, setCheckedJurisdictionsIds] = useState<
    string[]
  >([]);

  const checkedAreasCount = checkedJurisdictionsIds.length;
  const hasInclusions = includedJurisdictionsIds.length > 0;
  const hasExclusions = excludedJurisdictionsIds.length > 0;

  const handleSaveClick = () => {
    const updatedJurisdictions = updateAgencyJurisdictions({
      included: editedIncludedJurisdictionsIds,
      excluded: editedExcludedJurisdictionsIds,
    });
    saveAgencyJurisdictions(updatedJurisdictions, agencyId);
    removeEditMode();
  };
  const handleCancelClick = () => {
    const sortedStoreIncludedIds = includedJurisdictionsIds
      .sort((a, b) => a.localeCompare(b))
      .join();
    const sortedEditedIncludedIds = editedIncludedJurisdictionsIds
      .sort((a, b) => a.localeCompare(b))
      .join();
    const sortedStoreExcludedIds = excludedJurisdictionsIds
      .sort((a, b) => a.localeCompare(b))
      .join();
    const sortedEditedExcludedIds = editedExcludedJurisdictionsIds
      .sort((a, b) => a.localeCompare(b))
      .join();

    if (
      sortedStoreIncludedIds === sortedEditedIncludedIds &&
      sortedStoreExcludedIds === sortedEditedExcludedIds
    ) {
      removeEditMode();
    } else {
      setIsConfirmModalOpen(true);
    }
  };
  const handleModalConfirm = () => {
    setEditedIncludedJurisdictionsIds(includedJurisdictionsIds);
    setEditedExcludedJurisdictionsIds(excludedJurisdictionsIds);
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
    const newIncludedJurisdictionsIds = editedIncludedJurisdictionsIds.filter(
      (id) => !jurisdictionIds.includes(id)
    );
    const newExcludedJurisdictionsIds = editedExcludedJurisdictionsIds.filter(
      (id) => !jurisdictionIds.includes(id)
    );
    setEditedIncludedJurisdictionsIds(newIncludedJurisdictionsIds);
    setEditedExcludedJurisdictionsIds(newExcludedJurisdictionsIds);
    setCheckedJurisdictionsIds([]);
  };
  const handleAddArea = (id: string) => {
    if (isExclusionsViewActive) {
      setEditedExcludedJurisdictionsIds([
        ...editedExcludedJurisdictionsIds,
        id,
      ]);
      setInputValue("");
    } else {
      setEditedIncludedJurisdictionsIds([
        ...editedIncludedJurisdictionsIds,
        id,
      ]);
      setInputValue("");
    }
  };

  // helpers
  const getSearchResult = (searchValue: string) => {
    const matchedData = Object.values(mappedJurisdictionsData).filter((entry) =>
      entry.name.toLowerCase().startsWith(searchValue.toLowerCase().trim())
    );
    const addedJurisdictions = [
      ...editedIncludedJurisdictionsIds,
      ...editedExcludedJurisdictionsIds,
    ];
    const matchedDataWithoutAddedAreas = matchedData.filter(
      (entry) => !addedJurisdictions.includes(entry.id)
    );
    setSearchResult(matchedDataWithoutAddedAreas);
  };

  const getWordSearch = (word: string, jurisdictions: Jurisdiction[]) => {
    return jurisdictions.filter(
      (area) =>
        area.name.toLowerCase().includes(word) ||
        area.state_abbrev.toLowerCase().includes(word)
    );
  };
  const getSearch = () => {
    let result: Jurisdiction[] = Object.values(mappedJurisdictionsData);
    const inputWords = inputValue.trim().split(" ");
    for (let i = 0; i < inputWords.length; i += 1) {
      result = getWordSearch(inputWords[i].toLowerCase(), result);
    }
    return result;
  };

  // console.log(getSearch());

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

  useEffect(() => {
    if (
      includedJurisdictionsIds.join() !== editedIncludedJurisdictionsIds.join()
    )
      setEditedIncludedJurisdictionsIds(includedJurisdictionsIds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [includedJurisdictionsIds]);

  useEffect(() => {
    if (
      excludedJurisdictionsIds.join() !== editedExcludedJurisdictionsIds.join()
    )
      setEditedExcludedJurisdictionsIds(excludedJurisdictionsIds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [excludedJurisdictionsIds]);

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
                        onClick={() => handleAddArea(result.id)}
                      >
                        {result.name}
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
                {editedIncludedJurisdictionsIds.map((id) => (
                  <JurisdictionsInfoRow
                    key={id}
                    hasHover
                    onClick={() => handleCheckedJurisdictionsIds(id)}
                  >
                    {mappedJurisdictionsData[id].name}
                    <JurisdictionCheckBlock>
                      {removeUnderscore(mappedJurisdictionsData[id].type)}
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
                {editedExcludedJurisdictionsIds.map((id) => (
                  <JurisdictionsInfoRow
                    key={id}
                    hasHover
                    onClick={() => handleCheckedJurisdictionsIds(id)}
                  >
                    {mappedJurisdictionsData[id].name}
                    <JurisdictionCheckBlock>
                      {removeUnderscore(mappedJurisdictionsData[id].type)}
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
                  ? `${editedIncludedJurisdictionsIds.length} ${
                      editedIncludedJurisdictionsIds.length > 1
                        ? "areas"
                        : "area"
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
                  ? `${editedExcludedJurisdictionsIds.length} ${
                      editedExcludedJurisdictionsIds.length > 1
                        ? "areas"
                        : "area"
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
        {!includedJurisdictionsIds.length &&
          !excludedJurisdictionsIds.length && (
            <AgencyInfoBlockDescription hasTopMargin>
              No jurisdictions added.
            </AgencyInfoBlockDescription>
          )}
        {includedJurisdictionsIds.length > 0 && (
          <AgencySettingsBlockSubDescription>
            Areas included
          </AgencySettingsBlockSubDescription>
        )}
        {includedJurisdictionsIds.map((id) => (
          <JurisdictionsInfoRow key={id}>
            {mappedJurisdictionsData[id].name}
            <JurisdictionAreaType>
              {removeUnderscore(mappedJurisdictionsData[id].type)}
            </JurisdictionAreaType>
          </JurisdictionsInfoRow>
        ))}
        {excludedJurisdictionsIds.length > 0 && (
          <AgencySettingsBlockSubDescription
            hasTopMargin={includedJurisdictionsIds.length > 0}
          >
            Areas excluded
          </AgencySettingsBlockSubDescription>
        )}
        {excludedJurisdictionsIds.map((id) => (
          <JurisdictionsInfoRow key={id}>
            {mappedJurisdictionsData[id].name}
            <JurisdictionAreaType>
              {removeUnderscore(mappedJurisdictionsData[id].type)}
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
});
