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
import { AgencySettingsConfirmModal } from "./AgencySettingsConfirmModal";

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
    removeEditMode,
    modalConfirmHelper,
    clearSettingToOpen,
    isAnimationShowing,
    removeAnimation,
  } = settingProps;

  const { agencyId } = useParams();
  const { agencyStore } = useStore();
  const { currentAgencySystems, updateAgencySystems, saveAgencySettings } =
    agencyStore;
  const [supervisionSystemsToSave, setSupervisionSystemsToSave] =
    useState(currentAgencySystems);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const handleModalConfirm = () => {
    setSupervisionSystemsToSave(currentAgencySystems);
    setIsConfirmModalOpen(false);
    modalConfirmHelper();
  };
  const handleModalReject = () => {
    setIsConfirmModalOpen(false);
    clearSettingToOpen();
  };

  const saveSupervisionChanges = () => {
    if (supervisionSystemsToSave) {
      const updatedSettings = updateAgencySystems(supervisionSystemsToSave);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      saveAgencySettings(updatedSettings, agencyId!);
      removeEditMode();
    }
  };
  const systemsToSave = (systemToToggle: AgencySystems): AgencySystems[] => {
    if (!supervisionSystemsToSave) return [systemToToggle];
    return supervisionSystemsToSave.includes(systemToToggle)
      ? supervisionSystemsToSave.filter((system) => system !== systemToToggle)
      : supervisionSystemsToSave.concat(systemToToggle);
  };
  const handleSetSupervisionSystemsToSave = (value: AgencySystems) => {
    if (isSettingInEditMode) {
      setSupervisionSystemsToSave(systemsToSave(value));
    }
  };

  return (
    <>
      <AgencySettingsBlock
        id="supervisions"
        isEditModeActive={isSettingInEditMode}
        isAnimationShowing={isAnimationShowing}
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
          <SupervisionSystemRow
            key={value}
            hasHover={isSettingInEditMode}
            onClick={() => handleSetSupervisionSystemsToSave(value)}
          >
            <CheckboxWrapper>
              <Checkbox
                type="checkbox"
                checked={
                  supervisionSystemsToSave?.includes(value as AgencySystems) ||
                  false
                }
                onChange={() => handleSetSupervisionSystemsToSave(value)}
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
            <TransparentButton onClick={() => setIsConfirmModalOpen(true)}>
              Cancel
            </TransparentButton>
            <FilledButton onClick={saveSupervisionChanges}>Save</FilledButton>
          </EditModeButtonsContainer>
        ) : (
          <EditButtonContainer>
            <EditButton
              onClick={() => openSetting(() => setIsConfirmModalOpen(true))}
            >
              Edit populations
              <img src={rightArrow} alt="" />
            </EditButton>
          </EditButtonContainer>
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
