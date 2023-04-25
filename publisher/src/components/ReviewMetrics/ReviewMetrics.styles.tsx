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
  MIN_TABLET_WIDTH,
  palette,
  typography,
} from "@justice-counts/common/components/GlobalStyles";
import styled from "styled-components/macro";

import { DataUploadContainer } from "../DataUpload";
import {
  RemoveRecordsModalButtonsContainer,
  RemoveRecordsModalContainer,
  RemoveRecordsModalHint,
  RemoveRecordsModalTitle,
  RemoveRecordsModalWrapper,
} from "../Reports/RemoveRecordsModal";

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
  padding: 40px 0 128px 520px;
  display: flex;
  flex-direction: row;
  gap: 88px;
  overflow-x: hidden;

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    padding: 40px 24px 128px 24px;
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
  transition: max-height 0.5s ease-in-out;

  padding-left: 24px;
  width: 400px;
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
  width: 484px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 1) 50%,
    rgba(255, 255, 255, 0.4009978991596639) 100%
  );
  min-height: 30px;

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    min-height: 20px;
  }
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

  &:not(:last-child) {
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
  ${typography.sizeCSS.title};
  margin-bottom: 12px;
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

export const ReviewPublishModalWrapper = styled(RemoveRecordsModalWrapper)``;
export const ReviewPublishModalContainer = styled(RemoveRecordsModalContainer)`
  padding-top: 80px;
`;
export const ReviewPublishModalIcon = styled.img`
  margin-bottom: 24px;
`;
export const ReviewPublishModalTitle = styled(RemoveRecordsModalTitle)`
  text-align: center;
  span {
    color: ${palette.solid.blue};
  }
`;
export const ReviewPublishModalHint = styled(RemoveRecordsModalHint)`
  display: flex;
  text-align: center;
  max-width: 264px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
export const ReviewPublishModalButtonsContainer = styled(
  RemoveRecordsModalButtonsContainer
)``;

export const NoDatapointsMessage = styled.div`
  margin: auto auto;
`;

export const ListOfReportsContainer = styled.div`
  width: 100%;
  max-height: 120px;
  overflow: auto;
  margin-top: 15px;
  padding: 0 15px;
  color: ${palette.highlight.grey9};
`;

export const ModifiedReportTitle = styled.div``;
