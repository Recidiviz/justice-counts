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
  HEADER_BAR_HEIGHT,
  MIN_DESKTOP_WIDTH,
  palette,
  typography,
} from "@justice-counts/common/components/GlobalStyles";
import styled from "styled-components/macro";

import { DataUploadContainer } from "../DataUpload";

export const MAIN_PANEL_MAX_WIDTH = 864;
export const REVIEW_SUMMARY_DESKTOP_TOP_PADDING = 40 + HEADER_BAR_HEIGHT;

export const Container = styled(DataUploadContainer)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const MainPanel = styled.div`
  max-width: 100%;
  padding: ${REVIEW_SUMMARY_DESKTOP_TOP_PADDING}px 0 128px 612px;
  display: flex;
  flex-direction: row;
  gap: 88px;
  overflow-x: hidden;

  @media only screen and (max-width: ${MIN_DESKTOP_WIDTH}px) {
    padding: ${REVIEW_SUMMARY_DESKTOP_TOP_PADDING}px 24px 128px 24px;
    display: flex;
    flex-direction: column;
    gap: 80px;
  }
`;

export const Summary = styled.div<{ isFooterVisible?: boolean }>`
  position: fixed;
  top: ${REVIEW_SUMMARY_DESKTOP_TOP_PADDING}px;
  left: 0;

  max-height: ${({ isFooterVisible }) =>
    isFooterVisible
      ? `calc(100vh - ${REVIEW_SUMMARY_DESKTOP_TOP_PADDING + 116}px)`
      : `calc(100vh - ${REVIEW_SUMMARY_DESKTOP_TOP_PADDING + 8}px)`};

  padding-left: 24px;
  width: 500px;
  display: flex;
  flex-direction: column;
  background-color: ${palette.solid.white};
  overflow: hidden;

  @media only screen and (max-width: ${MIN_DESKTOP_WIDTH}px) {
    position: static;
    max-height: unset;
    padding-left: unset;
    width: 100%;
  }
`;

export const Heading = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  flex-direction: column;
  ${typography.sizeCSS.headline};
  background-color: ${palette.solid.white};

  span {
    margin-top: 20px;
    ${typography.sizeCSS.medium};

    a {
      color: ${palette.solid.blue};
      text-decoration: none;
    }
  }
`;

export const HeadingGradient = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  width: 484px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 1) 50%,
    rgba(255, 255, 255, 0.4009978991596639) 100%
  );
  min-height: 30px;
`;

export const Subheading = styled.div`
  margin-top: 16px;
  font-size: 18px;
  font-weight: 400;
  line-height: 30px;

  a {
    color: ${palette.solid.blue};
  }
`;

export const SummarySectionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;
`;

export const SummarySection = styled.div`
  display: flex;
  flex-direction: column;

  &:not(:last-child) {
    border-bottom: 1px solid ${palette.highlight.grey3};
    padding-bottom: 30px;
  }

  &:not(:nth-child(2)) {
    padding-top: 30px;
  }
`;

export const SummarySectionTitle = styled.div<{
  color: "blue" | "orange" | "grey";
  hasAction?: boolean;
}>`
  ${typography.sizeCSS.title};
  margin-bottom: 12px;
  display: flex;
  flex-direction: row;
  gap: 8px;

  span {
    color: ${({ color }) => {
      if (color === "orange") return palette.solid.orange;
      if (color === "grey") return "#64859E";
      if (color === "blue") return palette.solid.blue;
      return palette.solid.darkgrey;
    }};
  }

  cursor: ${({ hasAction }) => hasAction && "pointer"};
`;

export const CollapseSign = styled.div`
  margin-left: auto;
  ${typography.sizeCSS.large};
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const SummarySectionLine = styled.div`
  ${typography.sizeCSS.normal}
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const MetricStatusIcon = styled.img`
  width: 16px;
  height: 16px;
`;

export const MetricsPanel = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-x: hidden;
`;

export const SectionContainer = styled.div`
  margin-top: 32px;
  padding-top: 24px;
  display: flex;
  align-items: center;
  justify-content: stretch;
  flex-direction: column;
  min-width: 700px;
  overflow-x: auto;

  &:not(:first-child) {
    border-top: 1px solid ${palette.highlight.grey3};
  }

  &:first-child {
    margin-top: 0;
    padding-top: 0;
  }
`;

export const SectionTitleContainer = styled.div`
  display: inline-flex;
  align-items: center;
  max-width: 100%;
  width: 100%;
  flex: 1;
`;
export const SectionTitleNumber = styled.div`
  width: 40px;
  min-width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${palette.solid.blue};
  color: ${palette.solid.white};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const SectionTitle = styled.div`
  margin-left: 16px;
  ${typography.sizeCSS.title}
  flex: 1;
  padding-right: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const SectionTitleMonths = styled.div`
  background-color: ${palette.solid.blue};
  padding-left: 8px;
  padding-right: 8px;
  padding-top: 4px;
  padding-bottom: 4px;
  margin-left: 16px;
  ${typography.sizeCSS.small}
  color: ${palette.solid.white};
  white-space: nowrap;
`;

export const SectionTitleOverwrites = styled(SectionTitleMonths)`
  background-color: ${palette.solid.orange};
`;
