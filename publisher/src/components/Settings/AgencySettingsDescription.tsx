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

import { Button } from "@justice-counts/common/components/Button";
import { Input } from "@justice-counts/common/components/Input";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { useParams } from "react-router-dom";

import { useStore } from "../../stores";
import rightArrow from "../assets/right-arrow.svg";
import { SettingProps } from "./AgencySettings";
import {
  AgencyInfoBlockDescription,
  AgencyInfoTextAreaLabel,
  AgencyInfoTextAreaWordCounter,
  AgencySettingsBlock,
  AgencySettingsBlockTitle,
  EditArrowImage,
  EditButtonContainer,
  EditModeButtonsContainer,
} from "./AgencySettings.styles";
import { AgencySettingsEditModeModal } from "./AgencySettingsEditModeModal";

const MAX_DESCRIPTION_CHARACTERS = 750;

const AgencySettingsDescription: React.FC<{
  settingProps: SettingProps;
}> = ({ settingProps }) => {
  const { isSettingInEditMode, openSetting, removeEditMode, allowEdit } =
    settingProps;

  const { agencyId } = useParams() as { agencyId: string };
  const { agencyStore } = useStore();
  const { currentAgencySettings, updateAgencySettings, saveAgencySettings } =
    agencyStore;
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [infoText, setInfoText] = useState("");

  const purposeAndFunctionsSetting =
    currentAgencySettings?.find(
      (setting) => setting.setting_type === "PURPOSE_AND_FUNCTIONS"
    )?.value || "";

  const handleSaveClick = () => {
    const updatedSettings = updateAgencySettings(
      "PURPOSE_AND_FUNCTIONS",
      infoText,
      parseInt(agencyId)
    );
    saveAgencySettings(updatedSettings, agencyId);
    removeEditMode();
  };
  const handleCancelClick = () => {
    if (purposeAndFunctionsSetting === infoText) {
      removeEditMode();
    } else {
      setIsConfirmModalOpen(true);
    }
  };
  const handleModalConfirm = () => {
    setInfoText(purposeAndFunctionsSetting || "");
    setIsConfirmModalOpen(false);
    removeEditMode();
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
            Agency Information
          </AgencySettingsBlockTitle>
          <AgencyInfoTextAreaLabel>
            Briefly describe your agency’s purpose and functions. This text will
            be displayed in the About page of the public-facing dashboard.
          </AgencyInfoTextAreaLabel>
          <Input
            name="basic-info-description"
            label=""
            onChange={(e) => setInfoText(e.target.value)}
            placeholder="Enter agency description..."
            isPlaceholderVisible
            multiline
            value={infoText}
            maxLength={750}
          />
          <AgencyInfoTextAreaWordCounter isRed={infoText.length >= 750}>
            {infoText.length}/{MAX_DESCRIPTION_CHARACTERS} characters
          </AgencyInfoTextAreaWordCounter>
          <EditModeButtonsContainer noMargin>
            <Button label="Cancel" onClick={handleCancelClick} />
            <Button label="Save" onClick={handleSaveClick} buttonColor="blue" />
          </EditModeButtonsContainer>
        </>
      </AgencySettingsEditModeModal>
    );
  }

  return (
    <>
      <AgencySettingsBlock id="description">
        <AgencySettingsBlockTitle>Agency Information</AgencySettingsBlockTitle>
        <AgencyInfoBlockDescription>
          {purposeAndFunctionsSetting || "No description added."}
        </AgencyInfoBlockDescription>
        {allowEdit && (
          <EditButtonContainer>
            <Button
              label={
                <>
                  Edit description <EditArrowImage src={rightArrow} alt="" />
                </>
              }
              onClick={() => {
                setInfoText(purposeAndFunctionsSetting);
                openSetting();
              }}
              labelColor="blue"
              noSidePadding
              noHover
            />
          </EditButtonContainer>
        )}
      </AgencySettingsBlock>
    </>
  );
};

export default observer(AgencySettingsDescription);
