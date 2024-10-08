// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2024 Recidiviz, Inc.
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
import { NewInput } from "@justice-counts/common/components/Input";
import { Modal } from "@justice-counts/common/components/Modal";
import { validateAgencyZipcode } from "@justice-counts/common/utils";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { useParams } from "react-router-dom";

import { useStore } from "../../stores";
import { AgencySettingsModalInputWrapperSmall } from "./AccountSettings.styles";
import { SettingProps } from "./AgencySettings";
import {
  AgencyInfoBlockDescription,
  AgencyInfoTextAreaLabel,
  AgencySettingActionRequiredIndicator,
  AgencySettingsBlock,
  AgencySettingsBlockTitle,
  EditButtonContainer,
} from "./AgencySettings.styles";
import { AgencySettingsEditModeModal } from "./AgencySettingsEditModeModal";

const AgencySettingsZipcode: React.FC<{
  settingProps: SettingProps;
}> = ({ settingProps }) => {
  const { isSettingInEditMode, openSetting, removeEditMode, allowEdit } =
    settingProps;

  const { agencyId } = useParams() as { agencyId: string };
  const { agencyStore } = useStore();
  const { currentAgencySettings, updateAgencySettings, saveAgencySettings } =
    agencyStore;
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = React.useState<
    { message: string } | undefined
  >(undefined);
  const [zipcodeText, setZipcodeText] = useState("");

  const checkValidZipcodeSetResetErrorMsg = (zipcodeUpdate: string) => {
    const isValid =
      zipcodeUpdate === "" || validateAgencyZipcode(zipcodeUpdate);
    setErrorMsg(!isValid ? { message: "Invalid Zipcode" } : undefined);
    return isValid;
  };

  const zipcodeSetting =
    (currentAgencySettings?.find(
      (setting) => setting.setting_type === "ZIPCODE"
    )?.value as string) || "";
  const isAgencySettingConfigured = Boolean(zipcodeSetting);

  const handleSaveClick = () => {
    if (checkValidZipcodeSetResetErrorMsg(zipcodeText)) {
      const updatedSettings = updateAgencySettings(
        "ZIPCODE",
        zipcodeText,
        parseInt(agencyId)
      );
      saveAgencySettings(updatedSettings, agencyId);
      removeEditMode();
    }
  };

  const handleCancelClick = () => {
    if (zipcodeSetting === zipcodeText) {
      removeEditMode();
    } else {
      setIsConfirmModalOpen(true);
    }
    setErrorMsg(undefined);
  };

  const handleModalConfirm = () => {
    setZipcodeText(zipcodeSetting || "");
    setIsConfirmModalOpen(false);
    removeEditMode();
  };

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
            title="Agency Zipcode"
            description={
              <>
                <AgencyInfoTextAreaLabel agencyDescriptionConfigs>
                  This zipcode will go on your public-facing dashboard.
                </AgencyInfoTextAreaLabel>
                <AgencySettingsModalInputWrapperSmall
                  error={
                    zipcodeText !== "" && !validateAgencyZipcode(zipcodeText)
                  }
                >
                  <NewInput
                    style={{ marginBottom: "0" }}
                    persistLabel
                    value={zipcodeText}
                    error={errorMsg}
                    placeholder="Enter your agency's zipcode"
                    isPlaceholderVisible
                    maxLength={5}
                    onChange={(e) => {
                      const zipcodeUpdate = e.target.value.replace(/\D/g, "");
                      setZipcodeText(zipcodeUpdate);
                      checkValidZipcodeSetResetErrorMsg(zipcodeUpdate);
                    }}
                    agencySettingsConfigs
                    fullWidth
                    settingsCustomMargin
                  />
                </AgencySettingsModalInputWrapperSmall>
              </>
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
            agencySettingsAndJurisdictionsTitleConfigs
            customPadding="24px 40px 24px 40px"
          />
        </AgencySettingsEditModeModal>
      )}

      <AgencySettingsBlock id="zipcode">
        <AgencySettingsBlockTitle configured={isAgencySettingConfigured}>
          Agency Zipcode
          {!zipcodeSetting && (
            <AgencySettingActionRequiredIndicator>
              *
            </AgencySettingActionRequiredIndicator>
          )}
        </AgencySettingsBlockTitle>
        <AgencyInfoBlockDescription>
          {zipcodeSetting || "Enter your agency's zipcode"}
        </AgencyInfoBlockDescription>
        {allowEdit && (
          <EditButtonContainer>
            <Button
              label={<>Edit</>}
              onClick={() => {
                setZipcodeText(zipcodeSetting);
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

export default observer(AgencySettingsZipcode);
