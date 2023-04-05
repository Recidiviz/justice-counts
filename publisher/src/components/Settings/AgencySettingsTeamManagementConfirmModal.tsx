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

import removeWarningIcon from "@justice-counts/common/assets/remove-warning-icon.png";
import { Button } from "@justice-counts/common/components/Button";
import { typography } from "@justice-counts/common/components/GlobalStyles";
import React from "react";
import { createPortal } from "react-dom";
import styled from "styled-components/macro";

import {
  ConfirmModalButtonsContainer,
  ConfirmModalContent,
  ConfirmModalInnerWrapper,
  ConfirmModalOuterWrapper,
} from "./AgencySettingsConfirmModal";

const TeamManagementModalOuterWrapper = styled(ConfirmModalOuterWrapper)`
  background-color: rgb(220, 221, 223);
`;

const TeamManagementModalInnerWrapper = styled(ConfirmModalInnerWrapper)`
  padding: 80px 24px 24px 24px;
`;

const TeamManagementModalContent = styled(ConfirmModalContent)`
  align-items: center;
`;

const ModalWarningIcon = styled.img`
  width: 64px;
  height: 64px;
  margin-bottom: 24px;
`;

const ModalWarningText = styled.div`
  ${typography.sizeCSS.large};
  margin-bottom: 16px;
`;

const ModalInfoText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  ${typography.sizeCSS.normal};
  margin-bottom: 72px;
`;

const TeamManagementModalButtonsContainer = styled(
  ConfirmModalButtonsContainer
)`
  width: 100%;
  justify-content: space-between;
`;

type Props = {
  userName?: string;
  closeModal: () => void;
  handleConfirm: () => void;
};

export const AgencySettingsTeamManagementConfirmModal: React.FC<Props> = ({
  userName,
  closeModal,
  handleConfirm,
}) => {
  const Portal = (
    <TeamManagementModalOuterWrapper>
      <TeamManagementModalInnerWrapper>
        <TeamManagementModalContent>
          <ModalWarningIcon src={removeWarningIcon} alt="" />
          <ModalWarningText>This action cannot be undone</ModalWarningText>
          <ModalInfoText>
            Are you sure you want to remove <span>{userName}</span>
          </ModalInfoText>
          <TeamManagementModalButtonsContainer>
            <Button label="Cancel" onClick={closeModal} />
            <Button
              label="Remove from agency"
              onClick={handleConfirm}
              buttonColor="red"
            />
          </TeamManagementModalButtonsContainer>
        </TeamManagementModalContent>
      </TeamManagementModalInnerWrapper>
    </TeamManagementModalOuterWrapper>
  );

  return createPortal(Portal, document.body);
};
