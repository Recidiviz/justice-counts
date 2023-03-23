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

import { DatapointsTableView } from "@justice-counts/common/components/DataViz/DatapointsTableView";
import { formatDateShortMonthYear } from "@justice-counts/common/components/DataViz/utils";
import { useIsFooterVisible } from "@justice-counts/common/hooks";
import { RawDatapoint, ReportOverview } from "@justice-counts/common/types";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { printReportTitle } from "../../utils";
import checkIcon from "../assets/check-icon.svg";
import logoImg from "../assets/jc-logo-vector-new.svg";
import errorIcon from "../assets/status-error-icon.png";
import {
  Button,
  ButtonTypes,
  ReviewMetricsButtonsContainer,
  ReviewMetricsHeader,
} from "../DataUpload";
import {
  REPORT_CAPITALIZED,
  REPORTS_CAPITALIZED,
  REPORTS_LOWERCASE,
} from "../Global/constants";
import { Logo, LogoContainer } from "../Header";
import { EmptyIcon } from "../Reports/PublishConfirmation.styles";
import {
  Heading,
  HeadingGradient,
  MetricsPanel,
  MetricStatusIcon,
  ReviewMetricsWrapper,
  SectionContainer,
  SectionExpandStatusSign,
  Summary,
  SummarySection,
  SummarySectionLine,
  SummarySectionsContainer,
  SummarySectionTitle,
} from "./ReviewMetrics.styles";

export type ReviewHeaderActionButton = {
  name: string;
  type: ButtonTypes;
  onClick: () => void;
  disabled?: boolean;
};

export type ReviewMetric = {
  datapoints: RawDatapoint[];
  display_name: string;
  key: string;
  metricHasError?: boolean;
  metricHasValidInput?: boolean;
};

export type ReviewMetricOverwrites = {
  key: number;
  metricName: string;
  dimensionName: string;
  startDate: string;
};

type ReviewMetricsProps = {
  title: string;
  description: string | React.ReactNode;
  buttons: ReviewHeaderActionButton[];
  metrics: ReviewMetric[];
  metricOverwrites?: ReviewMetricOverwrites[];
  records?: ReportOverview[];
};

export const SharedReviewMetrics: React.FC<ReviewMetricsProps> = ({
  title,
  description,
  buttons,
  metrics,
  metricOverwrites,
  records,
}) => {
  const { agencyId } = useParams();
  const navigate = useNavigate();
  const isFooterVisible = useIsFooterVisible();
  const [isMetricsSectionExpanded, setIsMetricsSectionExpanded] =
    useState(true);
  const [isOverwritesSectionExpanded, setIsOverwritesSectionExpanded] =
    useState(true);
  const [isRecordsSectionExpanded, setIsRecordsSectionExpanded] = useState(() =>
    records ? records.length <= 10 : false
  );

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
    <ReviewMetricsWrapper>
      <ReviewMetricsHeader transparent={false}>
        <LogoContainer
          onClick={() => navigate(`/agency/${agencyId}/${REPORTS_LOWERCASE}`)}
        >
          <Logo src={logoImg} alt="" />
        </LogoContainer>
        <ReviewMetricsButtonsContainer>
          {buttons.map(({ name, type, onClick, disabled }) => (
            <Button
              key={name}
              type={type}
              onClick={onClick}
              disabled={disabled}
            >
              {name}
            </Button>
          ))}
        </ReviewMetricsButtonsContainer>
        {
          // TODO(#24): Add Publish button to publish multiple reports at once (todo from upload metrics)
        }
      </ReviewMetricsHeader>
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
      <MetricsPanel>
        {metrics.map((metric) => {
          return renderSection(metric);
        })}
      </MetricsPanel>
    </ReviewMetricsWrapper>
  );
};
