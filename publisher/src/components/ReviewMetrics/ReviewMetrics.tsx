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

import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { DatapointValue, DataVizAggregateName } from "../../shared/types";
import logoImg from "../assets/jc-logo-vector.png";
import { Button, DataUploadHeader } from "../DataUpload/DataUpload.styles";
import {
  DataUploadDatapoint,
  UploadedMetric,
  UploadedMetrics,
} from "../DataUpload/types";
import { formatDateShort, sortDatapointDimensions } from "../DataViz/utils";
import { Logo, LogoContainer } from "../Header";
import {
  Container,
  DatapointsTableContainer,
  DatapointsTableDetailsCell,
  DatapointsTableDetailsContainer,
  DatapointsTableDetailsDivider,
  DatapointsTableDetailsRow,
  DatapointsTableDetailsRowBody,
  DatapointsTableDetailsRowHead,
  DatapointsTableDetailsRowHeader,
  DatapointsTableDetailsTable,
  DatapointsTableNamesContainer,
  DatapointsTableNamesDivider,
  DatapointsTableNamesRow,
  Heading,
  MainPanel,
  SectionContainer,
  SectionTitle,
  SectionTitleContainer,
  SectionTitleMonths,
  SectionTitleNumber,
  Subheading,
} from "./ReviewMetrics.styles";

const ReviewMetrics: React.FC = observer(() => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!location.state?.metrics as UploadedMetrics | false) {
      // no metrics in passed in navigation state, redirect to home page
      navigate("/", { replace: true });
    }
  });

  if (!location.state?.metrics as UploadedMetrics | false) {
    return null;
  }

  const { metrics }: UploadedMetrics = location.state as UploadedMetrics;

  const renderSection = (metric: UploadedMetric, index: number) => {
    const startDates = Array.from(
      new Set(metric.datapoints.map((dp) => dp.start_date))
    ).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    return (
      <SectionContainer key={metric.key}>
        <SectionTitleContainer>
          <SectionTitleNumber>{index + 1}</SectionTitleNumber>
          <SectionTitle>{metric.display_name}</SectionTitle>
          <SectionTitleMonths>
            {startDates.length}{" "}
            {metric.datapoints[0].frequency === "ANNUAL" ? "year" : "month"}
            {startDates.length !== 1 ? "s" : ""}
          </SectionTitleMonths>
        </SectionTitleContainer>
        {renderDatapointsTable(metric.datapoints, startDates)}
      </SectionContainer>
    );
  };

  const renderDatapointsTable = (
    datapoints: DataUploadDatapoint[],
    startDates: string[]
  ) => {
    /**
     * The Datapoints Table is made up of a few parts:
     * - Column of disaggregations and dimensions that remains in place as
     *   the rest of the table scrolls horizontally
     * - HTML table containing:
     *   - a table header row of report start dates, each date represents a column title
     *   - a table row of the aggregate values, each value corresponds with the date column it is reported in
     *   - empty table rows used to space apart different disaggregations
     *   - table rows for each dimension, each value corresponds with the date column it is reported in
     */

    // // create a mapping from start date to the column index the start date is located in for fast lookup
    const startDatesIndexLookup = startDates.reduce((map, current, idx) => {
      map[current] = idx; /* eslint-disable-line no-param-reassign */
      return map;
    }, {} as { [key: string]: number });

    // // Create array of aggregate values, each value indexed with their corresponding date column
    const aggregateRowData: DatapointValue[] = [];

    // // Create map of disaggregations and dimensions, each dimension containing array of values,
    // // each value indexed with their corresponding date column
    const disaggregationRowData: {
      [disaggregation: string]: {
        [dimension: string]: DatapointValue[];
      };
    } = {};
    datapoints.forEach((dp) => {
      if (dp.value !== null) {
        if (dp.disaggregation_display_name && dp.dimension_display_name) {
          if (!disaggregationRowData[dp.disaggregation_display_name]) {
            disaggregationRowData[dp.disaggregation_display_name] = {};
          }
          if (
            !disaggregationRowData[dp.disaggregation_display_name][
              dp.dimension_display_name
            ]
          ) {
            disaggregationRowData[dp.disaggregation_display_name][
              dp.dimension_display_name
            ] = [];
          }
          disaggregationRowData[dp.disaggregation_display_name][
            dp.dimension_display_name
          ][startDatesIndexLookup[dp.start_date]] = dp.value;
        } else {
          aggregateRowData[startDatesIndexLookup[dp.start_date]] = dp.value;
        }
      }
    });

    return (
      <DatapointsTableContainer>
        <DatapointsTableNamesContainer>
          <DatapointsTableNamesRow>
            {DataVizAggregateName}
          </DatapointsTableNamesRow>
          {Object.entries(disaggregationRowData).map(
            ([disaggregation, dimension]) => (
              <React.Fragment key={disaggregation}>
                <DatapointsTableNamesDivider>
                  {disaggregation}
                </DatapointsTableNamesDivider>
                {Object.keys(dimension)
                  .sort(sortDatapointDimensions)
                  .map((dimensionName) => (
                    <DatapointsTableNamesRow key={dimensionName}>
                      {dimensionName}
                    </DatapointsTableNamesRow>
                  ))}
              </React.Fragment>
            )
          )}
        </DatapointsTableNamesContainer>
        <DatapointsTableDetailsContainer>
          <DatapointsTableDetailsTable>
            <DatapointsTableDetailsRowHead>
              <DatapointsTableDetailsRow>
                {startDates.map((date) => (
                  <DatapointsTableDetailsRowHeader key={date}>
                    {formatDateShort(date)}
                  </DatapointsTableDetailsRowHeader>
                ))}
              </DatapointsTableDetailsRow>
            </DatapointsTableDetailsRowHead>
            <DatapointsTableDetailsRowBody>
              <DatapointsTableDetailsRow>
                {aggregateRowData.map((value, index) => (
                  // row data could be null, so no distinct key given in that case
                  // eslint-disable-next-line react/no-array-index-key
                  <DatapointsTableDetailsCell key={index}>
                    {value}
                  </DatapointsTableDetailsCell>
                ))}
              </DatapointsTableDetailsRow>
              {Object.entries(disaggregationRowData).map(
                ([disaggregation, dimension]) => (
                  <React.Fragment key={disaggregation}>
                    <DatapointsTableDetailsDivider />
                    {Object.entries(dimension)
                      .sort(([a], [b]) => sortDatapointDimensions(a, b))
                      .map(([key, values]) => (
                        <DatapointsTableDetailsRow key={key}>
                          {values.map((value, index) => (
                            // eslint-disable-next-line react/no-array-index-key
                            <DatapointsTableDetailsCell key={index}>
                              {value}
                            </DatapointsTableDetailsCell>
                          ))}
                        </DatapointsTableDetailsRow>
                      ))}
                  </React.Fragment>
                )
              )}
            </DatapointsTableDetailsRowBody>
          </DatapointsTableDetailsTable>
        </DatapointsTableDetailsContainer>
      </DatapointsTableContainer>
    );
  };

  return (
    <Container>
      <DataUploadHeader transparent={false}>
        <LogoContainer onClick={() => navigate("/")}>
          <Logo src={logoImg} alt="" />
        </LogoContainer>

        <Button type="blue" onClick={() => navigate(-1)}>
          Save and Exit
        </Button>
      </DataUploadHeader>
      <MainPanel>
        <Heading>
          Review <span>{metrics.length}</span> Metrics
        </Heading>
        <Subheading>
          Before publishing, take a moment to review the changes. If you believe
          there is an error, please contact the Justice Counts team via{" "}
          <a href="mailto:support@justice-counts.org">
            support@justicecounts.org
          </a>
        </Subheading>
        {metrics.map((metric, idx) => {
          if (metric.datapoints.length > 0) {
            return renderSection(metric, idx);
          }
          return null;
        })}
      </MainPanel>
    </Container>
  );
});

export default ReviewMetrics;
