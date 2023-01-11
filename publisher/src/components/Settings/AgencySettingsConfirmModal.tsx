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

import {
  CancelModalButtonsContainer,
  CancelModalContainer,
  CancelModalRedButton,
  CancelModalWrapper,
  FilledButton,
} from "./AgencySettings.styles";

type Props = {
  isModalOpen: boolean;
  closeModal: () => void;
  handleConfirm: () => void;
};

export const AgencySettingsConfirmModal: React.FC<Props> = ({
  isModalOpen,
  closeModal,
  handleConfirm,
}) => {
  return (
    <CancelModalWrapper isOpen={isModalOpen}>
      <CancelModalContainer>
        Are you sure you would like to cancel your changes?
        <CancelModalButtonsContainer>
          <CancelModalRedButton onClick={closeModal}>No</CancelModalRedButton>
          <FilledButton onClick={handleConfirm}>Yes</FilledButton>
        </CancelModalButtonsContainer>
      </CancelModalContainer>
    </CancelModalWrapper>
  );
};
