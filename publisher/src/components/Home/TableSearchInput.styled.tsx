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

import {
  palette,
  typography,
} from "@justice-counts/common/components/GlobalStyles";
import { spacing } from "@recidiviz/design-system";
import { rem } from "polished";
import styled from "styled-components/macro";

export const InputWrapper = styled.div`
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  gap: ${rem(spacing.sm)};
  min-width: ${rem(350)};
  padding: ${rem(spacing.sm)} ${rem(spacing.md)};
  border-radius: 4px;
  border: 1px solid ${palette.highlight.grey2};
`;

export const Input = styled.input`
  ${typography.paragraph}
  width: 100%;
  border: 0;
  outline: 0;
`;

export const ClearButton = styled.button`
  height: 60%;
  position: absolute;
  right: ${rem(spacing.md)};
  border: 0;
  padding: 0;
  background: transparent;
  color: ${palette.highlight.grey8};
  cursor: pointer;
`;
