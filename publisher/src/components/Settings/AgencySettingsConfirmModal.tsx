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

import {
  palette,
  typography,
} from "@justice-counts/common/components/GlobalStyles";
import React from "react";
import { createPortal } from "react-dom";
import styled from "styled-components/macro";

import { FilledButton, TransparentButton } from "./AgencySettings.styles";

// z-index 102 to be above all content including edit mode modal
// also portal this modal as well as edit mode to not deal
// with effect bubbling in case it is child of edit mode modal
export const ConfirmModalOuterWrapper = styled.div`
  position: fixed;
  z-index: 102;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: ${palette.highlight.grey2};
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ConfirmModalInnerWrapper = styled.div`
  background-color: ${palette.solid.white};
  width: 582px;
  padding: 24px;
  border-radius: 4px;
`;

export const ConfirmModalContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const ConfirmModalTitle = styled.div`
  ${typography.sizeCSS.large};
  margin-bottom: 8px;
`;

const ConfirmModalText = styled.div`
  ${typography.sizeCSS.normal};
  margin-bottom: 24px;
`;

export const ConfirmModalButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: end;
  gap: 16px;
`;

type Props = {
  closeModal: () => void;
  handleConfirm: () => void;
};

export const AgencySettingsConfirmModal: React.FC<Props> = ({
  closeModal,
  handleConfirm,
}) => {
  const Portal = (
    <ConfirmModalOuterWrapper>
      <ConfirmModalInnerWrapper>
        <ConfirmModalContent>
          <ConfirmModalTitle>Unsaved changes</ConfirmModalTitle>
          <ConfirmModalText>
            You have unsaved changes, would like to leave anyway?
          </ConfirmModalText>
          <ConfirmModalButtonsContainer>
            <TransparentButton onClick={closeModal}>Cancel</TransparentButton>
            <FilledButton onClick={handleConfirm}>Okay</FilledButton>
          </ConfirmModalButtonsContainer>
        </ConfirmModalContent>
      </ConfirmModalInnerWrapper>
    </ConfirmModalOuterWrapper>
  );

  return createPortal(Portal, document.body);
};
