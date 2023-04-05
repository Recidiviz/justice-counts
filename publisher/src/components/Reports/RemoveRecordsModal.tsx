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
import {
  palette,
  typography,
} from "@justice-counts/common/components/GlobalStyles";
import React from "react";
import styled from "styled-components/macro";

import { REPORT_LOWERCASE } from "../Global/constants";

export const RemoveRecordsModalWrapper = styled.div`
  position: fixed;
  top: 0;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 0 24px;
`;

export const RemoveRecordsModalContainer = styled.div`
  width: 100%;
  max-width: 582px;
  background-color: ${palette.solid.white};
  padding: 168px 24px 24px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid ${palette.highlight.grey3};
  box-shadow: 0px 4px 30px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
`;

export const RemoveRecordsModalTitle = styled.div`
  ${typography.sizeCSS.large};
  margin-bottom: 16px;

  span {
    color: ${palette.solid.red};
  }
`;

export const RemoveRecordsModalHint = styled.div`
  ${typography.sizeCSS.normal};
  margin-bottom: 96px;
`;

export const RemoveRecordsModalButtonsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

type RemoveRecordsModalProps = {
  selectedRecords: number;
  closeModal: () => void;
  confirmRemoveRecords: () => void;
};

export const RemoveRecordsModal: React.FC<RemoveRecordsModalProps> = ({
  selectedRecords,
  closeModal,
  confirmRemoveRecords,
}) => {
  return (
    <RemoveRecordsModalWrapper>
      <RemoveRecordsModalContainer>
        <RemoveRecordsModalTitle>
          Delete <span>{selectedRecords}</span> {REPORT_LOWERCASE}
          {selectedRecords > 1 ? "s" : ""}?
        </RemoveRecordsModalTitle>
        <RemoveRecordsModalHint>
          You can’t undo this action.
        </RemoveRecordsModalHint>
        <RemoveRecordsModalButtonsContainer>
          <Button
            label="No, Cancel"
            onClick={closeModal}
            borderColor="lightgrey"
          />
          <Button
            label="Yes, Delete"
            onClick={confirmRemoveRecords}
            buttonColor="red"
          />
        </RemoveRecordsModalButtonsContainer>
      </RemoveRecordsModalContainer>
    </RemoveRecordsModalWrapper>
  );
};
