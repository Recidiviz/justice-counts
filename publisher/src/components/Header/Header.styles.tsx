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
  HEADER_BAR_HEIGHT,
  MIN_DESKTOP_WIDTH,
  palette,
  typography,
} from "@justice-counts/common/components/GlobalStyles";
import styled from "styled-components/macro";

export const HeaderBar = styled.header<{
  bottomBorder?: boolean;
  hide?: boolean;
}>`
  width: 100%;
  height: ${HEADER_BAR_HEIGHT}px;
  display: ${({ hide }) => (hide ? "none" : "flex")};
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  z-index: 3;
  background: ${palette.solid.white};
  padding: 16px 0;

  ${({ bottomBorder }) =>
    bottomBorder && `border-bottom: 1px solid ${palette.highlight.grey3};`}
`;

export const LogoContainer = styled.div`
  height: ${HEADER_BAR_HEIGHT}px;
  width: auto;
  display: flex;
  justify-content: start;
  gap: 24px;
  align-items: center;
  transition: 0.3s ease;

  &:hover {
    cursor: pointer;
    opacity: 0.9;
  }
`;

export const Logo = styled.img`
  width: 64px;
  height: 64px;
`;

export const LogoName = styled.div`
  ${typography.sizeCSS.medium};
  white-space: nowrap;

  @media only screen and (max-width: ${MIN_DESKTOP_WIDTH}px) {
    display: none;
  }
`;
