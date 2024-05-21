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

const MAX_MODAL_FORM_HEIGHT_WITH_PADDINGS = 587 + 24 * 2;

// common
export const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${palette.highlight.grey2};
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 4;

  @media only screen and (max-height: ${MAX_MODAL_FORM_HEIGHT_WITH_PADDINGS}px) {
    align-items: start;
    overflow-y: auto;
  }
`;

export const Content = styled.div`
  width: 480px;
  height: fit-content;
  max-height: 750px;
  padding: 16px 0;
  background-color: ${palette.solid.white};
  position: relative;
  border-radius: 3px;
`;

export const ScrollableInnerWrapper = styled.div`
  width: 100%;
  max-height: 624px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 24px 40px 64px 40px;
  border-top: 1px solid ${palette.highlight.grey3};
`;

export const CloseButton = styled.div`
  font-size: 18px;
  color: ${palette.highlight.grey8};

  &:hover {
    cursor: pointer;
    color: ${palette.highlight.grey10};
  }
`;

export const Header = styled.div`
  ${typography.sizeCSS.normal};
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 0 40px;
`;

export const Title = styled.div`
  ${typography.sizeCSS.title};
  line-height: 39px;
  margin-bottom: 4px;
  text-transform: capitalize;
`;

export const Subtitle = styled.div`
  ${typography.bodyEmphasized};
  text-transform: capitalize;
  margin-bottom: 4px;
`;

export const Description = styled.div`
  ${typography.body};
  line-height: 24px;
  margin-bottom: 24px;
`;

export const CheckboxWrapper = styled.fieldset<{
  disabled?: boolean;
}>`
  display: flex;
  flex-direction: column;
  border: none;
  ${({ disabled }) => disabled && "opacity: 0.6; pointer-events: none"};

  p {
    ${typography.bodyEmphasized};
    margin-bottom: 8px;

    &:not(:first-child) {
      margin-top: 8px;
    }
  }
`;

export const ToggleSwitchWrapper = styled.div<{ enabled?: boolean }>`
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
  ${typography.sizeCSS.normal};
  ${({ enabled }) => !enabled && `color: ${palette.highlight.grey7};`}
`;

export const BottomButtonsContainer = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 16px 40px;
  display: flex;
  flex-direction: row;
  justify-content: end;
  gap: 16px;
  align-items: center;
  background-color: ${palette.solid.white};
  z-index: 2;
  border-top: 1px solid ${palette.highlight.grey3};
`;

// race ethnicities
export const SpecifyEthnicityPrompt = styled.div`
  ${typography.body};
  margin-bottom: 20px;
`;

export const ToggleSwitchesListHeader = styled.div`
  ${typography.body};
  margin-bottom: 24px;
`;

// definitions
export const ChooseDefaultSettings = styled.span<{ disabled?: boolean }>`
  color: ${palette.solid.blue};
  cursor: pointer;

  ${({ disabled }) => disabled && `pointer-events: none`};
`;

export const ContextContainer = styled.div`
  margin-bottom: 48px;
`;

export const ContextLabel = styled.div`
  ${typography.sizeCSS.normal};
  color: ${palette.highlight.grey8};
  margin-bottom: 16px;
`;
