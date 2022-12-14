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

import successIcon from "@justice-counts/common/assets/status-check-icon.png";
import {
  HEADER_BAR_HEIGHT,
  palette,
  typography,
} from "@justice-counts/common/components/GlobalStyles";
import { Metric } from "@justice-counts/common/types";
import { observer } from "mobx-react-lite";
import React from "react";
import styled from "styled-components/macro";

import { useStore } from "../../stores";
import {
  printCommaSeparatedList,
  printDateRangeFromMonthYear,
  printElapsedDaysMonthsYearsSinceDate,
} from "../../utils";
import errorIcon from "../assets/status-error-icon.png";
import { MetricsSectionTitle, Title } from "../Forms";
import { REPORT_CAPITALIZED } from "../Global/constants";
import { SubMenuListItem } from "../Settings";
import HelperText from "./HelperText";
import { useCheckMetricForErrors } from "./hooks";
import {
  BREAKPOINT_HEIGHT,
  FieldDescription,
  FieldDescriptionProps,
  ONE_PANEL_MAX_WIDTH,
  SIDE_PANEL_HORIZONTAL_PADDING,
  SIDE_PANEL_WIDTH,
  TWO_PANEL_MAX_WIDTH,
} from "./ReportDataEntry.styles";

export const ReportSummaryWrapper = styled.div<{
  showDataEntryHelpPage?: boolean;
}>`
  width: ${SIDE_PANEL_WIDTH}px;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  padding: ${HEADER_BAR_HEIGHT + 31}px ${SIDE_PANEL_HORIZONTAL_PADDING}px 0
    ${SIDE_PANEL_HORIZONTAL_PADDING}px;
  background: ${palette.solid.white};
  transition: opacity 300ms ease-in;

  opacity: ${({ showDataEntryHelpPage }) => (showDataEntryHelpPage ? 0.5 : 1)};
  pointer-events: ${({ showDataEntryHelpPage }) =>
    showDataEntryHelpPage ? "none" : "auto"};

  @media only screen and (max-width: ${ONE_PANEL_MAX_WIDTH}px) {
    display: none;
  }
`;

const PUBLISH_CONFIRMATION_BUTTON_HEIGHT_AND_PADDING = 128;

export const ReportSummaryProgressIndicatorWrapper = styled.div`
  margin-top: 16px;
  height: 37vh;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: ${palette.highlight.grey8};
    box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
    -webkit-box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
  }

  @media only screen and (max-width: ${TWO_PANEL_MAX_WIDTH}px) {
    height: 30vh;
  }

  @media only screen and (max-height: ${BREAKPOINT_HEIGHT}px) {
    height: calc(55vh - ${PUBLISH_CONFIRMATION_BUTTON_HEIGHT_AND_PADDING}px);
    padding-bottom: 50px;
  }
`;

export const ReportSummarySection = styled.a`
  ${typography.sizeCSS.normal}
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  text-decoration: none;
  margin-bottom: 2px;
  border-radius: 2px;
  color: ${palette.highlight.grey8};
  transition: 0.2s ease;

  &:hover {
    cursor: pointer;
    color: ${palette.solid.darkgrey};
  }
`;

export const MetricDisplayName = styled(SubMenuListItem)`
  border-bottom: 2px solid
    ${({ activeSection }) =>
      activeSection ? palette.solid.blue : `transparent`};
`;

export const ReportStatusIcon = styled.div<{
  metricHasError?: boolean;
  metricHasEntries?: boolean;
}>`
  width: 16px;
  height: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  margin-right: 8px;

  background: ${({ metricHasError }) => {
    if (metricHasError) {
      return palette.solid.red;
    }

    return `transparent`;
  }};
  color: white;
  border: 1px solid ${palette.highlight.grey4};
`;

export const EditDetails = styled.div`
  width: 307px;
  position: fixed;
  bottom: 61px;

  @media only screen and (max-width: ${TWO_PANEL_MAX_WIDTH}px) {
    display: none;
  }
  @media only screen and (max-height: 750px) {
    display: none;
  }
`;

export const EditDetailsTitle = styled.div`
  ${typography.sizeCSS.small}
  padding-top: 8px;
  border-top: 1px solid ${palette.solid.darkgrey};
`;

export const EditDetailsContent = styled.div`
  ${typography.sizeCSS.normal}
  color: ${palette.highlight.grey9};
  margin-bottom: 18px;
`;

const PublishContainer = styled.div`
  display: none;

  @media only screen and (max-width: ${TWO_PANEL_MAX_WIDTH}px) {
    display: block;
    position: absolute;
    border-top: 1px solid ${palette.highlight.grey9};
    background: ${palette.solid.white};
    right: 0;
    bottom: 0;
    left: 0;
    margin: 0 24px;
    padding: 24px 0;
  }

  @media only screen and (max-height: ${BREAKPOINT_HEIGHT}px) {
    border: none;
  }
`;

const ReportStatusIconComponent: React.FC<{
  metricHasValidInput: boolean;
  metricHasError: boolean;
  activeMetric: string;
  metric: Metric;
}> = ({ metricHasError, metricHasValidInput, metric, activeMetric }) => {
  return (
    <ReportSummarySection
      onClick={() => {
        document
          .getElementById(metric.key)
          ?.scrollIntoView({ behavior: "smooth" });
      }}
    >
      <ReportStatusIcon metricHasError={metricHasError}>
        {/* Error State */}
        {metricHasError && (
          <img src={errorIcon} alt="" width="16px" height="16px" />
        )}

        {/* Validated State [Placeholder] */}
        {!metricHasError && metricHasValidInput && (
          <img src={successIcon} alt="" width="16px" height="16px" />
        )}
      </ReportStatusIcon>
      <MetricDisplayName activeSection={metric.key === activeMetric}>
        {metric.display_name}
      </MetricDisplayName>
    </ReportSummarySection>
  );
};

const ReportSummaryPanel: React.FC<{
  reportID: number;
  activeMetric: string;
  showDataEntryHelpPage: boolean;
  fieldDescription?: FieldDescriptionProps;
}> = ({ reportID, activeMetric, showDataEntryHelpPage, fieldDescription }) => {
  const { formStore, reportStore, userStore } = useStore();
  const checkMetricForErrors = useCheckMetricForErrors(reportID);
  const {
    editors,
    last_modified_at: lastModifiedAt,
    month,
    year,
    frequency,
  } = reportStore.reportOverviews[reportID];

  const metricsBySystem = reportStore.reportMetricsBySystem[reportID];
  const showMetricSectionTitles = Object.keys(metricsBySystem).length > 1;

  return (
    <ReportSummaryWrapper showDataEntryHelpPage={showDataEntryHelpPage}>
      <Title>{REPORT_CAPITALIZED} Summary</Title>

      <ReportSummaryProgressIndicatorWrapper>
        {Object.entries(metricsBySystem).map(([system, metrics]) => {
          const enabledMetrics = metrics.filter((metric) => metric.enabled);

          return (
            <React.Fragment key={system}>
              {showMetricSectionTitles ? (
                <MetricsSectionTitle>{system}</MetricsSectionTitle>
              ) : null}
              {enabledMetrics.map((metric) => {
                const foundErrors = checkMetricForErrors(metric.key);

                return (
                  <ReportStatusIconComponent
                    key={metric.key}
                    activeMetric={activeMetric}
                    metricHasError={foundErrors}
                    metricHasValidInput={Boolean(
                      formStore.metricsValues?.[reportID]?.[metric.key]?.value
                    )}
                    metric={metric}
                  />
                );
              })}
            </React.Fragment>
          );
        })}
      </ReportSummaryProgressIndicatorWrapper>

      <EditDetails>
        <EditDetailsTitle>Date Range</EditDetailsTitle>
        <EditDetailsContent>
          {printDateRangeFromMonthYear(month, year, frequency)}
        </EditDetailsContent>

        <EditDetailsTitle>Editors</EditDetailsTitle>
        <EditDetailsContent>
          {editors.length
            ? printCommaSeparatedList(editors)
            : userStore.nameOrEmail}
        </EditDetailsContent>

        <EditDetailsTitle>Details</EditDetailsTitle>
        <EditDetailsContent>
          {editors.length === 1 &&
            !lastModifiedAt &&
            `Created today by ${editors[0]}`}

          {editors.length >= 1 &&
            lastModifiedAt &&
            `Last modified ${printElapsedDaysMonthsYearsSinceDate(
              lastModifiedAt
            )} by ${editors[editors.length - 1]}`}

          {!editors.length && ``}
        </EditDetailsContent>
      </EditDetails>

      <PublishContainer>
        {/* Metric Description, Definitions and Reporting Notes */}
        <HelperText reportID={reportID} activeMetric={activeMetric} />

        {/* Displays the description of the field currently focused */}
        {fieldDescription && (
          <FieldDescription fieldDescription={fieldDescription} />
        )}
      </PublishContainer>
    </ReportSummaryWrapper>
  );
};

export default observer(ReportSummaryPanel);
