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
  HEADER_BAR_HEIGHT,
  MIN_TABLET_WIDTH,
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

export const ReviewMetricsWrapper = styled.div<{ hasNoDatapoints: boolean }>`
  ${({ hasNoDatapoints }) => hasNoDatapoints && `height: 100%;`}
  max-width: 100%;
  padding: 48px 0 128px 500px;
  display: flex;
  flex-direction: row;
  gap: 88px;
  overflow-x: hidden;

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    padding: 48px 24px 128px 24px;
    display: flex;
    flex-direction: column;
    gap: 80px;
  }
`;

export const ReviewMetricsButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: end;
  gap: 8px;
`;

export const Summary = styled.div<{ isFooterVisible?: boolean }>`
  position: fixed;
  top: ${REVIEW_SUMMARY_DESKTOP_TOP_PADDING}px;
  left: 0;

  max-height: ${({ isFooterVisible }) =>
    isFooterVisible
      ? `calc(100vh - ${REVIEW_SUMMARY_DESKTOP_TOP_PADDING + 116}px)`
      : `calc(100vh - ${REVIEW_SUMMARY_DESKTOP_TOP_PADDING + 8}px)`};
  transition: max-height 0.5s ease-in-out;

  padding: 8px 24px;
  width: 420px;
  display: flex;
  flex-direction: column;
  background-color: ${palette.solid.white};
  overflow: hidden;

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
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
  ${typography.sizeCSS.title};
  transition: 0.3s ease;

  span {
    margin-top: 16px;
    margin-bottom: 8px;
    letter-spacing: 0;
    ${typography.sizeCSS.normal};

    a {
      color: ${palette.solid.blue};
      text-decoration: none;
    }
  }

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    ${typography.sizeCSS.title};

    span {
      ${typography.sizeCSS.normal};
      margin-top: 5px;
    }
  }
`;

export const HeadingGradient = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  width: 420px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 1) 0%,
    transparent 100%
  );
  min-height: 32px;

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    min-height: 20px;
  }
`;

export const BottomGradient = styled(HeadingGradient)`
  bottom: 0;
  background: linear-gradient(
    360deg,
    rgba(255, 255, 255, 1) 0%,
    transparent 100%
  );
`;

export const SummarySectionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    overflow: hidden;
  }
`;

export const SummarySection = styled.div`
  display: flex;
  flex-direction: column;

  &:not(:nth-last-child(2)) {
    border-bottom: 1px solid ${palette.highlight.grey3};
    padding-bottom: 30px;

    @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
      padding-bottom: 20px;
    }
  }

  &:not(:nth-child(2)) {
    padding-top: 30px;

    @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
      padding-top: 20px;
    }
  }
`;

export const SummarySectionTitle = styled.div<{
  color: "blue" | "orange" | "grey";
}>`
  ${typography.sizeCSS.medium};
  margin-bottom: 16px;
  display: flex;
  flex-direction: row;
  gap: 8px;
  cursor: pointer;

  span {
    color: ${({ color }) => {
      if (color === "orange") return palette.solid.orange;
      if (color === "grey") return "#64859E";
      if (color === "blue") return palette.solid.blue;
      return palette.solid.darkgrey;
    }};
  }

  &:last-child {
    margin-bottom: 0;
  }

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    ${typography.sizeCSS.medium};
  }
`;

export const SectionExpandStatusSign = styled.div`
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
  margin-bottom: 8px;
`;

export const MetricStatusIcon = styled.img`
  width: 16px;
  height: 16px;
`;

export const EmptyIcon = styled.div`
  width: 16px;
  height: 16px;
  border: 1px solid ${palette.highlight.grey4};
  border-radius: 100%;
`;

export const MetricsPanel = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-x: hidden;
`;

export const SectionContainer = styled.div<{ isMultiAgencyUpload?: boolean }>`
  margin-top: 32px;
  padding-top: 22px;
  display: flex;
  align-items: center;
  justify-content: stretch;
  flex-direction: column;
  min-width: 700px;
  overflow-x: auto;

  &:first-child {
    margin-top: 0;
    padding-top: 0;
  }
`;

export const NoDatapointsMessage = styled.div`
  margin: auto auto;
`;

export const AgencyName = styled.div`
  ${typography.sizeCSS.medium}
  width: 100%;
  margin-bottom: 16px;
  color: ${palette.solid.darkgrey};

  &:not(:first-child) {
    margin-top: 40px;
    padding-top: 40px;
    border-top: 1px solid ${palette.highlight.grey3};
  }
`;

export const SummaryAgencyName = styled.div`
  ${typography.sizeCSS.normal}
  color: ${palette.solid.blue};
`;

export const SummaryWrapper = styled.div`
  ${SummaryAgencyName}:not(:first-child) {
    margin-top: 5px;
  }
`;
