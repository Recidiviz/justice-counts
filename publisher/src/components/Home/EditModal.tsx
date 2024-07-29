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
import { showToast } from "@justice-counts/common/components/Toast";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";

import { useStore } from "../../stores";
import * as Styled from "./EditModal.styled";

type EditModalProps = {
  title: string;
  childAgencyId: number;
  defaultValue?: string;
  closeModal: () => void;
  setUpdatedUploadId: (updatedUploadId?: string) => void;
};

const EditModal = ({
  title,
  defaultValue,
  childAgencyId,
  closeModal,
  setUpdatedUploadId,
}: EditModalProps) => {
  const [inputValue, setInputValue] = useState(defaultValue ?? "");

  const { homeStore } = useStore();
  const { saveChildAgencyUploadIdUpdate, undoChildAgencyUploadIdUpdate } =
    homeStore;

  const undoUploadIdValueUpdate = async () => {
    const undoResponse = await undoChildAgencyUploadIdUpdate(
      String(childAgencyId),
      defaultValue
    );
    if (
      undoResponse &&
      "status" in undoResponse &&
      undoResponse.status === 200
    ) {
      setUpdatedUploadId(defaultValue);
    }
  };

  const updateUploadIdValue = async () => {
    const updateResponse = await saveChildAgencyUploadIdUpdate(
      String(childAgencyId),
      inputValue
    );

    if (
      updateResponse &&
      "status" in updateResponse &&
      updateResponse.status === 200
    ) {
      showToast({
        message: `Upload ID saved`,
        check: true,
        buttons: [
          {
            label: "undo",
            fn: undoUploadIdValueUpdate,
          },
        ],
        timeout: 5000,
      });
      setUpdatedUploadId(inputValue);
      closeModal();
    }
  };

  return (
    <Modal>
      <Styled.ModalContainer>
        <Styled.ModalHeader>
          {title}
          <Styled.CloseButton onClick={closeModal}>&#10005;</Styled.CloseButton>
        </Styled.ModalHeader>
        <Styled.Input
          placeholder="Enter custom name"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Styled.ButtonsContainer>
          <Button label="Cancel" onClick={closeModal} borderColor="lightgrey" />
          <Button
            label="Save"
            onClick={updateUploadIdValue}
            buttonColor="blue"
          />
        </Styled.ButtonsContainer>
      </Styled.ModalContainer>
    </Modal>
  );
};

export default observer(EditModal);
