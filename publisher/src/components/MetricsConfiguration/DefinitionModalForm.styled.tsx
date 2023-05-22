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
  top: 0;
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
  padding-top: 24px;
  background-color: ${palette.solid.white};
  position: relative;
  border-radius: 3px;
`;

export const ScrollableInnerWrapper = styled.div`
  width: 100%;
  height: calc(100% - 104px);
  padding: 0 32px 0 32px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

export const Header = styled.div`
  ${typography.sizeCSS.normal};
  margin-bottom: 4px;
`;

export const Title = styled.div`
  ${typography.sizeCSS.title};
  line-height: 39px;
  margin-bottom: 4px;
  text-transform: capitalize;
`;

export const Description = styled.div`
  ${typography.sizeCSS.normal};
  color: ${palette.highlight.grey8};
  margin-bottom: 16px;
`;

export const ChooseDefaultSettings = styled.span`
  color: ${palette.solid.blue};
  cursor: pointer;
`;

export const IncludesExcludesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 32px;
`;

export const IncludeExclude = styled.div<{ enabled?: boolean }>`
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
  ${typography.sizeCSS.normal};
  cursor: pointer;
  ${({ enabled }) => !enabled && `color: ${palette.highlight.grey7};`}

  &:hover {
    color: ${palette.solid.darkblue};
  }
`;

export const EnabledIcon = styled.img`
  margin-top: 3px;
  width: 16px;
  height: 16px;
`;

export const DisabledIcon = styled.div`
  margin-top: 3px;
  width: 16px;
  min-width: 16px;
  height: 16px;
  min-height: 16px;
  border: 1px solid ${palette.highlight.grey4};
  border-radius: 100%;
`;

export const Label = styled.div`
  ${typography.sizeCSS.medium};
  margin-bottom: 16px;
`;

export const ContextContainer = styled.div`
  ${Label} {
    ${typography.sizeCSS.normal} !important;
    color: ${palette.highlight.grey8} !important;
  }
`;

export const BottomButtonsContainer = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 32px;
  display: flex;
  flex-direction: row;
  justify-content: end;
  gap: 16px;
  align-items: center;
  background-color: ${palette.solid.white};
  z-index: 2;
`;
