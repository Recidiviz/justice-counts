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

import { formatExternalLink } from "@justice-counts/common/components/DataViz/utils";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { useStore } from "../../stores";
import rightArrow from "../assets/right-arrow.svg";
import { SettingProps } from "./AgencySettings";
import {
  AgencyInfoBlockDescription,
  AgencyInfoLink,
  AgencyInfoTextAreaLabel,
  AgencyInfoTextInput,
  AgencySettingsBlock,
  AgencySettingsBlockTitle,
  EditButton,
  EditButtonContainer,
  EditModeButtonsContainer,
  FilledButton,
  TransparentButton,
} from "./AgencySettings.styles";
import { AgencySettingsEditModeModal } from "./AgencySettingsEditModeModal";

export const AgencySettingsUrl: React.FC<{
  settingProps: SettingProps;
}> = ({ settingProps }) => {
  const { isSettingInEditMode, openSetting, removeEditMode, allowEdit } =
    settingProps;

  const { agencyId } = useParams();
  const { agencyStore } = useStore();
  const { settings, updateAgencySettings, saveAgencySettings } = agencyStore;
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [urlText, setUrlText] = useState(settings.HOMEPAGE_URL);
  const textAreaRef = useRef<HTMLInputElement | null>(null);

  const handleSaveClick = () => {
    const updatedSettings = updateAgencySettings("HOMEPAGE_URL", urlText);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    saveAgencySettings(updatedSettings, agencyId!);
    removeEditMode();
  };
  const handleCancelClick = () => {
    if (settings.HOMEPAGE_URL === urlText) {
      removeEditMode();
    } else {
      setIsConfirmModalOpen(true);
    }
  };
  const handleModalConfirm = () => {
    setUrlText(settings.HOMEPAGE_URL);
    setIsConfirmModalOpen(false);
    removeEditMode();
  };

  useEffect(() => {
    if (textAreaRef.current) {
      // eslint-disable-next-line no-param-reassign
      textAreaRef.current.style.height = "0px";
      const { scrollHeight } = textAreaRef.current;

      // eslint-disable-next-line no-param-reassign
      textAreaRef.current.style.height = `${Number(scrollHeight) + 1}px`;
    }
  }, [urlText, isSettingInEditMode]);

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
            Agency Homepage URL
          </AgencySettingsBlockTitle>
          <AgencyInfoTextAreaLabel htmlFor="homepage-url">
            Provide a link to your agency&apos;s website.
          </AgencyInfoTextAreaLabel>
          <AgencyInfoTextInput
            id="homepage-url"
            onChange={(e) => setUrlText(e.target.value)}
            placeholder="URL of agency (e.g., https://doc.iowa.gov/)"
            ref={textAreaRef}
            value={urlText}
          />
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
      <AgencySettingsBlock id="homepage_url">
        <AgencySettingsBlockTitle>Agency Homepage URL</AgencySettingsBlockTitle>
        <AgencyInfoBlockDescription>
          {settings.HOMEPAGE_URL ? (
            <AgencyInfoLink
              href={formatExternalLink(settings.HOMEPAGE_URL)}
              target="_blank"
            >
              {settings.HOMEPAGE_URL}
            </AgencyInfoLink>
          ) : (
            "No homepage URL provided."
          )}
        </AgencyInfoBlockDescription>
        {allowEdit && (
          <EditButtonContainer>
            <EditButton onClick={openSetting}>
              Edit URL
              <img src={rightArrow} alt="" />
            </EditButton>
          </EditButtonContainer>
        )}
      </AgencySettingsBlock>
    </>
  );
};
