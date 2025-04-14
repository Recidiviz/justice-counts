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

import React, { useEffect } from "react";
import { createPortal } from "react-dom";

import alertIcon from "../../assets/alert-icon.png";
import xCloseLg from "../../assets/close-icon-lg.svg";
import successIcon from "../../assets/success-icon.png";
import warningIcon from "../../assets/warning-icon.svg";
import { Button, ButtonColor } from "../Button";
import * as Styled from "./Modal.styled";
import { ModalBackground, ModalType } from "./types";

type ModalProps = Partial<{
  title: string | React.ReactNode;
  description: string | React.ReactNode;
  buttons: { label: string; onClick: () => void }[];
  modalType: ModalType;
  modalBackground: ModalBackground;
  centerText: boolean;
  centerButtons: boolean;
  mediumTitle: boolean;
  customPadding?: string;
  children?: React.ReactNode;
  onClickClose?: () => void;
  agencySettingsConfigs?: boolean;
  unsavedChangesConfigs?: boolean;
  jurisdictionsSettingsConfigs?: boolean;
  agencySettingsAndJurisdictionsTitleConfigs?: boolean;
  noBottomDiv?: boolean;
  maxHeight?: number;
  fixedTopBottom?: boolean;
}>;

export function Modal({
  title,
  description,
  buttons,
  modalType,
  modalBackground,
  centerText,
  centerButtons,
  mediumTitle,
  customPadding,
  children,
  onClickClose,
  unsavedChangesConfigs,
  jurisdictionsSettingsConfigs,
  agencySettingsAndJurisdictionsTitleConfigs,
  noBottomDiv,
  maxHeight,
  fixedTopBottom,
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
      {children || (
        <Styled.InnerWrapper
          modalType={modalType}
          centerText={centerText}
          customPadding={customPadding}
          noBottomDiv={noBottomDiv}
          maxHeight={maxHeight}
          fixedTopBottom={fixedTopBottom}
        >
          {modalType === "success" && <Styled.Icon src={successIcon} alt="" />}
          {modalType === "warning" && <Styled.Icon src={warningIcon} alt="" />}
          {modalType === "alert" && <Styled.Icon src={alertIcon} alt="" />}
          <Styled.ModalTitleWrapper
            typographyBodyEmphasized
            fixedTopBottom={fixedTopBottom}
          >
            {agencySettingsAndJurisdictionsTitleConfigs && (
              <Styled.AgencySettingsAndJurisdictionsTitle>
                {title}
              </Styled.AgencySettingsAndJurisdictionsTitle>
            )}
            {!agencySettingsAndJurisdictionsTitleConfigs && (
              <Styled.Title mediumTitle={mediumTitle}>{title}</Styled.Title>
            )}
            {onClickClose && (
              <Button
                label={<img src={xCloseLg} alt="Close Button" />}
                onClick={onClickClose}
                agencySettingsConfigs
              />
            )}
          </Styled.ModalTitleWrapper>
          <Styled.Description
            unsetTextAlignment={jurisdictionsSettingsConfigs}
            fixedTopBottom={fixedTopBottom}
          >
            {description}
          </Styled.Description>
          {!unsavedChangesConfigs && (
            <Styled.ButtonsContainer
              modalType={modalType}
              fixedTopBottom={fixedTopBottom}
            >
              {buttons?.map((button, index) => (
                <Button
                  key={button.label}
                  label={button.label}
                  onClick={button.onClick}
                  borderColor={
                    index === buttons.length - 1 ? undefined : "lightgrey"
                  }
                  buttonColor={
                    index === buttons.length - 1
                      ? primaryButtonColor()
                      : undefined
                  }
                />
              ))}
            </Styled.ButtonsContainer>
          )}
          {unsavedChangesConfigs && (
            <Styled.UnsavedChangesButtonsContainer>
              {buttons?.map((button, index) => (
                <Button
                  label={button.label}
                  onClick={button.onClick}
                  labelColor={index === buttons.length - 1 ? "white" : "blue"}
                  buttonColor={
                    index === buttons.length - 1
                      ? primaryButtonColor()
                      : undefined
                  }
                />
              ))}
            </Styled.UnsavedChangesButtonsContainer>
          )}
        </Styled.InnerWrapper>
      )}
    </Styled.OuterWrapper>
  );

  return createPortal(Portal, document.body);
}
