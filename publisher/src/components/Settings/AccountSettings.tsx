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
import { debounce as _debounce } from "lodash";
import React, { useRef } from "react";

import { useStore } from "../../stores";
import {
  AccountSettingsInputsWrapper,
  AccountSettingsSectionCol,
  AccountSettingsSectionData,
  AccountSettingsSectionLabel,
  AccountSettingsWrapper,
} from "./AccountSettings.styles";
import { EditButtonContainer } from "./AgencySettings.styles";

export const AccountSettings = () => {
  const { userStore } = useStore();
  const [email, setEmail] = React.useState<string>(userStore?.email || "");
  const [name, setName] = React.useState<string>(userStore?.name || "");
  const [isSettingInEditMode, setIsSettingInEditMode] =
    React.useState<boolean>(false);

  const onClickClose = () => {
    setIsSettingInEditMode(!isSettingInEditMode);
  };
  const saveNameEmailChange = (nameUpdate?: string, emailUpdate?: string) => {
    if (nameUpdate || emailUpdate) {
      setIsSettingInEditMode(!isSettingInEditMode);
      return userStore.updateUserNameAndEmail(
        nameUpdate ?? name,
        emailUpdate ?? email
      );
    }
  };

  const debouncedSave = useRef(_debounce(saveNameEmailChange, 1500)).current;

  return (
    <>
      {isSettingInEditMode && (
        <Modal
          title="Name"
          description={
            <AccountSettingsInputsWrapper>
              <NewInput
                style={{ marginBottom: "0" }}
                persistLabel
                label="Full Name"
                value={name}
                onChange={(e) => {
                  setName(() => e.target.value.trimStart());
                }}
              />
            </AccountSettingsInputsWrapper>
          }
          buttons={[
            {
              label: "Save",
              onClick: () => {
                saveNameEmailChange(name);
                setIsSettingInEditMode(!isSettingInEditMode);
              },
            },
          ]}
          modalBackground="opaque"
          onClickClose={onClickClose}
        />
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
          </AccountSettingsSectionCol>
        </AccountSettingsInputsWrapper>
      </AccountSettingsWrapper>
    </>
  );
};
