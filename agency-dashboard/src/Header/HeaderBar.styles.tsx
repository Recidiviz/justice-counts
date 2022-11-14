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

const AboutModalContainer = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: ${palette.solid.green};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const AboutModalInnerContainer = styled.div`
  flex-basis: 864px;
  flex-grow: 0;
  flex-shrink: 1;
`;

export const AboutModal = ({ closeModal }: { closeModal: () => void }) => (
  <AboutModalContainer>
    <AboutModalInnerContainer>Clackamas County Jail</AboutModalInnerContainer>
  </AboutModalContainer>
);
