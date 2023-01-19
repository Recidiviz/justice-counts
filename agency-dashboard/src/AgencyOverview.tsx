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

import arrow from "@justice-counts/common/assets/left-arrow-icon.svg";
import MiniBarChart from "@justice-counts/common/components/DataViz/MiniBarChart";
import { transformDataForBarChart } from "@justice-counts/common/components/DataViz/utils";
import { showToast } from "@justice-counts/common/components/Toast";
import {
  DatapointsGroupedByAggregateAndDisaggregations,
  DataVizAggregateName,
  DataVizTimeRangesMap,
} from "@justice-counts/common/types";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  AgencyOverviewWrapper,
  AgencyTitle,
  CategorizedMetricsContainer,
  CategoryTitle,
  Description,
  MetricBox,
  MetricBoxContentContainer,
  MetricBoxFooter,
  MetricBoxGraphContainer,
  MetricBoxGraphLastUpdate,
  MetricBoxTitle,
  MetricsContainer,
  MetricsCount,
  MetricsViewContainer,
  MiniChartContainer,
  PageTitle,
} from "./AgencyOverview.styles";
import { HeaderBar } from "./Header/HeaderBar";
import { useMaxMetricBoxesInRow } from "./hooks";
import { Loading } from "./Loading";
import { useStore } from "./stores";

const orderedCategories = [
  "Capacity and Cost",
  "Populations",
  "Operations and Dynamics",
  "Public Safety",
  "Equity",
  "Fairness",
];

const AgencyOverview = () => {
  const navigate = useNavigate();
  const params = useParams();
  const agencyId = Number(params.id);
  const { agencyDataStore } = useStore();
  const maxMetricsInRow = useMaxMetricBoxesInRow();
  const [hoveredMetric, setHoveredMetric] = useState<string | undefined>(
    undefined
  );

  const metricsCount = agencyDataStore.metrics.length;
  const availableMetricsCount = Object.values(
    agencyDataStore.datapointsByMetric
  ).filter((datapoints) => datapoints.aggregate.length > 0).length;

  const handleNavigate = (isPublished: boolean, metricKey: string) => {
    if (isPublished) {
      navigate(
        `/agency/${agencyId}/dashboard?metric=${metricKey.toLocaleLowerCase()}`
      );
    }
  };

  const getPublishCount = (
    datapoint: DatapointsGroupedByAggregateAndDisaggregations
  ): string => {
    const aggregateWithNonNullValues = datapoint.aggregate.filter(
      (dp) => dp[DataVizAggregateName] !== null
    );
    if (!aggregateWithNonNullValues.length) {
      return "No Data";
    }

    let result = "";

    const monthlyPublishes = aggregateWithNonNullValues.filter(
      (aggregation) => aggregation.frequency === "MONTHLY"
    );
    const yearlyPublishes = aggregateWithNonNullValues.filter(
      (aggregation) => aggregation.frequency === "ANNUAL"
    );

    const yearCount =
      yearlyPublishes.length + Math.floor(monthlyPublishes.length / 12);

    if (yearCount > 0) {
      result += `${yearCount} ${yearCount > 1 ? "Years" : "Year"} `;
    }

    const remainingMonths = monthlyPublishes.length % 12;

    if (remainingMonths > 0) {
      result += `${remainingMonths} ${
        remainingMonths > 1 ? "Months" : "Month"
      }`;
    }

    return result;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await agencyDataStore.fetchAgencyData(agencyId);
      } catch (error) {
        showToast({
          message: "Error fetching data.",
          color: "red",
          timeout: 4000,
        });
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (agencyDataStore.loading) {
    return <Loading />;
  }

  return (
    <>
      <HeaderBar />
      <AgencyOverviewWrapper>
        <PageTitle>Justice Counts</PageTitle>
        <AgencyTitle>{agencyDataStore.agency?.name}</AgencyTitle>
        <Description>
          {
            agencyDataStore.agencySettingsBySettingType.PURPOSE_AND_FUNCTIONS
              ?.value
          }
        </Description>
        <MetricsCount>
          <span>
            {availableMetricsCount} out of {metricsCount}
          </span>{" "}
          Metrics Available
        </MetricsCount>
        <MetricsViewContainer>
          {orderedCategories.map((category) => {
            const metrics = agencyDataStore.metricsByCategory[category];
            return (
              !!metrics && (
                <CategorizedMetricsContainer key={category}>
                  <CategoryTitle>{category}</CategoryTitle>
                  <MetricsContainer
                    maxMetricsInRow={
                      maxMetricsInRow >= 4 || maxMetricsInRow > metrics.length
                        ? metrics.length
                        : maxMetricsInRow
                    }
                  >
                    {metrics.map((metric) => {
                      const hasNonNullData =
                        agencyDataStore.datapointsByMetric[
                          metric.key
                        ].aggregate.filter(
                          (dp) => dp[DataVizAggregateName] !== null
                        ).length > 0;
                      const publishCount = getPublishCount(
                        agencyDataStore.datapointsByMetric[metric.key]
                      );
                      const data =
                        agencyDataStore.datapointsByMetric[metric.key]
                          .aggregate;
                      return (
                        <MetricBox
                          key={metric.key}
                          isPublished={hasNonNullData}
                          onClick={() =>
                            handleNavigate(hasNonNullData, metric.key)
                          }
                          onMouseEnter={() => setHoveredMetric(metric.key)}
                          onMouseLeave={() => setHoveredMetric(undefined)}
                        >
                          <MetricBoxTitle isPublished={hasNonNullData}>
                            {metric.display_name}
                          </MetricBoxTitle>
                          <MetricBoxContentContainer>
                            {hasNonNullData && (
                              <MetricBoxGraphContainer>
                                <MiniChartContainer>
                                  <MiniBarChart
                                    data={transformDataForBarChart(
                                      data,
                                      DataVizTimeRangesMap.All,
                                      "Count"
                                    )}
                                    dimensionNames={[DataVizAggregateName]}
                                    isMetricHovered={
                                      metric.key === hoveredMetric &&
                                      maxMetricsInRow >= 2
                                    }
                                  />
                                </MiniChartContainer>
                                <MetricBoxGraphLastUpdate>
                                  Last updated{" "}
                                  {new Date(
                                    data[data.length - 1].start_date
                                  ).toLocaleDateString("en-US")}
                                </MetricBoxGraphLastUpdate>
                              </MetricBoxGraphContainer>
                            )}
                            <MetricBoxFooter isPublished={hasNonNullData}>
                              {publishCount}{" "}
                              {hasNonNullData && <img src={arrow} alt="" />}
                            </MetricBoxFooter>
                          </MetricBoxContentContainer>
                        </MetricBox>
                      );
                    })}
                  </MetricsContainer>
                </CategorizedMetricsContainer>
              )
            );
          })}
        </MetricsViewContainer>
      </AgencyOverviewWrapper>
    </>
  );
};

export default observer(AgencyOverview);
