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

import { palette } from "@justice-counts/common/components/GlobalStyles";
import { Modal } from "@justice-counts/common/components/Modal";
import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components/macro";

import { AgencySettingsModalInputWrapperSmall } from "./AccountSettings.styles";

// z-index 101 to be above all
const EditModalOuterWrapper = styled.div`
  position: fixed;
  z-index: 101;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: ${palette.highlight.grey2};
  overflow-y: auto;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const EditModalInnerWrapper = styled.div`
  background-color: ${palette.solid.white};
  width: 693px;
  padding: 24px;
  border-radius: 4px;
`;

const EditModalContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const AgencySettingsEditModeModal: React.FC<{
  children: React.ReactElement;
  isConfirmModalOpen: boolean;
  openCancelModal: () => void;
  closeCancelModal: () => void;
  handleCancelModalConfirm: () => void;
}> = ({
  children,
  isConfirmModalOpen,
  openCancelModal,
  closeCancelModal,
  handleCancelModalConfirm,
}) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const Portal = (
    <>
      <EditModalOuterWrapper onClick={openCancelModal}>
        <EditModalInnerWrapper onClick={(e) => e.stopPropagation()}>
          <EditModalContent>{children}</EditModalContent>
        </EditModalInnerWrapper>
      </EditModalOuterWrapper>
      {isConfirmModalOpen && (
        <Modal
          title="Unsaved changes"
          description={
            <AgencySettingsModalInputWrapperSmall unsavedChanges>
              You have unsaved changes, would you like to leave anyway?
            </AgencySettingsModalInputWrapperSmall>
          }
          buttons={[
            { label: "Cancel", onClick: closeCancelModal },
            { label: "Leave", onClick: handleCancelModalConfirm },
          ]}
          modalBackground="opaque"
          onClickClose={closeCancelModal}
          agencySettingsConfigs
          unsavedChangesConfigs
          agencySettingsAndJurisdictionsTitleConfigs
        />
      )}
    </>
  );

  return createPortal(Portal, document.body);
};
