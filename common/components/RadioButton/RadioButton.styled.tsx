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

import { palette, typography } from "../GlobalStyles";

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
  disabled?: boolean;
  fullWidth?: boolean;
}>`
  ${typography.sizeCSS.normal}
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 60px;
  padding: 9px 16px;
  border: 1px solid ${palette.highlight.grey4};
  border-radius: 3px;
  transition: 0.2s ease;

  ${({ fullWidth }) => fullWidth && "width: 100%;"};

  &:hover {
    cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
    background-color: ${({ disabled }) =>
      disabled ? "none" : palette.highlight.grey1};
  }
`;
