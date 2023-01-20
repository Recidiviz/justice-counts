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
import { AgencySystems } from "@justice-counts/common/types";
import React, { useState } from "react";
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
import { AgencySettingsEditModeModal } from "./AgencySettingsEditModeModal";

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
  const { isSettingInEditMode, openSetting, removeEditMode } = settingProps;

  const { agencyId } = useParams();
  const { agencyStore } = useStore();
  const { currentAgencySystems, updateAgencySystems, saveAgencySettings } =
    agencyStore;
  const [supervisionSystemsToSave, setSupervisionSystemsToSave] =
    useState(currentAgencySystems);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const systemsToDisplayInReadMode = supervisionAgencySystems.filter((system) =>
    currentAgencySystems?.includes(system.value)
  );

  const handleSaveClick = () => {
    if (supervisionSystemsToSave) {
      const updatedSettings = updateAgencySystems(supervisionSystemsToSave);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      saveAgencySettings(updatedSettings, agencyId!);
      removeEditMode();
    }
  };
  const handleCancelClick = () => {
    if (systemsHasChanges()) {
      setIsConfirmModalOpen(true);
    } else {
      removeEditMode();
    }
  };
  const handleModalConfirm = () => {
    setSupervisionSystemsToSave(currentAgencySystems);
    setIsConfirmModalOpen(false);
    removeEditMode();
  };

  const handleSetSupervisionSystemsToSave = (value: AgencySystems) => {
    if (isSettingInEditMode) {
      setSupervisionSystemsToSave(systemsToSave(value));
    }
  };
  const systemsToSave = (systemToToggle: AgencySystems): AgencySystems[] => {
    if (!supervisionSystemsToSave) return [systemToToggle];
    return supervisionSystemsToSave.includes(systemToToggle)
      ? supervisionSystemsToSave.filter((system) => system !== systemToToggle)
      : supervisionSystemsToSave.concat(systemToToggle);
  };
  // using Set of concatenated arrays of store systems and local systemsToSave state
  // since all systems are unique there will never be duplicates so comparing Set size
  // with currentAgencySystems will tell us is there any changes
  // this compare method is not ideal but it works for this case
  const systemsHasChanges = () => {
    if (!supervisionSystemsToSave && !currentAgencySystems) return false;
    if (!supervisionSystemsToSave && currentAgencySystems?.length === 0)
      return false;
    if (supervisionSystemsToSave?.length === 0 && !currentAgencySystems)
      return false;

    if (supervisionSystemsToSave?.length !== currentAgencySystems?.length)
      return true;
    if (
      !!supervisionSystemsToSave &&
      !!currentAgencySystems &&
      supervisionSystemsToSave?.length === currentAgencySystems?.length
    ) {
      const mergedSet = new Set([
        ...supervisionSystemsToSave,
        ...currentAgencySystems,
      ]);
      return mergedSet.size !== currentAgencySystems.length;
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
            Supervision Populations
          </AgencySettingsBlockTitle>
          <AgencySettingsBlockDescription>
            Below are the supervision populations your agency is both
            responsible for AND can disaggregate your data by.
          </AgencySettingsBlockDescription>
          {supervisionAgencySystems.map(({ label, value }) => (
            <SupervisionSystemRow
              key={value}
              hasHover={isSettingInEditMode}
              onClick={() => handleSetSupervisionSystemsToSave(value)}
            >
              <CheckboxWrapper>
                <Checkbox
                  type="checkbox"
                  checked={
                    supervisionSystemsToSave?.includes(
                      value as AgencySystems
                    ) || false
                  }
                  onChange={() => handleSetSupervisionSystemsToSave(value)}
                />
                <BlueCheckIcon src={blueCheck} alt="" enabled />
              </CheckboxWrapper>
              {label}
            </SupervisionSystemRow>
          ))}
          <EditModeButtonsContainer>
            <TransparentButton onClick={handleCancelClick}>
              Cancel
            </TransparentButton>
            <FilledButton onClick={handleSaveClick}>Save</FilledButton>
          </EditModeButtonsContainer>
        </>
      </AgencySettingsEditModeModal>
    );
  }

  return (
    <>
      <AgencySettingsBlock id="supervisions">
        <AgencySettingsBlockTitle>
          Supervision Populations
        </AgencySettingsBlockTitle>
        <AgencySettingsBlockDescription>
          Below are the supervision populations your agency is both responsible
          for AND can disaggregate your data by.
        </AgencySettingsBlockDescription>
        {systemsToDisplayInReadMode.map(({ label, value }) => (
          <SupervisionSystemRow key={value}>{label}</SupervisionSystemRow>
        ))}
        <EditButtonContainer>
          <EditButton onClick={openSetting}>
            Edit populations
            <img src={rightArrow} alt="" />
          </EditButton>
        </EditButtonContainer>
      </AgencySettingsBlock>
    </>
  );
};
