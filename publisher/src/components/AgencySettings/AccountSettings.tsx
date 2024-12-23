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
import { validateEmail } from "@justice-counts/common/utils/helperUtils";
import React from "react";

import { useStore } from "../../stores";
import {
  AccountSettingsInputsWrapper,
  AccountSettingsSectionCol,
  AccountSettingsSectionData,
  AccountSettingsSectionLabel,
  AccountSettingsWrapper,
  AgencySettingsModalInputWrapperSmall,
} from "./AccountSettings.styles";
import { EditButtonContainer } from "./AgencySettings.styles";

enum EditType {
  Name_edit = "name",
  Email_edit = "email",
}

export const AccountSettings = () => {
  const { userStore } = useStore();
  const [email, setEmail] = React.useState<string>(userStore?.email || "");
  const [name, setName] = React.useState<string>(userStore?.name || "");
  const [isSettingInEditMode, setIsSettingInEditMode] =
    React.useState<boolean>(false);
  const [editType, setEditType] = React.useState<string | undefined>(undefined);
  const [isEmailValid, setIsEmailValid] = React.useState(true);
  const [errorMsg, setErrorMsg] = React.useState<
    { message: string } | undefined
  >(undefined);
  const onClickClose = () => {
    setEmail(userStore?.email || "");
    resetEditModeTypeStates();
    setName(userStore?.name || "");
    setIsSettingInEditMode(false);
  };
  const resetEditModeTypeStates = () => {
    setIsSettingInEditMode(false);
    setEditType(undefined);
  };
  const checkValidEmailUpdateErrorStates = (emailUpdate?: string) => {
    const isValid: boolean = validateEmail(emailUpdate || "");
    setIsEmailValid(isValid);
    setErrorMsg(!isValid ? { message: "Invalid Email" } : undefined);
    return isValid;
  };
  const saveNameEmailChange = (nameUpdate?: string, emailUpdate?: string) => {
    if (nameUpdate) {
      resetEditModeTypeStates();
      return userStore.updateUserNameAndEmail(nameUpdate, email);
    }
    if (checkValidEmailUpdateErrorStates(emailUpdate)) {
      resetEditModeTypeStates();
      return userStore.updateUserNameAndEmail(name, String(emailUpdate));
    }
  };
  return (
    <>
      {isSettingInEditMode && (
        <>
          {editType === EditType.Name_edit && (
            <Modal
              title="Name"
              description={
                <AgencySettingsModalInputWrapperSmall>
                  <NewInput
                    style={{ marginBottom: "0" }}
                    persistLabel
                    value={name}
                    onChange={(e) => {
                      setName(() => e.target.value.trimStart());
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
                    saveNameEmailChange(name);
                  },
                },
              ]}
              modalBackground="opaque"
              onClickClose={onClickClose}
              agencySettingsConfigs
              agencySettingsAndJurisdictionsTitleConfigs
              customPadding="24px 40px 40px 24px"
            />
          )}
          {editType === EditType.Email_edit && (
            <Modal
              title="Email"
              description={
                <AgencySettingsModalInputWrapperSmall error={!isEmailValid}>
                  <NewInput
                    style={{ marginBottom: "0" }}
                    persistLabel
                    value={email}
                    error={errorMsg}
                    onChange={(e) => {
                      const emailUpdate = e.target.value.trimStart();
                      setEmail(emailUpdate);
                      checkValidEmailUpdateErrorStates(emailUpdate);
                    }}
                    fullWidth
                    settingsCustomMargin
                  />
                </AgencySettingsModalInputWrapperSmall>
              }
              buttons={[
                {
                  label: "Save",
                  onClick: () => {
                    saveNameEmailChange(undefined, email);
                  },
                },
              ]}
              modalBackground="opaque"
              onClickClose={onClickClose}
              agencySettingsConfigs
              agencySettingsAndJurisdictionsTitleConfigs
              customPadding="24px 40px 24px 40px"
            />
          )}
        </>
      )}
      <AccountSettingsWrapper>
        <AccountSettingsInputsWrapper>
          <AccountSettingsSectionCol>
            <AccountSettingsSectionLabel>Name</AccountSettingsSectionLabel>
            <AccountSettingsSectionData>{name}</AccountSettingsSectionData>
            <EditButtonContainer>
              <Button
                label={<>Edit</>}
                onClick={() => {
                  setIsSettingInEditMode(true);
                  setEditType(EditType.Name_edit);
                }}
                labelColor="blue"
                noSidePadding
                noTopBottomPadding
                noHover
              />
            </EditButtonContainer>
          </AccountSettingsSectionCol>
          <AccountSettingsSectionCol>
            <AccountSettingsSectionLabel>Email</AccountSettingsSectionLabel>
            <AccountSettingsSectionData>{email}</AccountSettingsSectionData>
            <EditButtonContainer>
              <Button
                label={<>Edit</>}
                onClick={() => {
                  setIsSettingInEditMode(true);
                  setEditType(EditType.Email_edit);
                }}
                labelColor="blue"
                noSidePadding
                noTopBottomPadding
                noHover
              />
            </EditButtonContainer>
          </AccountSettingsSectionCol>
        </AccountSettingsInputsWrapper>
      </AccountSettingsWrapper>
    </>
  );
};
