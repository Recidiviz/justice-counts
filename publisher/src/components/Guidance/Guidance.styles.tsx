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

import { Button } from "../DataUpload";

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

export const ActionButtonWrapper = styled.div`
  display: flex;
  gap: 8px;
`;

export const ActionButton = styled.button<{ kind?: "primary" | "bordered" }>`
  ${typography.sizeCSS.medium};
  width: fit-content;
  border: 1px solid
    ${({ kind }) =>
      kind === "bordered" ? palette.highlight.grey4 : palette.solid.blue};
  border-radius: 3px;
  padding: 16px 32px;
  background: ${({ kind }) =>
    kind === "bordered" ? `none` : palette.solid.blue};
  color: ${({ kind }) =>
    kind === "bordered" ? palette.solid.darkgrey : palette.solid.white};
  transition: 0.3s ease;

  &:hover {
    cursor: pointer;
    background: ${({ kind }) =>
      kind === "bordered" ? palette.solid.blue : palette.solid.darkblue};
    ${({ kind }) => kind === "bordered" && `color: ${palette.solid.white};`}
  }
`;

export const SkipButton = styled.div`
  ${typography.sizeCSS.normal};
  color: ${palette.solid.blue};

  &:hover {
    cursor: pointer;
    color: ${palette.solid.darkblue};
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

export const UploadDataButton = styled(Button)<{ activated?: boolean }>`
  ${({ type }) => type === "border" && `color: ${palette.highlight.grey8};`}
  ${({ activated }) =>
    !activated &&
    `
        &:hover {
            cursor: not-allowed;
            background: none;
        }
    `}
`;

export const ReportsOverviewContainer = styled.div`
  width: 100%;
  max-height: 30vh;
  height: 30vh;
  padding: 10px 0;
  overflow-y: scroll;
`;

export const ReportsOverviewItemWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 0;
  border-bottom: 1px solid ${palette.solid.darkgrey};
`;

export const ReportTitle = styled.div`
  ${typography.sizeCSS.large}
  display: flex;
  align-items: center;

  &:hover {
    cursor: pointer;
  }
`;
export const ReviewPublishLink = styled.div`
  ${typography.sizeCSS.normal}
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${palette.solid.blue};

  svg {
    width: 14px;
    path {
      fill: ${palette.solid.blue};
    }
  }

  &:hover {
    cursor: pointer;
    color: ${palette.solid.darkblue};
  }
`;
