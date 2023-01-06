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

export const AgencySettingsDescription: React.FC<{
  settingProps: SettingProps;
}> = ({ settingProps }) => {
  const {
    isSettingInEditMode,
    openSetting,
    closeSetting,
    isAnimationShowing,
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
  const [infoText, setInfoText] = useState(settings.PURPOSE_AND_FUNCTIONS);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const cancelAgencyInfoChanges = () => {
    setInfoText(settings.PURPOSE_AND_FUNCTIONS);
    closeSetting();
  };
  const saveAgencyInfoChanges = () => {
    const updatedSettings = updateAgencySettings(
      infoText,
      currentAgencySystems
    );
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    saveAgencySettings(updatedSettings, agencyId!);
    closeSetting();
  };

  useEffect(() => {
    if (textAreaRef.current) {
      // eslint-disable-next-line no-param-reassign
      textAreaRef.current.style.height = "0px";
      const { scrollHeight } = textAreaRef.current;

      // eslint-disable-next-line no-param-reassign
      textAreaRef.current.style.height = `${Number(scrollHeight) + 1}px`;
    }
  }, [infoText, isSettingInEditMode]);

  return (
    <AgencySettingsBlock
      id="description"
      isEditModeActive={isSettingInEditMode}
      isAnimationShowing={isAnimationShowing}
      onAnimationEnd={removeAnimation}
    >
      <AgencySettingsBlockTitle>Agency Information</AgencySettingsBlockTitle>
      {isSettingInEditMode ? (
        <>
          <AgencyInfoTextAreaLabel htmlFor="basic-info-description">
            Briefly describe your agency’s purpose and functions (750 characters
            or less).
          </AgencyInfoTextAreaLabel>
          <AgencyInfoTextArea
            id="basic-info-description"
            onChange={(e) => setInfoText(e.target.value)}
            placeholder="Type here..."
            ref={textAreaRef}
            rows={1}
            value={infoText}
            maxLength={750}
          />
          <AgencyInfoTextAreaWordCounter isRed={infoText.length >= 750}>
            {infoText.length}/750 characters
          </AgencyInfoTextAreaWordCounter>
          <EditModeButtonsContainer noMargin>
            <TransparentButton onClick={cancelAgencyInfoChanges}>
              Cancel
            </TransparentButton>
            <FilledButton onClick={saveAgencyInfoChanges}>Save</FilledButton>
          </EditModeButtonsContainer>
        </>
      ) : (
        <>
          <AgencyInfoBlockDescription>
            {settings.PURPOSE_AND_FUNCTIONS}
          </AgencyInfoBlockDescription>
          <EditButtonContainer>
            <EditButton onClick={openSetting}>
              Edit description
              <img src={rightArrow} alt="" />
            </EditButton>
          </EditButtonContainer>
        </>
      )}
    </AgencySettingsBlock>
  );
};
