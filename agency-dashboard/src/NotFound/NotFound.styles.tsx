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
// eslint-disable-next-line no-restricted-imports
import styled from "styled-components";

export const NotFoundWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
`;

export const NotFoundTitle = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  text-align: center;
  ${typography.sizeCSS.headline};
`;

export const NotFoundText = styled.div`
  ${typography.sizeCSS.large};
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
  align-items: center;
  text-align: center;

  span {
    ${typography.sizeCSS.medium};
  }

  a {
    ${typography.sizeCSS.medium};
    text-decoration: none;
    color: ${palette.solid.blue};
  }
`;
