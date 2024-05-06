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

import { NewInput } from "@justice-counts/common/components/Input";
import { debounce as _debounce } from "lodash";
import React, { useRef } from "react";

import { useStore } from "../../stores";
import {
  AccountSettingsInputsCol,
  AccountSettingsInputsWrapper,
  AccountSettingsWrapper,
} from "./AccountSettings.styles";

export const AccountSettings = () => {
  const { userStore } = useStore();
  const [email, setEmail] = React.useState<string>(userStore?.email || "");
  const [name, setName] = React.useState<string>(userStore?.name || "");

  const saveNameEmailChange = (nameUpdate?: string, emailUpdate?: string) => {
    if (nameUpdate) {
      return userStore.updateUserNameAndEmail(nameUpdate, email);
    }
    if (emailUpdate) {
      return userStore.updateUserNameAndEmail(name, emailUpdate);
    }
  };

  const debouncedSave = useRef(_debounce(saveNameEmailChange, 1500)).current;

  return (
    <AccountSettingsWrapper>
      <AccountSettingsInputsWrapper>
        <AccountSettingsInputsCol>
          <NewInput
            style={{ marginBottom: "0" }}
            persistLabel
            label=" Name"
            value={name}
            onChange={(e) => {
              setName((prev) => e.target.value.trimStart() || prev);
              debouncedSave(
                e.target.value.trimStart() || userStore?.name,
                undefined
              );
            }}
          />
          <span>
            <a href="./namemodal">Edit</a>
          </span>
        </AccountSettingsInputsCol>
        <AccountSettingsInputsCol>
          <NewInput
            persistLabel
            label="Email"
            value={email}
            onChange={(e) => {
              setEmail((prev) => e.target.value.trimStart() || prev);
              debouncedSave(
                undefined,
                e.target.value.trimStart() || userStore?.email
              );
            }}
          />
          <span>
            <a href="./emailmodal">Edit</a>
          </span>
        </AccountSettingsInputsCol>
      </AccountSettingsInputsWrapper>
    </AccountSettingsWrapper>
  );
};
