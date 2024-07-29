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

export const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
export const Content = styled.div`
  width: 100%;
  max-width: 660px;
  height: 100%;
  max-height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
`;

export const LogoBlock = styled.div`
  height: 60px;
  width: 175px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  margin-bottom: 42px;
`;

export const Logo = styled.img`
  width: 60px;
  height: 60px;
`;

export const LogoText = styled.div`
  display: flex;
  flex-direction: column;
`;

export const LogoBigText = styled.div`
  ${typography.sizeCSS.large}
`;

export const LogoSmallText = styled.div`
  font-weight: 600;
  font-size: 9.1px;
  line-height: 14px;
`;

export const TitleBlock = styled.div`
  ${typography.sizeCSS.large};
  margin-bottom: 24px;
`;

export const InfoBlock = styled.div`
  ${typography.sizeCSS.medium};
`;

export const SupportLink = styled.a`
  ${palette.solid.blue}
`;
