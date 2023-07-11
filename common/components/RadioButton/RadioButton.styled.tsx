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

import { palette, typography } from "../GlobalStyles";
import { RadioButtonSize, WrapperSpacing } from "./types";

export const RadioButtonsWrapper = styled.form<{
  spacing?: WrapperSpacing;
}>`
  width: 100%;
  margin: ${({ spacing }) =>
    `${spacing?.top || 0}px ${spacing?.right || 0}px ${
      spacing?.bottom || 0
    }px ${spacing?.left || 0}px`};
`;

export const RadioButtonsFieldset = styled.fieldset<{ disabled?: boolean }>`
  border: none;
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 8px;
  ${({ disabled }) => disabled && "opacity: 0.6; pointer-events: none"};
`;

export const RadioButtonWrapper = styled.div`
  display: flex;
  flex: 1 1 0;
`;

export const RadioButtonInput = styled.input<{
  disabled?: boolean;
}>`
  width: 0;
  position: fixed;
  opacity: 0;

  &:focus + label {
    border: ${({ disabled }) =>
      disabled ? "none" : `1px solid ${palette.highlight.grey9}`};
  }

  &:checked + label {
    background-color: ${palette.solid.blue};
    border-color: ${palette.solid.blue};
    color: ${palette.solid.white};
  }

  &:checked + label:hover {
    background-color: ${({ disabled }) =>
      disabled ? "none" : palette.solid.darkblue};
  }

  &:hover {
    cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  }
`;

export const RadioButtonLabel = styled.label<{
  buttonSize?: RadioButtonSize;
  disabled?: boolean;
}>`
  ${typography.sizeCSS.normal}
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 60px;
  width: 100%;
  padding: 9px 16px;
  border: 1px solid ${palette.highlight.grey4};
  border-radius: 3px;
  white-space: nowrap;
  transition: 0.2s ease;

  ${({ buttonSize }) => {
    if (buttonSize === "large")
      return `height: 56px; ${typography.sizeCSS.medium}`;
    return `height: auto; ${typography.sizeCSS.normal}`;
  }};

  &:hover {
    cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
    background-color: ${({ disabled }) =>
      disabled ? "none" : palette.highlight.grey1};
  }
`;
