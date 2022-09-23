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

import React from "react";
import styled from "styled-components/macro";

import {
  ExtendedOpacityGradient,
  UploadedFiles,
  UploadedFilesWrapper,
} from "../components/DataUpload";
import { Button, TextInput, Title, TitleWrapper } from "../components/Forms";
import { typography } from "../components/GlobalStyles";
import { useStore } from "../stores";

const SettingsContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 39px 24px 0 24px;
  position: fixed;
  overflow-y: scroll;
`;

const SettingsFormPanel = styled.div``;

const ButtonWrapper = styled.div`
  display: flex;
  flex: 1 1 auto;
  justify-content: flex-end;
  gap: 10px;
`;

const InputWrapper = styled.div`
  display: flex;
  gap: 10px;

  div {
    width: 100%;
  }
`;

const SettingsFormUploadedFilesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 3 1 auto;
`;

const SettingsTitle = styled.div`
  ${typography.sizeCSS.headline}
  display: flex;
  flex: 1 1 auto;
`;

const AccountSettings = () => {
  const { userStore } = useStore();
  const [email, setEmail] = React.useState<string>(userStore?.email || "");
  const [name, setName] = React.useState<string>(userStore?.name || "");
  return (
    <SettingsContainer>
      <SettingsTitle>Settings</SettingsTitle>

      <SettingsFormUploadedFilesWrapper>
        <SettingsFormPanel>
          <TitleWrapper>
            <Title>Account</Title>
          </TitleWrapper>

          <InputWrapper>
            <TextInput
              persistLabel
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextInput
              persistLabel
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </InputWrapper>

          <ButtonWrapper>
            <Button
              onClick={() => {
                userStore.updateUserNameAndEmail(name, email);
              }}
            >
              Save
            </Button>
          </ButtonWrapper>
        </SettingsFormPanel>

        <UploadedFilesWrapper>
          <TitleWrapper>
            <Title>Uploaded Files</Title>
          </TitleWrapper>
          <UploadedFiles />
          <ExtendedOpacityGradient />
        </UploadedFilesWrapper>
      </SettingsFormUploadedFilesWrapper>
    </SettingsContainer>
  );
};

export default AccountSettings;
