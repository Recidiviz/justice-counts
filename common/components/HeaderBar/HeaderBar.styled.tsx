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

import {
  HEADER_BAR_HEIGHT,
  MIN_DESKTOP_WIDTH,
  MIN_TABLET_WIDTH,
  palette,
  typography,
} from "../GlobalStyles";
import { HeaderBarBackground } from "./types";

export const HeaderBar = styled.div<{
  background?: HeaderBarBackground;
  hasBottomBorder?: boolean;
  noPaddingInSmallScreenWidth?: boolean;
}>`
  width: 100%;
  height: ${HEADER_BAR_HEIGHT}px;
  padding: 16px 24px 16px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 3;

  background: ${({ background }) => {
    if (background === "transparent") return "transparent";
    if (background === "blue") return palette.solid.blue;
    return palette.solid.white;
  }};

  border-bottom: ${({ hasBottomBorder }) =>
    hasBottomBorder ? `1px solid ${palette.highlight.grey3}` : "none"};

  ${({ noPaddingInSmallScreenWidth }) =>
    noPaddingInSmallScreenWidth &&
    `
      @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
        padding: 0;
      }
  `}
`;

export const LogoContainer = styled.div`
  height: ${HEADER_BAR_HEIGHT}px;
  width: auto;
  padding-right: 1px;
  display: flex;
  justify-content: start;
  align-items: center;
  transition: 0.3s ease;
  gap: 0.5px;

  &:hover {
    cursor: pointer;
    opacity: 0.9;
  }
`;

export const LogoImg = styled.img`
  width: 64px;
  height: 64px;
`;

export const Label = styled.div`
  ${typography.sizeCSS.medium};
  white-space: nowrap;

  @media only screen and (max-width: ${MIN_DESKTOP_WIDTH}px) {
    display: none;
  }
`;
