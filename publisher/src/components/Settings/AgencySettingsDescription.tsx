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

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { useStore } from "../../stores";
import rightArrow from "../assets/right-arrow.svg";
import { SettingProps } from "./AgencySettings";
import {
  AgencyInfoBlockDescription,
  AgencyInfoTextArea,
  AgencyInfoTextAreaLabel,
  AgencyInfoTextAreaWordCounter,
  AgencySettingsBlock,
  AgencySettingsBlockTitle,
  EditButton,
  EditButtonContainer,
  EditModeButtonsContainer,
  FilledButton,
  TransparentButton,
} from "./AgencySettings.styles";
import { AgencySettingsEditModeModal } from "./AgencySettingsEditModeModal";

const MAX_DESCRIPTION_CHARACTERS = 750;
const MIN_TEXT_AREA_HEIGHT = 121;

export const AgencySettingsDescription: React.FC<{
  settingProps: SettingProps;
}> = ({ settingProps }) => {
  const { isSettingInEditMode, openSetting, removeEditMode, allowEdit } =
    settingProps;

  const { agencyId } = useParams();
  const { agencyStore } = useStore();
  const { settings, updateAgencySettings, saveAgencySettings } = agencyStore;
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [infoText, setInfoText] = useState(settings.PURPOSE_AND_FUNCTIONS);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleSaveClick = () => {
    const updatedSettings = updateAgencySettings(
      "PURPOSE_AND_FUNCTIONS",
      infoText
    );
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    saveAgencySettings(updatedSettings, agencyId!);
    removeEditMode();
  };
  const handleCancelClick = () => {
    if (settings.PURPOSE_AND_FUNCTIONS === infoText) {
      removeEditMode();
    } else {
      setIsConfirmModalOpen(true);
    }
  };
  const handleModalConfirm = () => {
    setInfoText(settings.PURPOSE_AND_FUNCTIONS);
    setIsConfirmModalOpen(false);
    removeEditMode();
  };

  useEffect(() => {
    if (textAreaRef.current) {
      // eslint-disable-next-line no-param-reassign
      textAreaRef.current.style.height = "0px";
      const { scrollHeight } = textAreaRef.current;

      // eslint-disable-next-line no-param-reassign
      textAreaRef.current.style.height = `${
        MIN_TEXT_AREA_HEIGHT > Number(scrollHeight) + 1
          ? MIN_TEXT_AREA_HEIGHT
          : Number(scrollHeight) + 1
      }px`;
    }
  }, [infoText, isSettingInEditMode]);

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
          <AgencyInfoTextAreaLabel htmlFor="basic-info-description">
            Briefly describe your agency’s purpose and functions. This text will
            be displayed in the About page of the public-facing dashboard.
          </AgencyInfoTextAreaLabel>
          <AgencyInfoTextArea
            id="basic-info-description"
            onChange={(e) => setInfoText(e.target.value)}
            placeholder="Enter agency description..."
            ref={textAreaRef}
            rows={1}
            value={infoText}
            maxLength={750}
          />
          <AgencyInfoTextAreaWordCounter isRed={infoText.length >= 750}>
            {infoText.length}/{MAX_DESCRIPTION_CHARACTERS} characters
          </AgencyInfoTextAreaWordCounter>
          <EditModeButtonsContainer noMargin>
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
      <AgencySettingsBlock id="description">
        <AgencySettingsBlockTitle>Agency Information</AgencySettingsBlockTitle>
        <AgencyInfoBlockDescription>
          {settings.PURPOSE_AND_FUNCTIONS || "No description added."}
        </AgencyInfoBlockDescription>
        {allowEdit && (
          <EditButtonContainer>
            <EditButton onClick={openSetting}>
              Edit description
              <img src={rightArrow} alt="" />
            </EditButton>
          </EditButtonContainer>
        )}
      </AgencySettingsBlock>
    </>
  );
};
