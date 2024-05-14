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
import { NewInput } from "@justice-counts/common/components/Input";
import { Modal } from "@justice-counts/common/components/Modal";
import { validateAgencyURL } from "@justice-counts/common/utils/helperUtils";
import { observer } from "mobx-react-lite";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { useStore } from "../../stores";
import { AgencySettingsModalInputWrapperSmall } from "./AccountSettings.styles";
import { SettingProps } from "./AgencySettings";
import {
  AgencyInfoBlockDescription,
  AgencyInfoLink,
  AgencySettingActionRequiredIndicator,
  AgencySettingsBlock,
  AgencySettingsBlockTitle,
  EditButtonContainer,
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

  const isAgencySettingConfigured = Boolean(homepageUrlSetting);
  const [isURLValid, setIsURLValid] = React.useState(true);
  const [errorMsg, setErrorMsg] = React.useState<
    { message: string } | undefined
  >(undefined);
  const resetErrorHandlingValues = () => {
    setIsURLValid(true);
    setErrorMsg(undefined);
  };
  const handleSaveClick = () => {
    if (validateAgencyURL(urlText) || urlText === "") {
      const updatedSettings = updateAgencySettings(
        "HOMEPAGE_URL",
        urlText,
        parseInt(agencyId)
      );
      resetErrorHandlingValues();
      saveAgencySettings(updatedSettings, agencyId);
      removeEditMode();
      return;
    }
    setIsURLValid(false);
    setErrorMsg({ message: "Invalid Email" });
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
            title="Agency URL"
            description={
              <AgencySettingsModalInputWrapperSmall error={!isURLValid}>
                <NewInput
                  style={{ marginBottom: "0" }}
                  persistLabel
                  value={urlText}
                  error={errorMsg}
                  placeholder="URL of agency (e.g., https://doc.iowa.gov/)"
                  isPlaceholderVisible
                  onChange={(e) => {
                    setUrlText(() => e.target.value.trimStart());
                  }}
                  agencySettingsConfigs
                  fullWidth
                />
              </AgencySettingsModalInputWrapperSmall>
            }
            buttons={[
              {
                label: "Save",
                onClick: () => {
                  handleSaveClick();
                },
              },
            ]}
            modalBackground="opaque"
            onClickClose={handleCancelClick}
            agencySettingsConfigs
          />
        </AgencySettingsEditModeModal>
      )}

      <AgencySettingsBlock withBorder id="homepage_url">
        <AgencySettingsBlockTitle configured={isAgencySettingConfigured}>
          Agency URL
          {!homepageUrlSetting && (
            <AgencySettingActionRequiredIndicator>
              *
            </AgencySettingActionRequiredIndicator>
          )}
        </AgencySettingsBlockTitle>
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
            "Enter your agency's URL"
          )}
        </AgencyInfoBlockDescription>
        {allowEdit && (
          <EditButtonContainer>
            <Button
              label={<>Edit</>}
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
