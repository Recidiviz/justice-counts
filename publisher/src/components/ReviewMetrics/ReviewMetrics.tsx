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
import { MiniLoader } from "@justice-counts/common/components/MiniLoader";
import { useIsFooterVisible } from "@justice-counts/common/hooks";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { printReportTitle } from "../../utils";
import checkIcon from "../assets/check-icon.svg";
import {
  REPORT_CAPITALIZED,
  REPORTS_CAPITALIZED,
  REPORTS_LOWERCASE,
} from "../Global/constants";
import { useHeaderBadge } from "../Header/hooks";
import { MiniLoaderWrapper, ReviewButtonContainer } from "../Reports";
import {
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
  SummarySection,
  SummarySectionLine,
  SummarySectionsContainer,
  SummarySectionTitle,
} from "./ReviewMetrics.styles";
import { ReviewMetric, ReviewMetricsProps } from "./types";

export const ReviewMetrics: React.FC<ReviewMetricsProps> = ({
  title,
  description,
  buttons,
  metrics,
  metricOverwrites,
  records,
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

  return (
    <ReviewMetricsWrapper hasNoDatapoints={hasNoDatapoints}>
      <HeaderBar
        onLogoClick={() => navigate(`/agency/${agencyId}/${REPORTS_LOWERCASE}`)}
        hasBottomBorder
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
              isPublishInProgress,
            }) => (
              <ReviewButtonContainer>
                {isPublishInProgress && (
                  <MiniLoaderWrapper>
                    <MiniLoader dark />
                  </MiniLoaderWrapper>
                )}
                <Button
                  key={name}
                  label={name}
                  onClick={onClick}
                  disabled={
                    (hasMetricErrors && isPublishButton) || isPublishInProgress
                  }
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
              </ReviewButtonContainer>
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
              {isMetricsSectionExpanded &&
                metrics.map(
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
                      {!metricHasError && !metricHasValidInput && <EmptyIcon />}
                      {display_name}
                    </SummarySectionLine>
                  )
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
              {isOverwritesSectionExpanded &&
                metricOverwrites.map(
                  ({ key, metricName, dimensionName, startDate }) => (
                    <SummarySectionLine key={key}>
                      {metricName}: {dimensionName}
                      <span>({formatDateShortMonthYear(startDate)})</span>
                    </SummarySectionLine>
                  )
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
              {isRecordsSectionExpanded &&
                records.map((record) => (
                  <SummarySectionLine key={record.id}>
                    {printReportTitle(
                      record.month,
                      record.year,
                      record.frequency
                    )}
                  </SummarySectionLine>
                ))}
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
          {metrics.map((metric) => {
            return renderSection(metric);
          })}
        </MetricsPanel>
      )}
    </ReviewMetricsWrapper>
  );
};
