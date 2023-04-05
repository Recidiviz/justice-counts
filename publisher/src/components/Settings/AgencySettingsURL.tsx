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
import { formatExternalLink } from "@justice-counts/common/components/DataViz/utils";
import { observer } from "mobx-react-lite";
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
  EditArrowImage,
  EditButtonContainer,
  EditModeButtonsContainer,
} from "./AgencySettings.styles";
import { AgencySettingsEditModeModal } from "./AgencySettingsEditModeModal";

const AgencySettingsUrl: React.FC<{
  settingProps: SettingProps;
}> = ({ settingProps }) => {
  const { isSettingInEditMode, openSetting, removeEditMode, allowEdit } =
    settingProps;

  const { agencyId } = useParams() as { agencyId: string };
  const { agencyStore } = useStore();
  const { currentAgencySettings, updateAgencySettings, saveAgencySettings } =
    agencyStore;
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [urlText, setUrlText] = useState("");
  const textAreaRef = useRef<HTMLInputElement | null>(null);

  const homepageUrlSetting =
    currentAgencySettings?.find(
      (setting) => setting.setting_type === "HOMEPAGE_URL"
    )?.value || "";

  const handleSaveClick = () => {
    const updatedSettings = updateAgencySettings(
      "HOMEPAGE_URL",
      urlText,
      parseInt(agencyId)
    );
    saveAgencySettings(updatedSettings, agencyId);
    removeEditMode();
  };
  const handleCancelClick = () => {
    if (homepageUrlSetting === urlText) {
      removeEditMode();
    } else {
      setIsConfirmModalOpen(true);
    }
  };
  const handleModalConfirm = () => {
    setUrlText(homepageUrlSetting || "");
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
            <Button label="Cancel" onClick={handleCancelClick} />
            <Button label="Save" onClick={handleSaveClick} buttonColor="blue" />
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
          {homepageUrlSetting ? (
            <AgencyInfoLink
              href={formatExternalLink(homepageUrlSetting)}
              target="_blank"
            >
              {
                currentAgencySettings?.find(
                  (setting) => setting.setting_type === "HOMEPAGE_URL"
                )?.value
              }
            </AgencyInfoLink>
          ) : (
            "No homepage URL provided."
          )}
        </AgencyInfoBlockDescription>
        {allowEdit && (
          <EditButtonContainer>
            <Button
              label={
                <>
                  Edit URL <EditArrowImage src={rightArrow} alt="" />
                </>
              }
              onClick={() => {
                setUrlText(homepageUrlSetting);
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

export default observer(AgencySettingsUrl);
