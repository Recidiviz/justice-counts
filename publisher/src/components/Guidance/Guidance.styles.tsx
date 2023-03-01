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
import styled, { css } from "styled-components/macro";

export const GuidanceContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
`;

export const ContentContainer = styled.div<{ currentTopicID?: string }>`
  width: 100%;
  max-width: 497px;
  padding: 100px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 56px;
  text-align: center;

  ${({ currentTopicID }) => {
    if (currentTopicID === "WELCOME") {
      return `
          max-width: 720px;
      `;
    }
    if (currentTopicID === "METRIC_CONFIG") {
      return `
        justify-content: flex-start;
        margin: 0 150px 150px 0;
        text-align: left;
      `;
    }
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
  margin-top: -16px;

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

export const ReportsOverviewContainer = styled.div`
  width: 100%;
  height: 238px;
  padding: 10px 0;
  overflow-y: auto;
`;

export const ReportsOverviewItemWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 0;

  &:not(:last-child) {
    border-bottom: 1px solid ${palette.solid.darkgrey};
  }
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

const ProgressTooltipStyles = css`
  background: ${palette.solid.black};
  border-radius: 4px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: absolute;
  right: 0;
  top: 45px;
  z-index: 2;
  transition: 0.2s ease;
  pointer-events: none;
`;

export const ProgressTooltipContainer = styled.div`
  ${ProgressTooltipStyles}
  opacity: 0;
`;

export const ProgressBarContainer = styled.div`
  width: 100%;
  height: 2px;
  background: ${palette.highlight.grey4};
  margin-bottom: 16px;
`;

export const Progress = styled.div<{ progress: number }>`
  width: ${({ progress }) => progress * 25}%;
  height: 100%;
  background: ${palette.solid.blue};
`;

export const CheckIconWrapper = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

export const CheckIcon = styled.img<{ width?: number }>`
  width: ${({ width }) => (width ? `${width}px` : "20px")};
`;

export const ProgressTooltipToast = styled.div<{ showToast?: boolean }>`
  ${ProgressTooltipStyles}
  width: 280px;
  top: 58px;
  right: unset;
  left: -100px;
  opacity: ${({ showToast }) => (showToast ? 1 : 0)};

  &::after {
    content: "";
    position: absolute;
    width: 16px;
    height: 16px;
    background: ${palette.solid.black};
    top: -8px;
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
  }
`;

export const ProgressItemWrapper = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

export const ProgressItemName = styled.div`
  ${typography.sizeCSS.normal}
  color: ${palette.solid.white};
`;

export const Metric = styled.div<{
  hideTooltip?: boolean;
}>`
  width: 100%;
  padding-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;

  &:hover {
    cursor: pointer;
  }

  svg {
    position: absolute;
    opacity: 0;
    right: -20px;
    transition: opacity 0.2s ease, right 0.3s ease;
  }

  &:hover svg {
    display: block;
    opacity: 1;
    right: -20px;
    right: 13px;
    opacity: 1;
  }

  &:hover > ${ProgressTooltipContainer} {
    opacity: ${({ hideTooltip }) => (hideTooltip ? 0 : 1)};
  }
`;

export const MetricContentContainer = styled(ContentContainer)`
  width: 100%;
  max-width: 550px;
  gap: unset;

  &:hover ${Metric}:not(:hover) {
    color: ${palette.highlight.grey8};
  }
`;

export const ConfiguredMetricIndicatorTitle = styled.div`
  ${typography.sizeCSS.title}
  width: 100%;
  text-align: left;
  margin-bottom: 24px;

  span {
    color: ${palette.solid.blue};
  }
`;

export const MetricListContainer = styled.div`
  width: 100%;
`;

export const MetricName = styled.div`
  ${typography.sizeCSS.large}
  text-align: left;
`;

export const MetricStatus = styled.div<{ greyText?: boolean }>`
  ${typography.sizeCSS.normal}
  display: flex;
  align-items: center;
  color: ${({ greyText }) =>
    greyText ? palette.highlight.grey10 : palette.solid.blue};
  opacity: 1;
  transition: opacity 0.2s ease;
  white-space: nowrap;

  ${Metric}:hover & {
    opacity: 0;
  }
`;
