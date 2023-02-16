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

import { debounce as _debounce } from "lodash";
import React, { useRef } from "react";

import { useStore } from "../../stores";
import { TextInput, Title, TitleWrapper } from "../Forms";
import { InputWrapper, SettingsFormPanel } from ".";

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
    <SettingsFormPanel>
      <TitleWrapper>
        <Title>Account</Title>
      </TitleWrapper>

      <InputWrapper>
        <TextInput
          persistLabel
          label="Full Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            debouncedSave(e.target.value, undefined);
          }}
        />
        <TextInput
          persistLabel
          label="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            debouncedSave(undefined, e.target.value);
          }}
        />
      </InputWrapper>
    </SettingsFormPanel>
  );
};
