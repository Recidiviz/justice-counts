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
  AGENCY_DASHBOARD_HEADER_BAR_HEIGHT,
  HEADER_BAR_HEIGHT,
  palette,
  typography,
} from "@justice-counts/common/components/GlobalStyles";
import styled from "styled-components/macro";

export const WelcomeHeaderBarContainer = styled.header`
  width: 100%;
  height: ${AGENCY_DASHBOARD_HEADER_BAR_HEIGHT}px;
  display: flex;
  justify-content: center;
  align-items: start;
  position: fixed;
  top: 0;
  z-index: 3;
  background: ${palette.solid.white};
  border-bottom: 1px solid ${palette.highlight.grey5};
`;

export const WelcomeLogoTitle = styled.div`
  background-color: ${palette.solid.darkgrey};
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  padding: 12px 24px;
  font-family: VitesseSSm, sans-serif;
  ${typography.sizeCSS.large};
  color: ${palette.solid.white};
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
`;

export const HeaderBarContainer = styled.header`
  width: 100%;
  height: ${HEADER_BAR_HEIGHT}px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  z-index: 3;
  background: ${palette.solid.white};
  border-bottom: 1px solid ${palette.highlight.grey4};
  ${typography.sizeCSS.normal};
`;

export const LogoBlock = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  gap: 32px;
`;

export const LinksBlock = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: end;
  gap: 32px;
  padding-right: 40px;
`;

export const Link = styled.a`
  text-decoration: none;
  cursor: pointer;
  color: ${palette.solid.darkgrey};
`;
