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

import { ReactComponent as CloseIcon } from "@justice-counts/common/assets/close-icon.svg";
import { showToast } from "@justice-counts/common/components/Toast";
import React from "react";

import { Button, Input } from "../primitives/styles";
import {
  ModalCloseButton,
  ModalContainer,
  ModalInnerContainer,
  ModalParagraph,
  ModalScrollContainer,
  ModalTitle,
  ShareBarContainer,
} from "./DashboardModal.styles";

export const ShareModal: React.FC<{
  closeModal: () => void;
}> = ({ closeModal }) => {
  return (
    <ModalContainer>
      <ModalScrollContainer>
        <ModalCloseButton onClick={closeModal}>
          Close
          <CloseIcon />
        </ModalCloseButton>
        <ModalInnerContainer>
          <ModalTitle>Share</ModalTitle>
          <ModalParagraph>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nec vel vel
            nunc lacus diam varius varius enim risus.
          </ModalParagraph>
          <ShareBarContainer>
            <Input readOnly value={window.location.href} />
            <Button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                showToast("Copied!", false, "blue", 2500, false, false);
              }}
            >
              Copy URL
            </Button>
          </ShareBarContainer>
        </ModalInnerContainer>
      </ModalScrollContainer>
    </ModalContainer>
  );
};
