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
import { Button } from "@justice-counts/common/components/Button";
import { Modal } from "@justice-counts/common/components/Modal";
import {
  RadioButton,
  RadioButtonsWrapper,
} from "@justice-counts/common/components/RadioButton";
import mappedJurisdictionsJSONData from "@justice-counts/common/fips_with_county_subdivisions.json";
import { Jurisdiction } from "@justice-counts/common/types";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useStore } from "../../stores";
import { SettingProps } from "./AgencySettings";
import {
  AddIcon,
  AgencyInfoBlockDescription,
  AgencySettingsBlock,
  AgencySettingsBlockDescription,
  BasicInfoBlockTitle,
  BlueCheckIcon,
  Checkbox,
  CheckboxWrapper,
  EditButtonContainer,
  EditModeButtonsContainer,
  JurisdictionCheckBlock,
  JurisdictionsEditModeFooter,
  JurisdictionsInfoCol,
  JurisdictionsInfoRow,
  JurisdictionsInputWrapper,
  JurisdictionsListArea,
  JurisdictionsSearchBar,
  JurisdictionsSearchBarContainer,
  JurisdictionsSearchResult,
  JurisdictionsSearchResultContainer,
} from "./AgencySettings.styles";
import { AgencySettingsEditModeModal } from "./AgencySettingsEditModeModal";

const mappedJurisdictionsData = mappedJurisdictionsJSONData as unknown as {
  [id: string]: Jurisdiction;
};

const radioWrapperSpacing = {
  top: 0,
  right: 0,
  bottom: 16,
  left: 0,
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
  const isAgencySettingConfigured = hasInclusions || hasExclusions;

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
  const getWordSearch = (
    word: string,
    jurisdictions: (Jurisdiction & { score: number })[]
  ) => {
    const matched = jurisdictions.filter(
      (area) =>
        area.state_abbrev.toLowerCase().includes(word) ||
        area.name.toLowerCase().includes(word)
    );
    const matchedWithScore = matched.reduce((acc, area) => {
      acc[area.id] = 0;
      if (area.state_abbrev.toLowerCase().startsWith(word)) acc[area.id] += 1;
      if (area.name.toLowerCase().startsWith(word)) acc[area.id] += 1;
      return acc;
    }, {} as { [id: string]: number });
    return matched
      .map((area) => ({
        ...area,
        score: area.score + matchedWithScore[area.id],
      }))
      .sort((a, b) => b.score - a.score || a.name.length - b.name.length);
  };

  const getSearch = (searchValue: string) => {
    let result: (Jurisdiction & { score: number })[] = Object.values(
      mappedJurisdictionsData
    ).map((area) => ({ ...area, score: 0 }));
    const inputWords = searchValue.trim().split(" ");
    for (let i = 0; i < inputWords.length; i += 1) {
      result = getWordSearch(inputWords[i].toLowerCase(), result);
    }
    const addedJurisdictions = [
      ...editedIncludedJurisdictionsIds,
      ...editedExcludedJurisdictionsIds,
    ];
    setSearchResult(
      result.filter((entry) => !addedJurisdictions.includes(entry.id))
    );
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

  return (
    <>
      {isSettingInEditMode && (
        <AgencySettingsEditModeModal
          openCancelModal={handleCancelClick}
          isConfirmModalOpen={isConfirmModalOpen}
          closeCancelModal={() => setIsConfirmModalOpen(false)}
          handleCancelModalConfirm={handleModalConfirm}
        >
          <Modal
            title="Jurisdictions"
            description={
              <>
                <JurisdictionsInputWrapper>
                  <JurisdictionsSearchBarContainer>
                    <RadioButtonsWrapper spacing={radioWrapperSpacing}>
                      <RadioButton
                        type="radio"
                        id="include"
                        name="exclusionsView"
                        label="Include"
                        onClick={() =>
                          setIsExclusionsViewActive(!isExclusionsViewActive)
                        }
                        defaultChecked={!isExclusionsViewActive}
                        buttonSize="large"
                      />
                      <RadioButton
                        type="radio"
                        id="exclude"
                        name="exclusionsView"
                        label="Exclude"
                        onClick={() =>
                          setIsExclusionsViewActive(!isExclusionsViewActive)
                        }
                        defaultChecked={isExclusionsViewActive}
                        buttonSize="large"
                      />
                    </RadioButtonsWrapper>
                    <JurisdictionsSearchBar
                      placeholder="Select County"
                      value={inputValue}
                      onChange={(e) => {
                        setInputValue(e.target.value);
                        getSearch(e.target.value);
                      }}
                    />
                  </JurisdictionsSearchBarContainer>
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
                              <JurisdictionsInfoCol>
                                <div>{result.name}</div>
                                <div>
                                  <span>{removeUnderscore(result.type)}</span>
                                </div>
                              </JurisdictionsInfoCol>
                              <JurisdictionsInfoCol>
                                <div>
                                  <AddIcon src={addIcon} alt="" />
                                </div>
                              </JurisdictionsInfoCol>
                            </JurisdictionsSearchResult>
                          ))}
                        {!!inputValue &&
                          searchResult.length > totalSearchResultsShow && (
                            <Button
                              label="See More"
                              onClick={() =>
                                setTotalSearchResultsShow(
                                  totalSearchResultsShow + 10
                                )
                              }
                              labelColor="blue"
                              noHover
                            />
                          )}
                      </JurisdictionsSearchResultContainer>
                    ))}
                </JurisdictionsInputWrapper>
                {!isExclusionsViewActive && (
                  <JurisdictionsListArea>
                    {editedIncludedJurisdictionsIds.map((id) => (
                      <JurisdictionsInfoRow
                        key={id}
                        hasHover
                        onClick={() => handleCheckedJurisdictionsIds(id)}
                      >
                        <JurisdictionsInfoCol>
                          <div>{mappedJurisdictionsData[id].name}</div>
                          <div>
                            <span>
                              {removeUnderscore(
                                mappedJurisdictionsData[id].type
                              )}
                            </span>
                          </div>
                        </JurisdictionsInfoCol>
                        <JurisdictionsInfoCol>
                          <JurisdictionCheckBlock>
                            <CheckboxWrapper>
                              <Checkbox
                                type="checkbox"
                                checked={checkedJurisdictionsIds.includes(id)}
                                onChange={() =>
                                  handleCheckedJurisdictionsIds(id)
                                }
                                squareCheckboxConfigs
                              />
                              <BlueCheckIcon src={blackCheck} alt="" enabled />
                            </CheckboxWrapper>
                          </JurisdictionCheckBlock>
                        </JurisdictionsInfoCol>
                      </JurisdictionsInfoRow>
                    ))}
                  </JurisdictionsListArea>
                )}
                {isExclusionsViewActive && (
                  <JurisdictionsListArea>
                    {editedExcludedJurisdictionsIds.map((id) => (
                      <JurisdictionsInfoRow
                        key={id}
                        hasHover
                        onClick={() => handleCheckedJurisdictionsIds(id)}
                      >
                        <JurisdictionsInfoCol>
                          <div>{mappedJurisdictionsData[id].name}</div>
                          <div>
                            <span>
                              {removeUnderscore(
                                mappedJurisdictionsData[id].type
                              )}
                            </span>
                          </div>
                        </JurisdictionsInfoCol>
                        <JurisdictionsInfoCol>
                          <JurisdictionCheckBlock>
                            <CheckboxWrapper>
                              <Checkbox
                                type="checkbox"
                                checked={checkedJurisdictionsIds.includes(id)}
                                onChange={() =>
                                  handleCheckedJurisdictionsIds(id)
                                }
                                squareCheckboxConfigs
                              />
                              <BlueCheckIcon src={blackCheck} alt="" enabled />
                            </CheckboxWrapper>
                          </JurisdictionCheckBlock>
                        </JurisdictionsInfoCol>
                      </JurisdictionsInfoRow>
                    ))}
                  </JurisdictionsListArea>
                )}
                <JurisdictionsEditModeFooter>
                  {checkedJurisdictionsIds.length === 0 ? (
                    <EditModeButtonsContainer>
                      <Button label="Cancel" onClick={handleCancelClick} />
                      <Button
                        label="Save"
                        onClick={handleSaveClick}
                        buttonColor="blue"
                      />
                    </EditModeButtonsContainer>
                  ) : (
                    <EditModeButtonsContainer>
                      <Button
                        label="Cancel"
                        onClick={() => setCheckedJurisdictionsIds([])}
                        labelColor="blue"
                        noSidePadding
                        noHover
                      />
                      <Button
                        label={`Remove ${checkedAreasCount} ${
                          checkedAreasCount > 1 ? "areas" : "area"
                        }`}
                        onClick={() =>
                          handleRemoveJurisdictions(checkedJurisdictionsIds)
                        }
                        labelColor="red"
                        noSidePadding
                        noHover
                      />
                    </EditModeButtonsContainer>
                  )}
                </JurisdictionsEditModeFooter>
              </>
            }
            modalBackground="opaque"
            onClickClose={handleCancelClick}
            agencySettingsConfigs
            jurisdictionsSettingsConfigs
          />
        </AgencySettingsEditModeModal>
      )}

      <AgencySettingsBlock id="jurisdictions">
        <BasicInfoBlockTitle configured={isAgencySettingConfigured}>
          Jurisdictions
          {allowEdit && (
            <EditButtonContainer>
              <Button
                label={<>Edit</>}
                onClick={openSetting}
                labelColor="blue"
                noSidePadding
                noHover
              />
            </EditButtonContainer>
          )}
        </BasicInfoBlockTitle>

        <AgencySettingsBlockDescription>
          Add counties, states, or counties subdivisions that correspond with
          your agency.
        </AgencySettingsBlockDescription>
        {!includedJurisdictionsIds.length &&
          !excludedJurisdictionsIds.length && (
            <AgencyInfoBlockDescription hasTopMargin>
              No jurisdictions added.
            </AgencyInfoBlockDescription>
          )}
        {includedJurisdictionsIds.map((id) => (
          <JurisdictionsInfoRow key={id}>
            <JurisdictionsInfoCol>
              <div>{mappedJurisdictionsData[id].name}</div>
              <div>
                <span>
                  {removeUnderscore(mappedJurisdictionsData[id].type)}
                </span>
              </div>
            </JurisdictionsInfoCol>
            <JurisdictionsInfoCol>
              <div>Included</div>
            </JurisdictionsInfoCol>
          </JurisdictionsInfoRow>
        ))}
        {excludedJurisdictionsIds.map((id) => (
          <JurisdictionsInfoRow key={id}>
            <JurisdictionsInfoCol>
              <div>{mappedJurisdictionsData[id].name}</div>
              <div>
                <span>
                  {removeUnderscore(mappedJurisdictionsData[id].type)}
                </span>
              </div>
            </JurisdictionsInfoCol>
            <JurisdictionsInfoCol>
              <div>Excluded</div>
            </JurisdictionsInfoCol>
          </JurisdictionsInfoRow>
        ))}
      </AgencySettingsBlock>
    </>
  );
});
