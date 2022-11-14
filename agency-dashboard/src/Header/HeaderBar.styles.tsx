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
  HEADER_BAR_HEIGHT,
  palette,
  TABLET_WIDTH,
  typography,
} from "@justice-counts/common/components/GlobalStyles";
import React from "react";
import styled from "styled-components/macro";

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
  padding: 16px 0;
  border-bottom: 1px solid ${palette.highlight.grey5};
`;

export const LogoContainer = styled.div`
  height: ${HEADER_BAR_HEIGHT}px;
  width: ${HEADER_BAR_HEIGHT}px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${palette.solid.green};
  transition: 0.3s ease;

  &:hover {
    cursor: pointer;
    opacity: 0.9;
  }
`;

export const Logo = styled.img`
  width: 48px;
  height: 48px;
`;

export const HeaderTitle = styled.div`
  flex-grow: 1;
  padding-left: 16px;
`;

export const HeaderButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

export const HeaderButton = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 64px;
  padding-right: 12px;
  padding-left: 12px;
  background: none;
  border: none;
  ${typography.sizeCSS.normal}

  &:hover {
    cursor: pointer;
    color: ${palette.solid.blue};
  }

  &:hover rect {
    fill: ${palette.solid.blue};
  }

  &:last-child {
    padding-right: 24px;
  }
`;

export const AboutModalContainer = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: ${palette.solid.green};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const AboutModalInnerContainer = styled.div`
  position: relative;
  flex-basis: 864px;
  flex-grow: 0;
  flex-shrink: 1;
  border-top: 1px solid ${palette.highlight.white};
  padding-top: 24px;
  margin: 24px;
`;

export const AboutModalLogo = styled.img`
  width: 96px;
  height: 96px;
`;

export const AboutModalTitle = styled.div`
  ${typography.sizeCSS.title}
  font-weight: 400;
  margin-top: 16px;
  margin-bottom: 64px;
  color: ${palette.solid.white};
`;

export const AboutModalCloseButton = styled.div`
  ${typography.sizeCSS.medium}
  font-weight: 400;
  padding-top: 24px;
  padding-left: 16px;
  padding-bottom: 16px;
  color: ${palette.solid.white};
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;

  &:hover {
    cursor: pointer;
    opacity: 0.85;
  }
`;

export const AboutModalInfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  border-top: 1px solid ${palette.highlight.white};
  color: ${palette.solid.white};

  @media only screen and (max-width: ${TABLET_WIDTH}px) {
    flex-direction: column;
  }
`;

export const AboutModalInfoSection = styled.div`
  margin-top: 24px;
  margin-right: 24px;
`;

export const AboutModalInfoTitle = styled.div`
  ${typography.sizeCSS.large}
  font-weight: 400;
  margin-bottom: 16px;
`;

export const AboutModalInfoBody = styled.div`
  ${typography.sizeCSS.medium}
  font-weight: 400;
  margin-bottom: 24px;
`;

export const AboutModalButtonsContainer = styled.div`
  display: inline-block;
`;

export const AboutModalInfoButton = styled.div`
  ${typography.sizeCSS.medium}
  font-weight: 400;
  border: 1px solid ${palette.highlight.white2};
  border-radius: 99px;
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 8px;
  padding-bottom: 8px;
  float: left;
  margin-right: 2px;
  margin-top: 2px;

  &:hover {
    cursor: pointer;
    opacity: 0.85;
  }
`;
