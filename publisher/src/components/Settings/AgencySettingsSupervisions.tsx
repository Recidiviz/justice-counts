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
import { useParams } from "react-router-dom";

import { AgencySystems } from "../../../../common/types";
import { useStore } from "../../stores";
import noBackgroundCheck from "../assets/no-background-check-icon.svg";
import rightArrow from "../assets/right-arrow.svg";
import blueCheck from "../assets/status-check-icon.png";
import {
  BlueCheckIcon,
  Checkbox,
  CheckboxWrapper,
} from "../MetricConfiguration";
import { SettingProps } from "./AgencySettings";
import {
  AgencySettingsBlock,
  AgencySettingsBlockDescription,
  AgencySettingsBlockTitle,
  EditButton,
  EditButtonContainer,
  EditModeButtonsContainer,
  FilledButton,
  SupervisionSystemRow,
  TransparentButton,
} from "./AgencySettings.styles";

const supervisionAgencySystems: { label: string; value: AgencySystems }[] = [
  { label: "Parole", value: "PAROLE" },
  {
    label: "Probation",
    value: "PROBATION",
  },
  { label: "Pretrial Supervision", value: "PRETRIAL_SUPERVISION" },
  { label: "Other", value: "OTHER_SUPERVISION" },
];

export const AgencySettingsSupervisions: React.FC<{
  settingProps: SettingProps;
}> = ({ settingProps }) => {
  const {
    isSettingInEditMode,
    openSetting,
    closeSetting,
    showAnimation,
    removeAnimation,
  } = settingProps;

  const { agencyId } = useParams();
  const { agencyStore } = useStore();
  const {
    settings,
    currentAgencySystems,
    updateAgencySettings,
    saveAgencySettings,
  } = agencyStore;
  const [supervisionSystemsToSave, setSupervisionSystemsToSave] =
    useState(currentAgencySystems);

  const systemsToSave = (systemToToggle: AgencySystems): AgencySystems[] => {
    if (!supervisionSystemsToSave) return [systemToToggle];
    return supervisionSystemsToSave.includes(systemToToggle)
      ? supervisionSystemsToSave.filter((system) => system !== systemToToggle)
      : supervisionSystemsToSave.concat(systemToToggle);
  };
  const cancelSupervisionChanges = () => {
    setSupervisionSystemsToSave(currentAgencySystems);
    closeSetting();
  };
  const saveSupervisionChanges = () => {
    const updatedSettings = updateAgencySettings(
      settings.PURPOSE_AND_FUNCTIONS,
      supervisionSystemsToSave
    );
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    saveAgencySettings(updatedSettings, agencyId!);
    closeSetting();
  };

  return (
    <AgencySettingsBlock
      id="supervisions"
      editMode={isSettingInEditMode}
      showAnimation={showAnimation}
      onAnimationEnd={removeAnimation}
    >
      <AgencySettingsBlockTitle>
        Supervision Populations
      </AgencySettingsBlockTitle>
      <AgencySettingsBlockDescription>
        Below are the supervision populations your agency is both responsible
        for AND can disaggregate your data by.
      </AgencySettingsBlockDescription>
      {supervisionAgencySystems.map(({ label, value }) => (
        <SupervisionSystemRow key={value}>
          <CheckboxWrapper>
            <Checkbox
              type="checkbox"
              checked={
                supervisionSystemsToSave?.includes(value as AgencySystems) ||
                false
              }
              onChange={() => setSupervisionSystemsToSave(systemsToSave(value))}
              disabled={!isSettingInEditMode}
            />
            <BlueCheckIcon
              src={isSettingInEditMode ? blueCheck : noBackgroundCheck}
              alt=""
              enabled
            />
          </CheckboxWrapper>
          {label}
        </SupervisionSystemRow>
      ))}
      {isSettingInEditMode ? (
        <EditModeButtonsContainer>
          <TransparentButton onClick={cancelSupervisionChanges}>
            Cancel
          </TransparentButton>
          <FilledButton onClick={saveSupervisionChanges}>Save</FilledButton>
        </EditModeButtonsContainer>
      ) : (
        <EditButtonContainer>
          <EditButton onClick={openSetting}>
            Edit populations
            <img src={rightArrow} alt="" />
          </EditButton>
        </EditButtonContainer>
      )}
    </AgencySettingsBlock>
  );
};
