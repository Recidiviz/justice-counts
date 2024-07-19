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

// eslint-disable-next-line no-restricted-imports
import styled from "styled-components";

import { centerTextCSS, palette, typography } from "../GlobalStyles";
import { ModalBackground, ModalType } from "./types";

export const OuterWrapper = styled.div<{
  modalBackground?: ModalBackground;
}>`
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  padding: 8px;
  display: flex;
  justify-content: center;
  align-items: center;

  background-color: ${({ modalBackground }) => {
    if (modalBackground === "opaque") return "rgb(220, 221, 223)";
    return palette.highlight.grey2;
  }};
`;

const innerWrapperPadding = ({
  modalType,
  customPadding,
}: {
  modalType?: ModalType;
  customPadding?: string;
}) => {
  if (customPadding !== undefined) {
    return customPadding;
  }
  if (modalType) {
    return "80px 24px 24px 24px";
  }
  return "24px";
};

export const InnerWrapper = styled.div<{
  modalType?: ModalType;
  centerText?: boolean;
  customPadding?: string;
  noBottomDiv?: boolean;
}>`
  background-color: ${palette.solid.white};
  width: 100%;
  max-width: 582px;
  padding: ${innerWrapperPadding};
  display: flex;
  flex-direction: column;
  ${({ centerText }) => centerText && `align-items: center;`};
  border-radius: 3px;
  ${centerTextCSS}
  ${({ noBottomDiv }) => {
    if (noBottomDiv) {
      return `& > div:last-child {display: none;}`;
    }
  }};
`;

export const Icon = styled.img`
  width: 64px;
  height: 64px;
  margin-bottom: 24px;
`;

export const Title = styled.div<{
  mediumTitle?: boolean;
}>`
  ${({ mediumTitle }) =>
    mediumTitle
      ? `${typography.sizeCSS.medium}`
      : `${typography.sizeCSS.large}`};
  margin-top: 16px;
  margin-bottom: 16px;
  a {
    color: ${palette.solid.blue};
    text-decoration: none;
  }
`;

export const AgencySettingsAndJurisdictionsTitle = styled.div`
  ${typography.bodyEmphasized}
  margin-bottom: 16px;
  margin-top: 16px;
  a {
    color: ${palette.solid.blue};
    text-decoration: none;
  }
`;

export const Description = styled.div<{
  centerText?: boolean;
  unsetTextAlignment?: boolean;
}>`
  display: flex;
  flex-direction: column;
  align-items: ${({ centerText, unsetTextAlignment }) => {
    if (centerText) {
      return `align-items: center;`;
    }
    if (unsetTextAlignment) {
      return `align-items: unset;`;
    }
  }};
  ${typography.sizeCSS.normal};
  font-weight: 400;
`;

export const ButtonsContainer = styled.div<{
  modalType?: ModalType;
  centerButtons?: boolean;
}>`
  width: 100%;
  display: flex;
  gap: 12px;
  ${({ modalType, centerButtons }) => {
    if (centerButtons) return "justify-content: center; margin-top: 72px;";
    if (modalType) return "justify-content: space-between; margin-top: 72px;";
    return "justify-content: end; gap: 16px; margin-top: 24px;";
  }}

  & > div:last-child {
    justify-content: unset;
    margin-left: auto;
  }
`;

export const UnsavedChangesButtonsContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: end;
  gap: 16px;
  margin-top: 64px;
  & > div:first-child {
    div {
      border: none;
    }
  }
`;

export const ModalTitleWrapper = styled.div<{
  typographyBodyEmphasized?: boolean;
}>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  ${({ typographyBodyEmphasized }) =>
    typographyBodyEmphasized ? `${typography.bodyEmphasized}` : ""};
`;
