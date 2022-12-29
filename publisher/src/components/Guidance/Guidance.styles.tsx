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
  palette,
  typography,
} from "@justice-counts/common/components/GlobalStyles";
import styled from "styled-components/macro";

export const GuidanceContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ContentContainer = styled.div<{ position?: string }>`
  flex: 1 1;
  max-width: 497px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 56px;

  ${({ position }) => {
    if (position === "TOPLEFT") {
      return `
            transform: translate(-50%, -30%);
        `;
    }
    return `
        text-align: center;
    `;
  }}
`;

export const TopicTitle = styled.div`
  ${typography.sizeCSS.headline};
`;

export const TopicDescription = styled.div`
  ${typography.sizeCSS.medium};
`;

export const ActionButton = styled.button`
  width: fit-content;
  border: none;
  border-radius: 3px;
  padding: 16px 32px;
  background: ${palette.solid.blue};
  color: ${palette.solid.white};
  transition: 0.3s ease;

  &:hover {
    background: ${palette.solid.darkblue};
    cursor: pointer;
  }
`;

export const ProgressStepsContainer = styled.div<{ position?: string }>`
  width: 100%;
  display: flex;
  gap: 8px;

  ${({ position }) => {
    if (position === "TOPLEFT") {
      return `
            justify-content: flex-start;
        `;
    }
    return `
        justify-content: center;
    `;
  }}
`;

export const ProgressStepBubble = styled.div<{ highlight?: boolean }>`
  ${typography.sizeCSS.small}
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${palette.highlight.grey10};
  border: 1px solid ${palette.highlight.grey4};
  border-radius: 100%;

  ${({ highlight }) =>
    highlight &&
    `
    background: ${palette.solid.blue};
    color: ${palette.solid.white};
  `}
`;
