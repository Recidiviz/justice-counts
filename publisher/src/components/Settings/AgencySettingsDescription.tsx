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
import { NewInput } from "@justice-counts/common/components/Input";
import { Modal } from "@justice-counts/common/components/Modal";
// import { info } from "autoprefixer";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { useParams } from "react-router-dom";

import { useStore } from "../../stores";
import { AgencySettingsModalInputWrapperLarge } from "./AccountSettings.styles";
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
  const isAgencySettingConfigured = Boolean(purposeAndFunctionsSetting);

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
            title="Agency Description"
            description={
              <>
                <AgencyInfoTextAreaLabel agencyDescriptionConfigs>
                  This description will go on your public-facing dashboard.
                </AgencyInfoTextAreaLabel>
                <AgencySettingsModalInputWrapperLarge>
                  <NewInput
                    style={{ marginBottom: "0" }}
                    persistLabel
                    value={infoText}
                    placeholder="Write a description of your agency"
                    isPlaceholderVisible
                    multiline
                    maxLength={750}
                    onChange={(e) => setInfoText(e.target.value)}
                    fullWidth
                  />
                </AgencySettingsModalInputWrapperLarge>
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
          />
        </AgencySettingsEditModeModal>
      )}

      <AgencySettingsBlock id="description">
        <AgencySettingsBlockTitle configured={isAgencySettingConfigured}>
          Agency Description
          {!purposeAndFunctionsSetting && (
            <AgencySettingActionRequiredIndicator>
              *
            </AgencySettingActionRequiredIndicator>
          )}
        </AgencySettingsBlockTitle>
        <AgencyInfoBlockDescription>
          {purposeAndFunctionsSetting ||
            "Write a description of your agency to go on your public facing dashboard"}
        </AgencyInfoBlockDescription>
        {allowEdit && (
          <EditButtonContainer>
            <Button
              label={<>Edit</>}
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
