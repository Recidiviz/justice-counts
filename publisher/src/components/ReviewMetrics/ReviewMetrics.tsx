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

import { DatapointsTableView } from "@justice-counts/common/components/DataViz/DatapointsTableView";
import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
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
  SectionContainer,
  SectionTitle,
  SectionTitleContainer,
  SectionTitleMonths,
  SectionTitleNumber,
  SectionTitleOverwrites,
  Subheading,
} from "./ReviewMetrics.styles";

const ReviewMetrics: React.FC = observer(() => {
  const { agencyId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!(location.state as UploadedMetric[] | null)) {
      // no metrics in passed in navigation state, redirect to home page
      navigate(`/agency/${agencyId}/${REPORTS_LOWERCASE}`, { replace: true });
    }
  });

  if (!(location.state as UploadedMetric[] | null)) {
    return null;
  }

  const filteredMetrics = (location.state as UploadedMetric[])
    .map((metric) => ({
      ...metric,
      datapoints: metric.datapoints.filter((dp) => dp.value !== null),
    }))
    .filter((metric) => metric.datapoints.length > 0);

  const renderSection = (metric: UploadedMetric, index: number) => {
    const startDates = Array.from(
      new Set(metric.datapoints.map((dp) => dp.start_date))
    ).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    // keep track of count of overwritten values
    let overwrittenValuesCount = 0;

    metric.datapoints.forEach((dp) => {
      if (dp.old_value !== null) {
        overwrittenValuesCount += 1;
      }
    });

    return (
      <SectionContainer key={metric.key}>
        <SectionTitleContainer>
          <SectionTitleNumber>{index + 1}</SectionTitleNumber>
          <SectionTitle>{metric.display_name}</SectionTitle>
          {overwrittenValuesCount > 0 && (
            <SectionTitleOverwrites>
              * {overwrittenValuesCount} Overwritten Value
              {overwrittenValuesCount !== 1 ? "s" : ""}
            </SectionTitleOverwrites>
          )}
          <SectionTitleMonths>
            {startDates.length}{" "}
            {metric.datapoints?.[0].frequency === "ANNUAL" ? "year" : "month"}
            {startDates.length !== 1 ? "s" : ""}
          </SectionTitleMonths>
        </SectionTitleContainer>
        <DatapointsTableView datapoints={metric.datapoints} />
      </SectionContainer>
    );
  };

  return (
    <Container>
      <DataUploadHeader transparent={false}>
        <LogoContainer
          onClick={() => navigate(`/agency/${agencyId}/${REPORTS_LOWERCASE}`)}
        >
          <Logo src={logoImg} alt="" />
        </LogoContainer>

        <Button type="blue" onClick={() => navigate(-1)}>
          Close
        </Button>
        {
          // TODO(#24): Add Publish button to publish multiple reports at once
        }
      </DataUploadHeader>
      <MainPanel>
        <Heading>
          {filteredMetrics.length > 0 ? (
            <>
              Review <span>{filteredMetrics.length}</span> Uploaded Metrics
            </>
          ) : (
            "No Metrics to Review"
          )}
        </Heading>
        <Subheading>
          {filteredMetrics.length > 0 ? (
            <>
              The following data has been successfully uploaded. Take a moment
              to review the changes. If you believe there is an error, please
              contact the Justice Counts team via{" "}
              <a href="mailto:justice-counts-support@csg.org">
                justice-counts-support@csg.org
              </a>
              .
            </>
          ) : (
            "Uploaded file contains no metrics to review."
          )}
        </Subheading>
        {filteredMetrics.map((metric, idx) => {
          return renderSection(metric, idx);
        })}
      </MainPanel>
    </Container>
  );
});

export default ReviewMetrics;
