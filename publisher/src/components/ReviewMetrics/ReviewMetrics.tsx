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

/* eslint-disable camelcase */

import errorIcon from "@justice-counts/common/assets/status-error-icon.png";
import { Button } from "@justice-counts/common/components/Button";
import { DatapointsTableView } from "@justice-counts/common/components/DataViz/DatapointsTableView";
import { formatDateShortMonthYear } from "@justice-counts/common/components/DataViz/utils";
import { HeaderBar } from "@justice-counts/common/components/HeaderBar";
import { useIsFooterVisible } from "@justice-counts/common/hooks";
import { groupBy } from "@justice-counts/common/utils";
import React, { Fragment, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { printReportTitle } from "../../utils";
import checkIcon from "../assets/check-icon.svg";
import {
  REPORT_CAPITALIZED,
  REPORTS_CAPITALIZED,
  REPORTS_LOWERCASE,
} from "../Global/constants";
import { useHeaderBadge } from "../Header/hooks";
import {
  AgencyName,
  EmptyIcon,
  Heading,
  HeadingGradient,
  MetricsPanel,
  MetricStatusIcon,
  NoDatapointsMessage,
  ReviewMetricsButtonsContainer,
  ReviewMetricsWrapper,
  SectionContainer,
  SectionExpandStatusSign,
  Summary,
  SummaryAgencyName,
  SummarySection,
  SummarySectionLine,
  SummarySectionsContainer,
  SummarySectionTitle,
  SummaryWrapper,
} from "./ReviewMetrics.styles";
import {
  DatapointsByMetricNameByAgencyName,
  ReviewMetric,
  ReviewMetricOverwrites,
  ReviewMetricsProps,
} from "./types";

export const ReviewMetrics: React.FC<ReviewMetricsProps> = ({
  title,
  description,
  buttons,
  metrics,
  metricOverwrites,
  records,
  isMultiAgencyUpload,
  datapointsByMetricNameByAgencyName,
}) => {
  const { agencyId } = useParams();
  const navigate = useNavigate();
  const headerBadge = useHeaderBadge();
  const [isFooterVisible] = useIsFooterVisible();
  const [isMetricsSectionExpanded, setIsMetricsSectionExpanded] =
    useState(true);
  const [isOverwritesSectionExpanded, setIsOverwritesSectionExpanded] =
    useState(true);
  const [isRecordsSectionExpanded, setIsRecordsSectionExpanded] = useState(() =>
    records ? records.length <= 10 : false
  );
  const hasNoDatapoints =
    metrics.filter((metric) => metric.datapoints)?.length === 0;
  const hasMetricErrors =
    metrics.filter((metric) => metric.metricHasError).length > 0;

  const renderSection = (metric: ReviewMetric) => {
    return (
      <SectionContainer key={metric.key}>
        <DatapointsTableView
          datapoints={metric.datapoints}
          metricName={metric.display_name}
        />
      </SectionContainer>
    );
  };

  /** Multi-Agency Uploads */

  const renderDatapointsByMetricNameByAgencyName = (
    groupedDatapoints: DatapointsByMetricNameByAgencyName
  ) => {
    return Object.entries(groupedDatapoints).map(
      ([agencyName, dpByMetrics]) => (
        <Fragment key={agencyName}>
          <AgencyName>{agencyName}</AgencyName>
          <div>
            {Object.entries(dpByMetrics).map(([metricName, dps]) => (
              <SectionContainer
                key={metricName}
                isMultiAgencyUpload={isMultiAgencyUpload}
              >
                <DatapointsTableView
                  datapoints={dps}
                  metricName={metricName}
                  useMultiAgencyStyles={isMultiAgencyUpload}
                />
              </SectionContainer>
            ))}
          </div>
        </Fragment>
      )
    );
  };

  const renderOverwritesByAgencyName = (
    reviewMetricOverwrites: ReviewMetricOverwrites[]
  ) => {
    /**
     * Groups metric overwrites by agency name
     * @example { "Agency 1": { key, metricName, dimensionName, startDate, agencyName }, "Agency 2": { ... } }
     */
    const groupedMetricOverwritesByAgencyName = reviewMetricOverwrites.reduce(
      (acc, overwrite) => {
        if (!overwrite.agencyName) return acc;
        if (!acc[overwrite.agencyName]) {
          acc[overwrite.agencyName] = [];
        }
        acc[overwrite.agencyName].push(overwrite);
        return acc;
      },
      {} as { [key: string]: ReviewMetricOverwrites[] }
    );

    return (
      <SummaryWrapper>
        {Object.entries(groupedMetricOverwritesByAgencyName).map(
          ([agencyName, overwrites]) => (
            <Fragment key={agencyName}>
              <SummaryAgencyName>{agencyName}</SummaryAgencyName>
              {overwrites.map(
                ({ key, metricName, dimensionName, startDate }) => (
                  <SummarySectionLine key={key}>
                    {metricName}: {dimensionName}
                    <span>({formatDateShortMonthYear(startDate)})</span>
                  </SummarySectionLine>
                )
              )}
            </Fragment>
          )
        )}
      </SummaryWrapper>
    );
  };

  /**
   * Used to render the list of metrics on the left-side panel of the review page by agency name by
   * utilizing `datapointsByMetricNameByAgency` to extract the list of metrics uploaded by agency name.
   */
  const renderMetricsListByAgencyName = () => {
    return (
      <SummaryWrapper>
        {datapointsByMetricNameByAgencyName &&
          Object.entries(datapointsByMetricNameByAgencyName).map(
            ([agencyName, agencyMetrics]) => {
              return (
                <Fragment key={agencyName}>
                  <SummaryAgencyName>{agencyName}</SummaryAgencyName>
                  {Object.keys(agencyMetrics).map((metric) => (
                    <SummarySectionLine key={metric}>
                      {/**
                       * Since multiagency uploads currenly only take place via the bulk upload flow
                       * and that has its own errors/warnings page, we can safely assume that metrics that
                       * make it to the review page are successfully saved metrics with inputs and
                       * without errors - thus, earning a check icon.
                       */}
                      <MetricStatusIcon src={checkIcon} alt="" />
                      {metric}
                    </SummarySectionLine>
                  ))}
                </Fragment>
              );
            }
          )}
      </SummaryWrapper>
    );
  };

  /**
   * Used to render the list of records on the left-side panel of the review page by agency name
   */
  const renderRecordsListByAgencyName = () => {
    if (!records) return;
    const groupedRecords = groupBy(records, (record) =>
      String(record.agency_name)
    );

    return (
      <SummaryWrapper>
        {Object.entries(groupedRecords)
          .sort((a, b) => a[0].localeCompare(b[0])) // sort by agency name
          .map(([agencyName, agencyRecords]) => (
            <Fragment key={agencyName}>
              <SummaryAgencyName>{agencyName}</SummaryAgencyName>
              {agencyRecords.map((record) => (
                <SummarySectionLine key={record.id}>
                  {printReportTitle(
                    record.month,
                    record.year,
                    record.frequency
                  )}
                </SummarySectionLine>
              ))}
            </Fragment>
          ))}
      </SummaryWrapper>
    );
  };

  return (
    <ReviewMetricsWrapper hasNoDatapoints={hasNoDatapoints}>
      <HeaderBar
        onLogoClick={() => navigate(`/agency/${agencyId}/${REPORTS_LOWERCASE}`)}
        hasBottomBorder
        label="Justice Counts"
        badge={headerBadge}
      >
        <ReviewMetricsButtonsContainer>
          {buttons.map(
            ({
              name,
              onClick,
              buttonColor,
              labelColor,
              borderColor,
              isPublishButton,
            }) => (
              <Button
                key={name}
                label={name}
                onClick={onClick}
                disabled={hasMetricErrors && isPublishButton}
                buttonColor={buttonColor}
                labelColor={labelColor}
                borderColor={borderColor}
                showTooltip={hasMetricErrors && isPublishButton}
                tooltipMsg={
                  hasMetricErrors && isPublishButton
                    ? "There are errors in your data that need to be addressed before publishing. Please contact the Justice Counts team at justice-counts-support@csg.org if you need help."
                    : undefined
                }
              />
            )
          )}
        </ReviewMetricsButtonsContainer>
      </HeaderBar>
      <Summary isFooterVisible={isFooterVisible}>
        <Heading>
          {title}
          <span>{description}</span>
        </Heading>
        <SummarySectionsContainer>
          <HeadingGradient />
          {metrics.length > 0 && (
            <SummarySection>
              <SummarySectionTitle
                color="blue"
                onClick={() =>
                  setIsMetricsSectionExpanded(!isMetricsSectionExpanded)
                }
              >
                <span>{metrics.length}</span> Metric
                {metrics.length > 1 ? "s" : ""}
                <SectionExpandStatusSign>
                  {isMetricsSectionExpanded ? "-" : "+"}
                </SectionExpandStatusSign>
              </SummarySectionTitle>
              {isMetricsSectionExpanded && (
                <>
                  {isMultiAgencyUpload
                    ? renderMetricsListByAgencyName()
                    : metrics.map(
                        ({
                          key,
                          display_name,
                          metricHasError,
                          metricHasValidInput,
                        }) => (
                          <SummarySectionLine key={key}>
                            {!metricHasError && metricHasValidInput && (
                              <MetricStatusIcon src={checkIcon} alt="" />
                            )}
                            {metricHasError && (
                              <MetricStatusIcon src={errorIcon} alt="" />
                            )}
                            {!metricHasError && !metricHasValidInput && (
                              <EmptyIcon />
                            )}
                            {display_name}
                          </SummarySectionLine>
                        )
                      )}
                </>
              )}
            </SummarySection>
          )}
          {metricOverwrites && metricOverwrites.length > 0 && (
            <SummarySection>
              <SummarySectionTitle
                color="orange"
                onClick={() =>
                  setIsOverwritesSectionExpanded(!isOverwritesSectionExpanded)
                }
              >
                <span>{metricOverwrites.length}</span> Overwrite
                {metricOverwrites.length > 1 ? "s" : ""}
                <SectionExpandStatusSign>
                  {isOverwritesSectionExpanded ? "-" : "+"}
                </SectionExpandStatusSign>
              </SummarySectionTitle>
              {isOverwritesSectionExpanded && (
                <>
                  {isMultiAgencyUpload
                    ? renderOverwritesByAgencyName(metricOverwrites)
                    : metricOverwrites.map(
                        ({ key, metricName, dimensionName, startDate }) => (
                          <SummarySectionLine key={key}>
                            {metricName}: {dimensionName}
                            <span>({formatDateShortMonthYear(startDate)})</span>
                          </SummarySectionLine>
                        )
                      )}
                </>
              )}
            </SummarySection>
          )}
          {records && records.length > 0 && (
            <SummarySection>
              <SummarySectionTitle
                color="grey"
                onClick={() =>
                  setIsRecordsSectionExpanded(!isRecordsSectionExpanded)
                }
              >
                <span>{records.length}</span>{" "}
                {records.length > 1 ? REPORTS_CAPITALIZED : REPORT_CAPITALIZED}
                <SectionExpandStatusSign>
                  {isRecordsSectionExpanded ? "-" : "+"}
                </SectionExpandStatusSign>
              </SummarySectionTitle>
              {isRecordsSectionExpanded && (
                <>
                  {isMultiAgencyUpload
                    ? renderRecordsListByAgencyName()
                    : records.map((record) => (
                        <SummarySectionLine key={record.id}>
                          {printReportTitle(
                            record.month,
                            record.year,
                            record.frequency
                          )}
                        </SummarySectionLine>
                      ))}
                </>
              )}
            </SummarySection>
          )}
        </SummarySectionsContainer>
      </Summary>

      {hasNoDatapoints ? (
        <NoDatapointsMessage>
          There is no data to review. Please go back and enter data in order to
          Review & Publish.
        </NoDatapointsMessage>
      ) : (
        <MetricsPanel>
          {isMultiAgencyUpload && datapointsByMetricNameByAgencyName
            ? renderDatapointsByMetricNameByAgencyName(
                datapointsByMetricNameByAgencyName
              )
            : metrics.map((metric) => {
                return renderSection(metric);
              })}
        </MetricsPanel>
      )}
    </ReviewMetricsWrapper>
  );
};
