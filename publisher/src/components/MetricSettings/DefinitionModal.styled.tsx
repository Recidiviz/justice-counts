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

export const Wrapper = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: ${palette.highlight.grey2};
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 4;
`;

export const Content = styled.div`
  width: 582px;
  max-width: 582px;
  height: 587px;
  max-height: 587px;
  background-color: ${palette.solid.white};
  position: relative;
`;

export const ScrollableInnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 24px 32px 104px 32px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

export const Header = styled.div`
  ${typography.sizeCSS.normal};
  margin-bottom: 4px;
`;

export const DefinitionLabel = styled.div`
  ${typography.sizeCSS.title};
  line-height: 39px;
  margin-bottom: 4px;
`;

export const Description = styled.div`
  ${typography.sizeCSS.normal};
  color: ${palette.highlight.grey8};
  margin-bottom: 16px;
`;

export const ChooseDefinitions = styled.span`
  color: ${palette.solid.blue};
`;

export const IncludesExcludesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 32px;
`;

export const IncludeExclude = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
  ${typography.sizeCSS.normal};
`;

export const DisabledIcon = styled.div`
  width: 16px;
  height: 16px;
  border: 1px solid ${palette.highlight.grey4};
  border-radius: 100%;
`;

export const BottomButtonsContainer = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 32px;
  display: flex;
  flex-direction: row;
  justify-content: end;
  align-items: center;
`;
