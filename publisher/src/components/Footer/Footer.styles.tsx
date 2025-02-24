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
  MIN_TABLET_WIDTH,
  palette,
  PANEL_RIGHT_TOP_BUTTONS_CONTAINER_HEIGHT,
  typography,
} from "@justice-counts/common/components/GlobalStyles";
import styled from "styled-components/macro";

export const FooterWrapper = styled.footer<{ isPageDataUpload?: boolean }>`
  padding: 14px 24px;
  z-index: ${({ isPageDataUpload }) => (isPageDataUpload ? "5" : "0")};
  width: 100%;
  min-height: ${PANEL_RIGHT_TOP_BUTTONS_CONTAINER_HEIGHT + 1}px;
  background-color: ${palette.solid.darkgrey};

  a {
    display: flex;
    flex-direction: column;
    gap: 14px;
    align-items: start;
    text-decoration: none;

    @media only screen and (min-width: ${MIN_TABLET_WIDTH + 1}px) {
      pointer-events: none;
      cursor: default;
    }
  }
`;

export const FooterTop = styled.div`
  ${typography.sizeCSS.small};
  color: #a1a9b8;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const FooterTopRight = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const FooterTopRightLogo = styled.img`
  width: 15px;
  height: 16px;
`;

export const FooterBottom = styled(FooterTop)``;

export const FooterBottomText = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 10px;
  line-height: 12px;
  color: #a1a9b8;
  margin-right: 74px;
`;

export const FooterBottomLogos = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;
