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

import styled from "styled-components/macro";

import { centerText, palette, typography } from "../GlobalStyles";
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

export const InnerWrapper = styled.div<{
  modalType?: ModalType;
  centerText?: boolean;
}>`
  background-color: ${palette.solid.white};
  width: 100%;
  max-width: 582px;
  padding: ${({ modalType }) => (modalType ? "80px 24px 24px 24px" : "24px")};
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 3px;
  ${centerText}
`;

export const Icon = styled.img`
  width: 64px;
  height: 64px;
  margin-bottom: 24px;
`;

export const Title = styled.div`
  ${typography.sizeCSS.large};
  margin-bottom: 16px;
`;

export const Description = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  ${typography.sizeCSS.normal};
  text-align: center;
`;

export const ButtonsContainer = styled.div<{ modalType?: ModalType }>`
  width: 100%;
  display: flex;
  gap: 12px;

  ${({ modalType }) => {
    if (modalType) return "justify-content: space-between; margin-top: 72px;";
    return "justify-content: end; gap: 16px; margin-top: 24px;";
  }}

  & > div:last-child {
    justify-content: unset;
    margin-left: auto;
  }
`;
