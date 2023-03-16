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
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import logoImg from "../assets/jc-logo-vector-new.svg";
import { Button, DataUploadHeader } from "../DataUpload";
import { UploadedMetric } from "../DataUpload/types";
import { REPORTS_LOWERCASE } from "../Global/constants";
import { Logo, LogoContainer } from "../Header";
import {
  Container,
  Heading,
  MainPanel,
  MetricsPanel,
  MetricStatusIcon,
  SectionContainer,
  Summary,
  SummarySection,
  SummarySectionLine,
  SummarySectionTitle,
} from "./ReviewMetrics.styles";
import { ReviewMetricsModal } from "./ReviewMetricsModal";

type Overwrite = {
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
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

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

  const overwrites: Overwrite[] = [];

  filteredMetrics.forEach((metric) => {
    metric.datapoints.forEach((dp) => {
      if (dp.old_value !== null) {
        const overwriteData: Overwrite = {
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
      {isSuccessModalOpen && <ReviewMetricsModal fileName={fileName} />}
      <DataUploadHeader transparent={false}>
        <LogoContainer
          onClick={() => navigate(`/agency/${agencyId}/${REPORTS_LOWERCASE}`)}
        >
          <Logo src={logoImg} alt="" />
        </LogoContainer>

        <Button type="blue" onClick={() => setIsSuccessModalOpen(true)}>
          Publish
        </Button>
        {
          // TODO(#24): Add Publish button to publish multiple reports at once
        }
      </DataUploadHeader>
      <MainPanel>
        <Summary>
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
          {filteredMetrics.length > 0 && (
            <SummarySection>
              <SummarySectionTitle color="blue">
                <span>{filteredMetrics.length}</span> Metric
                {filteredMetrics.length > 1 ? "s" : ""}
              </SummarySectionTitle>
              {filteredMetrics.map((metric) => (
                <SummarySectionLine key={metric.key}>
                  <MetricStatusIcon src={blueCheck} alt="" />
                  {metric.display_name}
                </SummarySectionLine>
              ))}
            </SummarySection>
          )}
          {overwrites.length > 0 && (
            <SummarySection>
              <SummarySectionTitle color="orange">
                <span>{overwrites.length}</span> Overwrite
                {overwrites.length > 1 ? "s" : ""}
              </SummarySectionTitle>
              {overwrites.map(
                ({ key, metricName, dimensionName, startDate }) => (
                  <SummarySectionLine key={key}>
                    {metricName}: {dimensionName}
                    <span>({formatDateShortMonthYear(startDate)})</span>
                  </SummarySectionLine>
                )
              )}
            </SummarySection>
          )}
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
