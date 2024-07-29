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
import styled from "styled-components/macro";

export const Input = styled.input`
  background: ${palette.highlight.grey1};
  border: none;
  color: ${palette.highlight.grey10};
  border-radius: 2px;
  height: 48px;
  text-overflow: ellipsis;
  padding: 14px 16px;
  flex: 1;
  ${typography.sizeCSS.normal}
`;

export const Button = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 9px 16px;
  height: 48px;
  ${typography.sizeCSS.normal}
  background: ${palette.solid.blue};
  color: ${palette.solid.white};
  border-radius: 2px;

  &:hover {
    cursor: pointer;
    background: ${palette.solid.darkblue};
  }
`;
