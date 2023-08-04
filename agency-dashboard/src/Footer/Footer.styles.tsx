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
  palette,
  typography,
} from "@justice-counts/common/components/GlobalStyles";
import styled from "styled-components/macro";

export const FooterWrapper = styled.div`
  width: 100%;
  background-color: ${palette.solid.black};
  padding: 80px;
`;

export const FooterContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 40px;
  color: ${palette.solid.white};
`;

export const FooterTopInfo = styled.div`
  display: flex;
  flex-direction: row;
  gap: 24px;
`;

export const FooterInfoBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  ${typography.sizeCSS.normal};
  max-width: 240px;
`;

export const FooterInfoBlockTitle = styled.span`
  ${typography.sizeCSS.medium};
`;

export const FooterLogos = styled.div`
  display: flex;
  flex-direction: row;
  gap: 64px;
`;

export const FooterBottomInfo = styled.div`
  ${typography.sizeCSS.medium};
`;

export const FooterCopyrights = styled.div`
  ${typography.sizeCSS.medium};
`;
