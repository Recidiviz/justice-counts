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

import { ReactComponent as CloseIcon } from "@justice-counts/common/assets/close-icon.svg";
import checkIcon from "@justice-counts/common/assets/status-check-icon.png";
import { showToast } from "@justice-counts/common/components/Toast";
import React, { useState } from "react";

import { Button, Input } from "../primitives/styles";
import {
  ModalCloseButton,
  ModalContainer,
  ModalInnerContainer,
  ModalParagraph,
  ModalScrollContainer,
  ModalTitle,
  ShareBarContainer,
  ShareCheckIcon,
  ShareCurrentViewContainer,
  ShareCurrentViewText,
  ShareEmptyCheckCircle,
} from "./DashboardModal.styles";

export const ShareModal: React.FC<{
  closeModal: () => void;
}> = ({ closeModal }) => {
  const [shareCurrentViewChecked, setShareCurrentViewChecked] =
    useState<boolean>(true);

  const query = new URLSearchParams(window.location.search);
  const metricKeyParam = query.get("metric");
  const shareUrl = shareCurrentViewChecked
    ? window.location.href
    : `${window.location.origin}${window.location.pathname}?metric=${metricKeyParam}`;
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
            <Input readOnly value={shareUrl} />
            <Button
              onClick={() => {
                navigator.clipboard.writeText(shareUrl);
                showToast({
                  message: "Copied!",
                  color: "blue",
                  timeout: 2500,
                  positionNextToIcon: false,
                });
              }}
            >
              Copy URL
            </Button>
          </ShareBarContainer>
          <ShareCurrentViewContainer
            onClick={() => setShareCurrentViewChecked(!shareCurrentViewChecked)}
          >
            {shareCurrentViewChecked ? (
              <ShareCheckIcon src={checkIcon} />
            ) : (
              <ShareEmptyCheckCircle />
            )}
            <ShareCurrentViewText>Share current view</ShareCurrentViewText>
          </ShareCurrentViewContainer>
        </ModalInnerContainer>
      </ModalScrollContainer>
    </ModalContainer>
  );
};
