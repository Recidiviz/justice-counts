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
import { Modal } from "@justice-counts/common/components/Modal";
import React, { useState } from "react";

import { useStore } from "../../stores";
import * as Styled from "./EditModal.styled";

type EditModalProps = {
  title: string;
  childAgencyId: number;
  defaultValue?: string;
  closeModal: () => void;
};

const EditModal = ({
  title,
  defaultValue,
  childAgencyId,
  closeModal,
}: EditModalProps) => {
  const [inputValue, setInputValue] = useState(defaultValue ?? "");

  const { adminPanelStore } = useStore();
  const { saveChildAgencyUploadIdUpdate } = adminPanelStore;

  return (
    <Modal>
      <Styled.ModalContainer>
        <Styled.ModalHeader>
          {title}
          <Styled.CloseButton onClick={closeModal}>&#10005;</Styled.CloseButton>
        </Styled.ModalHeader>
        <Styled.Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Styled.ButtonsContainer>
          <Button label="Cancel" onClick={closeModal} borderColor="lightgrey" />
          <Button
            label="Save"
            onClick={() => {
              saveChildAgencyUploadIdUpdate(String(childAgencyId), inputValue);
              closeModal();
            }}
            buttonColor="blue"
          />
        </Styled.ButtonsContainer>
      </Styled.ModalContainer>
    </Modal>
  );
};

export default EditModal;
