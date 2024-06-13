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

import {
  palette,
  typography,
} from "@justice-counts/common/components/GlobalStyles";
import { spacing } from "@recidiviz/design-system";
import { rem } from "polished";
import styled from "styled-components/macro";

export const ModalContainer = styled.div`
  width: ${rem(480)};
  background: white;
  padding: 32px 40px;
`;

export const ModalHeader = styled.div`
  display: flex;
  margin-bottom: ${rem(spacing.md)};
`;

export const CloseButton = styled.div`
  font-size: 18px;
  color: ${palette.highlight.grey8};
  margin-left: auto;

  &:hover {
    cursor: pointer;
    color: ${palette.highlight.grey10};
  }
`;

export const Input = styled.input`
  ${typography.paragraph}
  width: 100%;
  height: ${rem(36)};
  color: inherit;
  padding: 0 ${rem(spacing.md)};
  border: 1px solid ${palette.highlight.grey2};
  border-radius: 2px;
  outline: 0;
`;

export const ButtonsContainer = styled.div`
  display: flex;
  justify-content: end;
  gap: ${rem(spacing.md)};
  margin-top: ${rem(spacing.xl)};
`;
