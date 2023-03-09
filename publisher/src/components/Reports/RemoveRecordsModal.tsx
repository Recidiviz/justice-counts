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

import {
  palette,
  typography,
} from "@justice-counts/common/components/GlobalStyles";
import React from "react";
import styled from "styled-components/macro";

import { ReportActionsButton } from "./Reports.styles";

const RemoveRecordsModalWrapper = styled.div`
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
`;

const RemoveRecordsModalContainer = styled.div`
  width: 582px;
  background-color: ${palette.solid.white};
  padding: 168px 24px 24px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid ${palette.highlight.grey3};
  box-shadow: 0px 4px 30px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
`;

const RemoveRecordsModalTitle = styled.div`
  ${typography.sizeCSS.large};
  margin-bottom: 16px;

  span {
    color: ${palette.solid.red};
  }
`;

const RemoveRecordsModalHint = styled.div`
  ${typography.sizeCSS.normal};
  margin-bottom: 96px;
`;

const RemoveRecordsModalButtonsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const RemoveRecordsModalButton = styled(ReportActionsButton)`
  margin-left: unset;
  ${typography.sizeCSS.normal};
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
          Delete <span>{selectedRecords}</span> record
          {selectedRecords > 1 ? "s" : ""}?
        </RemoveRecordsModalTitle>
        <RemoveRecordsModalHint>
          You can’t undo this action.
        </RemoveRecordsModalHint>
        <RemoveRecordsModalButtonsContainer>
          <RemoveRecordsModalButton onClick={closeModal}>
            No, Cancel
          </RemoveRecordsModalButton>
          <RemoveRecordsModalButton
            buttonColor="red"
            onClick={confirmRemoveRecords}
          >
            Yes, Delete
          </RemoveRecordsModalButton>
        </RemoveRecordsModalButtonsContainer>
      </RemoveRecordsModalContainer>
    </RemoveRecordsModalWrapper>
  );
};
