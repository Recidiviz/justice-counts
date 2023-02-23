// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2022 Recidiviz, Inc.
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
  MIN_DESKTOP_WIDTH,
  palette,
  typography,
} from "@justice-counts/common/components/GlobalStyles";
import styled from "styled-components/macro";

export const AccountSettingsWrapper = styled.div`
  @media only screen and (max-width: ${MIN_DESKTOP_WIDTH}px) {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
`;

export const AccountSettingsTitle = styled.h1`
  border-bottom: 1px solid ${palette.highlight.grey9};
  ${typography.sizeCSS.title};
  margin-top: 4px;
  padding-bottom: 14px;

  &::before {
    content: "Account";
  }

  @media only screen and (max-width: ${MIN_DESKTOP_WIDTH}px) {
    border-bottom: none;
    ${typography.sizeCSS.normal};
    margin: 0;
    padding: 0;

    &::before {
      content: "Settings > Your Account";
    }
  }
`;

export const AccountSettingsInputsWrapper = styled.div`
  display: flex;
  gap: 10px;

  div {
    width: 100%;
    margin-bottom: 16px;
  }

  @media only screen and (max-width: ${MIN_DESKTOP_WIDTH}px) {
    flex-direction: column;
    gap: 0;
  }
`;
