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
// eslint-disable-next-line no-restricted-imports
import styled from "styled-components";

import { palette, typography } from "../GlobalStyles";

export const ToggleSwitchContainer = styled.div<{ checked?: boolean }>`
  ${typography.sizeCSS.normal};
  display: flex;
  align-items: center;
  padding: 8px 0;
  gap: 8px;
  color: ${({ checked }) =>
    checked ? palette.solid.darkgrey : palette.highlight.grey7};
`;

export const ToggleSwitchWrapper = styled.label`
  position: relative;
  display: inline-block;
  width: 38px;
  height: 22px;
`;

export const ToggleSwitchInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background-color: ${palette.solid.blue};
  }

  &:checked + span:before {
    transform: translateX(15px);
  }
`;

export const Slider = styled.span<{ disabled?: boolean }>`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${palette.highlight.grey3};
  border-radius: 34px;
  transition: 0.3s;

  ${({ disabled }) => disabled && "opacity: 0.6; pointer-events: none"};

  &:before {
    content: "";
    height: 16px;
    width: 16px;
    position: absolute;
    left: 4px;
    bottom: 3px;
    background-color: ${palette.solid.white};
    border-radius: 50%;
    transition: 0.3s;
  }
`;
