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

import { DataVizAggregateName, RawDatapoint } from "../../shared/types";
import logoImg from "../assets/jc-logo-vector.png";
import {
  Button,
  DataUploadHeader,
  OrangeText,
} from "../DataUpload/DataUpload.styles";
import { UploadedMetric } from "../DataUpload/types";
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
  SectionTitleOverwrites,
  Subheading,
} from "./ReviewMetrics.styles";

type AggregationRowData = RawDatapoint[];

type DisaggregationRowData = {
  [disaggregation: string]: {
    [dimension: string]: RawDatapoint[];
  };
};

const ReviewMetrics: React.FC = observer(() => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!(location.state as UploadedMetric[] | null)) {
      // no metrics in passed in navigation state, redirect to home page
      navigate("/", { replace: true });
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

    // Create array of aggregate values, each value indexed with their corresponding date column
    const aggregateRowData: AggregationRowData = [];

    // Create map of disaggregations and dimensions, each dimension containing array of values,
    // each value indexed with their corresponding date column
    const disaggregationRowData: DisaggregationRowData = {};

    // create a mapping from start date to the column index the start date is located in for fast lookup
    const startDatesIndexLookup = startDates.reduce((map, current, idx) => {
      map[current] = idx; /* eslint-disable-line no-param-reassign */
      return map;
    }, {} as { [key: string]: number });

    metric.datapoints.forEach((dp) => {
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
        if (
          !disaggregationRowData[dp.disaggregation_display_name][
            dp.dimension_display_name
          ][startDatesIndexLookup[dp.start_date]]
        ) {
          disaggregationRowData[dp.disaggregation_display_name][
            dp.dimension_display_name
          ][startDatesIndexLookup[dp.start_date]] = dp;
          if (dp.old_value !== null) {
            overwrittenValuesCount += 1;
          }
        }
      } else if (!aggregateRowData[startDatesIndexLookup[dp.start_date]]) {
        aggregateRowData[startDatesIndexLookup[dp.start_date]] = dp;
        if (dp.old_value !== null) {
          overwrittenValuesCount += 1;
        }
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
        {renderDatapointsTable(
          aggregateRowData,
          disaggregationRowData,
          startDates
        )}
      </SectionContainer>
    );
  };

  const renderDatapointsTable = (
    aggregateRowData: AggregationRowData,
    disaggregationRowData: DisaggregationRowData,
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
                {aggregateRowData.map((dp, index) =>
                  // row data could be null, so no distinct key given in that case
                  renderDatapointsValue(index, dp.value, dp.old_value)
                )}
              </DatapointsTableDetailsRow>
              {Object.entries(disaggregationRowData).map(
                ([disaggregation, dimension]) => (
                  <React.Fragment key={disaggregation}>
                    <DatapointsTableDetailsDivider />
                    {Object.entries(dimension)
                      .sort(([a], [b]) => sortDatapointDimensions(a, b))
                      .map(([key, dps]) => (
                        <DatapointsTableDetailsRow key={key}>
                          {dps.map((dp, index) =>
                            renderDatapointsValue(index, dp.value, dp.old_value)
                          )}
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

  const renderDatapointsValue = (
    key: React.Key,
    value: string | number | null,
    oldValue: string | number | null
  ) => {
    if (value === null) {
      return null;
    }
    return (
      <DatapointsTableDetailsCell key={key}>
        {parseFloat(
          (typeof value === "string" ? parseFloat(value) : value).toFixed(2)
        )}
        {/* {value} */}
        {oldValue !== null ? <OrangeText>*</OrangeText> : ""}
      </DatapointsTableDetailsCell>
    );
  };

  return (
    <Container>
      <DataUploadHeader transparent={false}>
        <LogoContainer onClick={() => navigate("/")}>
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
          Review <span>{filteredMetrics.length}</span> Uploaded Metrics
        </Heading>
        <Subheading>
          Your data has been successfully uploaded. Take a moment to review the
          changes. If you believe there is an error, please contact the Justice
          Counts team via{" "}
          <a href="mailto:support@justice-counts.org">
            support@justicecounts.org
          </a>
        </Subheading>
        {filteredMetrics.map((metric, idx) => {
          return renderSection(metric, idx);
        })}
      </MainPanel>
    </Container>
  );
});

export default ReviewMetrics;
