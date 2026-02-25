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

import styled from "styled-components/macro";

import { typography } from "../GlobalStyles";
import { NewInput } from "../Input";

export const CheckboxContainer = styled.div``;

export const CheckboxOptionsWrapper = styled.div<{ indent?: number }>`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  ${({ indent }) => indent && `margin-left: ${indent}px;`}
`;

export const CheckboxLabel = styled.div`
  ${typography.body}
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const Checkbox = styled.input`
  min-width: 16px;
  min-height: 16px;
  border: 1px solid red;
`;

export const OtherInput = styled(NewInput)`
  height: 120px;
  gap: unset;
  margin-bottom: 16px;
`;
