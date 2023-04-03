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
import { Button } from "../shared/Button";
import { SettingProps } from "./AgencySettings";
import {
  AgencyInfoBlockDescription,
  AgencySettingsBlock,
  AgencySettingsBlockDescription,
  AgencySettingsBlockTitle,
  EditArrowImage,
  EditButtonContainer,
  EditModeButtonsContainer,
  SupervisionSystemRow,
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

  const { agencyId } = useParams() as { agencyId: string };
  const { agencyStore } = useStore();
  const { currentAgencySystems, updateAgencySystems, saveAgencySystems } =
    agencyStore;
  const [supervisionSystemsToSave, setSupervisionSystemsToSave] =
    useState(currentAgencySystems);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const systemsToDisplayInReadMode = supervisionAgencySystems.filter((system) =>
    currentAgencySystems?.includes(system.value)
  );

  const handleSaveClick = () => {
    if (supervisionSystemsToSave) {
      const updatedSystems = updateAgencySystems(supervisionSystemsToSave);
      saveAgencySystems(updatedSystems, agencyId);
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
            Select the supervision populations that your agency is responsible
            for. This enables disaggregating data by selected population types.
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
            <Button label="Cancel" onClick={handleCancelClick} />
            <Button label="Save" onClick={handleSaveClick} buttonColor="blue" />
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
          These are the supervision populations that your agency is responsible
          for. This enables disaggregating data by selected population types.
        </AgencySettingsBlockDescription>
        {systemsToDisplayInReadMode.length > 0 ? (
          systemsToDisplayInReadMode.map(({ label, value }) => (
            <SupervisionSystemRow key={value}>{label}</SupervisionSystemRow>
          ))
        ) : (
          <AgencyInfoBlockDescription hasTopMargin>
            No supervision populations selected.
          </AgencyInfoBlockDescription>
        )}
        <EditButtonContainer hasTopMargin>
          <Button
            label={
              <>
                Edit populations <EditArrowImage src={rightArrow} alt="" />
              </>
            }
            onClick={openSetting}
            labelColor="blue"
            hasNoSidePadding
            noHover
          />
        </EditButtonContainer>
      </AgencySettingsBlock>
    </>
  );
};
