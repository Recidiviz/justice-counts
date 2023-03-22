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

import blueCheck from "@justice-counts/common/assets/status-check-icon.png";
import { DatapointsTableView } from "@justice-counts/common/components/DataViz/DatapointsTableView";
import { formatDateShortMonthYear } from "@justice-counts/common/components/DataViz/utils";
import { useIsFooterVisible } from "@justice-counts/common/hooks";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import logoImg from "../assets/jc-logo-vector-new.svg";
import {
  Button,
  DataUploadHeader,
  DataUploadHeaderButtonsContainer,
} from "../DataUpload";
import { UploadedMetric } from "../DataUpload/types";
import { REPORTS_LOWERCASE } from "../Global/constants";
import { Logo, LogoContainer } from "../Header";
import { ReviewModal } from "../Reports/ReviewModal";
import {
  Container,
  Heading,
  HeadingGradient,
  MainPanel,
  MetricsPanel,
  MetricStatusIcon,
  SectionContainer,
  SectionExpandStatusSign,
  Summary,
  SummarySection,
  SummarySectionLine,
  SummarySectionsContainer,
  SummarySectionTitle,
} from "./ReviewMetrics.styles";

type MetricOverwrites = {
  key: number;
  metricName: string;
  dimensionName: string;
  startDate: string;
};

const ReviewMetrics: React.FC = observer(() => {
  const { agencyId } = useParams();
  const { state } = useLocation();
  const { uploadedMetrics, fileName } = state as {
    uploadedMetrics: UploadedMetric[] | null;
    fileName: string;
  };
  const navigate = useNavigate();
  const isFooterVisible = useIsFooterVisible();
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isMetricsSectionExpanded, setIsMetricsSectionExpanded] =
    useState(true);
  const [isOverwritesSectionExpanded, setIsOverwritesSectionExpanded] =
    useState(true);

  useEffect(() => {
    if (!uploadedMetrics) {
      // no metrics in passed in navigation state, redirect to home page
      navigate(`/agency/${agencyId}/${REPORTS_LOWERCASE}`, { replace: true });
    }
  });

  if (!uploadedMetrics) {
    return null;
  }

  const filteredMetrics = uploadedMetrics
    .map((metric) => ({
      ...metric,
      datapoints: metric.datapoints.filter((dp) => dp.value !== null),
    }))
    .filter((metric) => metric.datapoints.length > 0);

  const overwrites: MetricOverwrites[] = [];

  filteredMetrics.forEach((metric) => {
    metric.datapoints.forEach((dp) => {
      if (dp.old_value !== null) {
        const overwriteData: MetricOverwrites = {
          key: dp.id,
          metricName: dp.metric_display_name || "",
          dimensionName: dp.dimension_display_name || "",
          startDate: dp.start_date,
        };
        overwrites.push(overwriteData);
      }
    });
  });

  const renderSection = (metric: UploadedMetric) => {
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
    <Container>
      {isSuccessModalOpen && <ReviewModal fileName={fileName} />}
      <DataUploadHeader transparent={false}>
        <LogoContainer
          onClick={() => navigate(`/agency/${agencyId}/${REPORTS_LOWERCASE}`)}
        >
          <Logo src={logoImg} alt="" />
        </LogoContainer>
        <DataUploadHeaderButtonsContainer>
          {filteredMetrics.length > 0 ? (
            <>
              <Button
                type="border"
                onClick={() =>
                  navigate(`/agency/${agencyId}/${REPORTS_LOWERCASE}`)
                }
              >
                Exit Without Publishing
              </Button>
              <Button type="blue" onClick={() => setIsSuccessModalOpen(true)}>
                Publish
              </Button>
            </>
          ) : (
            <Button type="red" onClick={() => navigate(-1)}>
              Close
            </Button>
          )}
        </DataUploadHeaderButtonsContainer>
        {
          // TODO(#24): Add Publish button to publish multiple reports at once
        }
      </DataUploadHeader>
      <MainPanel>
        <Summary isFooterVisible={isFooterVisible}>
          <Heading>
            {filteredMetrics.length > 0
              ? "Review Upload"
              : "No Metrics to Review"}
            <span>
              {filteredMetrics.length > 0
                ? "Here’s a breakdown of data from the file you uploaded. You can publish these changes now, or save as a draft for later."
                : "Uploaded file contains no metrics to review."}
            </span>
          </Heading>
          <SummarySectionsContainer>
            <HeadingGradient />
            {filteredMetrics.length > 0 && (
              <SummarySection>
                <SummarySectionTitle
                  color="blue"
                  onClick={() =>
                    setIsMetricsSectionExpanded(!isMetricsSectionExpanded)
                  }
                >
                  <span>{filteredMetrics.length}</span> Metric
                  {filteredMetrics.length > 1 ? "s" : ""}
                  <SectionExpandStatusSign>
                    {isMetricsSectionExpanded ? "-" : "+"}
                  </SectionExpandStatusSign>
                </SummarySectionTitle>
                {isMetricsSectionExpanded &&
                  filteredMetrics.map((metric) => (
                    <SummarySectionLine key={metric.key}>
                      <MetricStatusIcon src={blueCheck} alt="" />
                      {metric.display_name}
                    </SummarySectionLine>
                  ))}
              </SummarySection>
            )}
            {overwrites.length > 0 && (
              <SummarySection>
                <SummarySectionTitle
                  color="orange"
                  onClick={() =>
                    setIsOverwritesSectionExpanded(!isOverwritesSectionExpanded)
                  }
                >
                  <span>{overwrites.length}</span> Overwrite
                  {overwrites.length > 1 ? "s" : ""}
                  <SectionExpandStatusSign>
                    {isOverwritesSectionExpanded ? "-" : "+"}
                  </SectionExpandStatusSign>
                </SummarySectionTitle>
                {isOverwritesSectionExpanded &&
                  overwrites.map(
                    ({ key, metricName, dimensionName, startDate }) => (
                      <SummarySectionLine key={key}>
                        {metricName}: {dimensionName}
                        <span>({formatDateShortMonthYear(startDate)})</span>
                      </SummarySectionLine>
                    )
                  )}
              </SummarySection>
            )}
          </SummarySectionsContainer>
        </Summary>
        <MetricsPanel>
          {filteredMetrics.map((metric) => {
            return renderSection(metric);
          })}
        </MetricsPanel>
      </MainPanel>
    </Container>
  );
});

export default ReviewMetrics;
