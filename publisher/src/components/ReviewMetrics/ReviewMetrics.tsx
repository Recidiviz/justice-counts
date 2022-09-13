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

import { when } from "mobx";
import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";

import {
  DatapointsGroupedByAggregateAndDisaggregations,
  DatapointValue,
  DataVizAggregateName,
} from "../../shared/types";
import { useStore } from "../../stores";
import {
  formatDateShort,
  getDatapointDimensions,
  getStartDates,
  sortDatapointDimensions,
} from "../DataViz/utils";
import {
  Container,
  DatapointsTableContainer,
  DatapointsTableDetailsCell,
  DatapointsTableDetailsContainer,
  DatapointsTableDetailsDivider,
  DatapointsTableDetailsRow,
  DatapointsTableDetailsRowHeader,
  DatapointsTableDetailsTable,
  DatapointsTableNamesContainer,
  DatapointsTableNamesDivider,
  DatapointsTableNamesRow,
  Divider,
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
  const { userStore, datapointsStore } = useStore();

  useEffect(
    () =>
      // return when's disposer so it is cleaned up if it never runs
      when(
        () => userStore.userInfoLoaded,
        () => {
          datapointsStore.getDatapoints();
        }
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const renderSection = (
    metricName: string,
    datapoints: DatapointsGroupedByAggregateAndDisaggregations,
    index: number
  ) => {
    const startDates = getStartDates(datapoints);
    return (
      <SectionContainer key={metricName}>
        <SectionTitleContainer>
          <SectionTitleNumber>{index + 1}</SectionTitleNumber>
          <SectionTitle>{metricName}</SectionTitle>
          <SectionTitleMonths>
            {startDates.length} month{startDates.length !== 1 ? "s" : ""}
          </SectionTitleMonths>
        </SectionTitleContainer>
        {renderDatapointsTable(datapoints, startDates)}
      </SectionContainer>
    );
  };

  const renderDatapointsTable = (
    datapoints: DatapointsGroupedByAggregateAndDisaggregations,
    startDates: string[]
  ) => {
    const startDatesIndexLookup = startDates.reduce((map, current, idx) => {
      map[current] = idx; /* eslint-disable-line no-param-reassign */
      return map;
    }, {} as { [key: string]: number });

    const aggregateRowData: DatapointValue[] = new Array(
      startDates.length
    ).fill(null);
    datapoints.aggregate.forEach((dp) => {
      aggregateRowData[startDatesIndexLookup[dp.start_date]] =
        dp[DataVizAggregateName];
    });

    const disaggregationRowData: {
      [disaggregation: string]: {
        [dimension: string]: DatapointValue[];
      };
    } = {};
    Object.entries(datapoints.disaggregations).forEach(
      ([disaggregation, entry]) => {
        if (!disaggregationRowData[disaggregation]) {
          disaggregationRowData[disaggregation] = {};
        }
        Object.values(entry).forEach((datapoint) => {
          const dimensions = getDatapointDimensions(datapoint);
          Object.entries(dimensions).forEach(([dimension, value]) => {
            if (!disaggregationRowData[disaggregation][dimension]) {
              disaggregationRowData[disaggregation][dimension] = [];
            }
            disaggregationRowData[disaggregation][dimension][
              startDatesIndexLookup[datapoint.start_date]
            ] = value;
          });
        });
      }
    );

    return (
      <DatapointsTableContainer>
        <DatapointsTableNamesContainer>
          <DatapointsTableNamesRow>
            {DataVizAggregateName}
          </DatapointsTableNamesRow>
          {Object.entries(disaggregationRowData).map(
            ([disaggregation, dimension]) => (
              <>
                <DatapointsTableNamesDivider>
                  {disaggregation}
                </DatapointsTableNamesDivider>
                {Object.keys(dimension)
                  .sort(sortDatapointDimensions)
                  .map((dimensionName) => (
                    <DatapointsTableNamesRow>
                      {dimensionName}
                    </DatapointsTableNamesRow>
                  ))}
              </>
            )
          )}
        </DatapointsTableNamesContainer>
        <DatapointsTableDetailsContainer>
          <DatapointsTableDetailsTable>
            <DatapointsTableDetailsRow>
              {startDates.map((date) => (
                <DatapointsTableDetailsRowHeader>
                  {formatDateShort(date)}
                </DatapointsTableDetailsRowHeader>
              ))}
            </DatapointsTableDetailsRow>
            <DatapointsTableDetailsRow>
              {aggregateRowData.map((value) => (
                <DatapointsTableDetailsCell>{value}</DatapointsTableDetailsCell>
              ))}
            </DatapointsTableDetailsRow>
            {Object.values(disaggregationRowData).map((dimension) => (
              <>
                <DatapointsTableDetailsDivider />
                {Object.entries(dimension)
                  .sort(([a], [b]) => sortDatapointDimensions(a, b))
                  .map(([, values]) => (
                    <DatapointsTableDetailsRow>
                      {values.map((value) => (
                        <DatapointsTableDetailsCell>
                          {value}
                        </DatapointsTableDetailsCell>
                      ))}
                    </DatapointsTableDetailsRow>
                  ))}
              </>
            ))}
          </DatapointsTableDetailsTable>
        </DatapointsTableDetailsContainer>
      </DatapointsTableContainer>
    );
  };

  return (
    <Container>
      <MainPanel>
        <Heading>
          Review{" "}
          <span>{Object.keys(datapointsStore.datapointsByMetric).length}</span>{" "}
          Metrics
        </Heading>
        <Subheading>
          Before publishing, take a moment to review the changes. If you believe
          there is an error, please contact the Justice Counts team via{" "}
          <a href="mailto:support@justice-counts.org">
            support@justicecounts.org
          </a>
        </Subheading>
        <Divider />
        {Object.entries(datapointsStore.datapointsByMetric).map(
          ([metricName, datapoints], idx) => {
            return renderSection(metricName, datapoints, idx);
          }
        )}
      </MainPanel>
    </Container>
  );
});

export default ReviewMetrics;
