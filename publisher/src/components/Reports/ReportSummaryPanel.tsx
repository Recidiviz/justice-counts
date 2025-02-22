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

import successIcon from "@justice-counts/common/assets/status-check-icon.png";
import errorIcon from "@justice-counts/common/assets/status-error-icon.png";
import {
  HEADER_BAR_HEIGHT,
  palette,
  typography,
} from "@justice-counts/common/components/GlobalStyles";
import { AgencySystem, Metric } from "@justice-counts/common/types";
import { observer } from "mobx-react-lite";
import React from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components/macro";

import { useStore } from "../../stores";
import {
  filterJCAdminEditors,
  formatSystemName,
  printDateRangeFromMonthYear,
  printElapsedDaysMonthsYearsSinceDate,
} from "../../utils";
import { MetricSummarySectionTitle, Title } from "../Forms";
import { REPORT_CAPITALIZED } from "../Global/constants";
import { TeamMemberNameWithBadge } from "../primitives";
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

export const ReportSummaryWrapper = styled.div`
  width: ${SIDE_PANEL_WIDTH}px;
  height: calc(100% - 100px);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  padding: ${HEADER_BAR_HEIGHT + 31}px ${SIDE_PANEL_HORIZONTAL_PADDING}px 0
    ${SIDE_PANEL_HORIZONTAL_PADDING}px;
  background: ${palette.solid.white};

  @media only screen and (max-width: ${ONE_PANEL_MAX_WIDTH}px) {
    display: none;
  }
`;

const PUBLISH_CONFIRMATION_BUTTON_HEIGHT_AND_PADDING = 128;

export const ReportSummaryProgressIndicatorWrapper = styled.div`
  margin-top: 16px;
  height: 37vh;
  overflow-y: auto;

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
  margin-bottom: 6px;
  border-radius: 2px;
  color: ${palette.highlight.grey8};
  transition: 0.2s ease;

  &:hover {
    cursor: pointer;
    color: ${palette.solid.darkgrey};
  }
`;

export const MetricDisplayName = styled.div<{ activeSection?: boolean }>`
  ${typography.sizeCSS.normal}
  width: fit-content;
  color: ${({ activeSection }) =>
    activeSection ? palette.solid.darkgrey : palette.highlight.grey8};
  max-width: 238px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 400;
  &:hover {
    cursor: pointer;
    color: ${palette.solid.darkgrey};
  }
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
  bottom: 100px;

  @media only screen and (max-width: ${TWO_PANEL_MAX_WIDTH}px) {
    display: none;
  }
  @media only screen and (max-height: 750px) {
    display: none;
  }
`;

export const EditDetailsTitle = styled.div`
  ${typography.sizeCSS.normal}
  font-weight: 500;
  padding-top: 16px;
  margin-bottom: 4px;
  border-top: 1px solid ${palette.solid.lightgrey4};
`;

export const EditDetailsContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  ${typography.sizeCSS.normal}
  font-weight: 400;
  color: ${palette.highlight.grey8};
  margin-bottom: 16px;
`;

const PublishContainer = styled.div`
  display: none;

  @media only screen and (max-width: ${TWO_PANEL_MAX_WIDTH}px) {
    display: block;
    position: absolute;
    border-top: 1px solid ${palette.solid.lightgrey4};
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

const CommaSpan = styled.span`
  &::after {
    content: ",";
  }
  margin-right: 4px;
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
  fieldDescription?: FieldDescriptionProps;
}> = ({ reportID, activeMetric, fieldDescription }) => {
  const { formStore, reportStore, userStore } = useStore();
  const { agencyId } = useParams() as { agencyId: string };
  const currentAgency = userStore.getAgency(agencyId);
  const checkMetricForErrors = useCheckMetricForErrors(reportID);
  const {
    editors,
    last_modified_at: lastModifiedAt,
    month,
    year,
    frequency,
  } = reportStore.reportOverviews[reportID];

  const filteredReportEditors = filterJCAdminEditors(editors);

  const metricsBySystem = reportStore.reportMetricsBySystem[reportID];
  const showMetricSectionTitles = Object.keys(metricsBySystem).length > 1;

  return (
    <ReportSummaryWrapper>
      <Title>{REPORT_CAPITALIZED} Summary</Title>

      <ReportSummaryProgressIndicatorWrapper>
        {Object.entries(metricsBySystem).map(([system, metrics]) => {
          const enabledMetrics = metrics.filter((metric) => metric.enabled);

          return (
            <React.Fragment key={system}>
              {showMetricSectionTitles ? (
                <MetricSummarySectionTitle>
                  {formatSystemName(system as AgencySystem, {
                    allUserSystems: currentAgency?.systems,
                  })}
                </MetricSummarySectionTitle>
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
          {filteredReportEditors.length
            ? filteredReportEditors.map((editor, index) => (
                <React.Fragment key={editor.name}>
                  {/* TODO(#334) Hook up admin badges rendering to team member roles API */}
                  <TeamMemberNameWithBadge
                    name={editor.name}
                    badgeId={`${editor.name}-${index}`}
                    role={editor.role}
                  />
                  {index < filteredReportEditors.length - 1 && <CommaSpan />}
                </React.Fragment>
              ))
            : userStore.nameOrEmail}
        </EditDetailsContent>

        <EditDetailsTitle>Details</EditDetailsTitle>
        <EditDetailsContent>
          {filteredReportEditors.length === 1 &&
            !lastModifiedAt &&
            `Created today by ${filteredReportEditors[0].name}`}

          {filteredReportEditors.length >= 1 &&
            lastModifiedAt &&
            `Last modified ${printElapsedDaysMonthsYearsSinceDate(
              lastModifiedAt
            )} by ${filteredReportEditors[0].name}`}

          {!filteredReportEditors.length && ``}
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
