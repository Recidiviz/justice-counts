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
  TABLET_WIDTH,
  typography,
} from "@justice-counts/common/components/GlobalStyles";
import styled from "styled-components/macro";

export const AboutModalContainer = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: ${palette.solid.green};
  display: flex;
  align-items: left;
  justify-content: center;
  overflow-y: auto;
`;

export const AboutModalInnerContainer = styled.div`
  position: relative;
  flex: 0 1 864px;
  border-top: 1px solid ${palette.highlight.white2};
  padding-top: 24px;
  margin: 128px 24px 24px 24px;

  @media only screen and (max-width: ${TABLET_WIDTH}px) {
    margin-top: 24px;
  }
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
  padding: 24px 0px 16px 16px;
  color: ${palette.solid.white};
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  gap: 8px;
  align-items: center;

  &:hover {
    cursor: pointer;
    opacity: 0.85;
  }
`;

export const AboutModalInfoContainer = styled.div`
  display: flex;
  border-top: 1px solid ${palette.highlight.white2};
  color: ${palette.solid.white};

  @media only screen and (max-width: ${TABLET_WIDTH}px) {
    flex-direction: column;
  }
`;

export const AboutModalInfoSection = styled.div`
  margin-top: 24px;
  margin-right: 24px;
  flex: 1 1 0;
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
  border: 1px solid ${palette.highlight.white1};
  border-radius: 99px;
  padding: 8px 16px;
  float: left;
  margin-right: 2px;
  margin-top: 2px;

  &:hover {
    cursor: pointer;
    opacity: 0.85;
  }
`;
