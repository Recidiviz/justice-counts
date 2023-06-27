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

import React, { useEffect } from "react";
import { createPortal } from "react-dom";

import alertIcon from "../../assets/alert-icon.png";
import successIcon from "../../assets/success-icon.png";
import warningIcon from "../../assets/warning-icon.svg";
import { Button, ButtonColor } from "../Button";
import * as Styled from "./Modal.styled";
import { ModalBackground, ModalType } from "./types";

type ModalProps = {
  title: string | React.ReactNode;
  description: string | React.ReactNode;
  buttons: { label: string; onClick: () => void }[];
  modalType?: ModalType;
  modalBackground?: ModalBackground;
};

export function Modal({
  title,
  description,
  buttons,
  modalType,
  modalBackground,
}: ModalProps) {
  const primaryButtonColor = (): ButtonColor => {
    if (modalType === "alert") return "red";
    if (modalType === "warning") return "green";
    return "blue";
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const Portal = (
    <Styled.OuterWrapper modalBackground={modalBackground}>
      <Styled.InnerWrapper modalType={modalType}>
        {modalType === "success" && <Styled.Icon src={successIcon} alt="" />}
        {modalType === "warning" && <Styled.Icon src={warningIcon} alt="" />}
        {modalType === "alert" && <Styled.Icon src={alertIcon} alt="" />}
        <Styled.Title>{title}</Styled.Title>
        <Styled.Description>{description}</Styled.Description>
        <Styled.ButtonsContainer modalType={modalType}>
          {buttons.map((button, index) => (
            <Button
              label={button.label}
              onClick={button.onClick}
              borderColor={
                index === buttons.length - 1 ? undefined : "lightgrey"
              }
              buttonColor={
                index === buttons.length - 1 ? primaryButtonColor() : undefined
              }
            />
          ))}
        </Styled.ButtonsContainer>
      </Styled.InnerWrapper>
    </Styled.OuterWrapper>
  );

  return createPortal(Portal, document.body);
}
