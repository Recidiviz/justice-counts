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

import { ReactComponent as DownloadIcon } from "@justice-counts/common/assets/download-icon.svg";
import { ReactComponent as ShareIcon } from "@justice-counts/common/assets/share-icon.svg";
import { Button } from "@justice-counts/common/components/Button";
import { CategoryOverviewLineChart } from "@justice-counts/common/components/DataViz/CategoryOverviewLineChart";
import MetricsCategoryBarChart from "@justice-counts/common/components/DataViz/MetricsCategoryBarChart";
import { getDataVizTimeRangeByFilterByMetricFrequency } from "@justice-counts/common/components/DataViz/utils";
import { useBarChart, useLineChart } from "@justice-counts/common/hooks";
import { DataVizAggregateName, Metric } from "@justice-counts/common/types";
import { removeSnakeCase } from "@justice-counts/common/utils";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCurrentPng } from "recharts-to-png";

import { HeaderBar } from "../Header";
import { Loading } from "../Loading";
import { useStore } from "../stores";
import { copyCurrentUrlToClipboard } from "../utils";
import * as Styled from "./CategoryOverview.styled";
import { VisibleCategoriesMetadata } from "./types";

const visibleCategoriesMetadata: VisibleCategoriesMetadata = {
  "capacity-and-costs": {
    key: "Capacity and Costs",
    label: "Capacity and Costs",
    description:
      "The number of full-time equivalent (FTE) positions budgeted and paid for by the agency for the operation and maintenance of the jail facilities and the care of people who are incarcerated under the jurisdiction of the agency.",
  },
};

export const CategoryOverview = observer(() => {
  const navigate = useNavigate();
  const { agencyDataStore } = useStore();
  const { category } = useParams() as {
    category: string;
  };
  const [, { ref }] = useCurrentPng({
    scale: 10,
  });

  const {
    agencyName,
    agencySystems,
    datapointsByMetric,
    dimensionNamesByMetricAndDisaggregation,
    loading,
    agencySystemsWithData,
    downloadMetricsData,
    getMetricsWithDataByCategory,
  } = agencyDataStore;
  const categoryKey = visibleCategoriesMetadata[category]?.key;
  const metricsWithData = categoryKey
    ? getMetricsWithDataByCategory(categoryKey)
    : undefined;

  const [dataRangeFilter, setDataRangeFilter] = useState<"recent" | "all">(
    "all"
  );
  const [hoveredDate, setHoveredDate] = useState<{ [key: string]: string }>({});
  const [currentSystem, setCurrentSystem] = useState(agencySystems?.[0]);

  const { getLineChartDataFromMetric, getLineChartDimensionsFromMetric } =
    useLineChart({
      datapointsByMetric,
      dimensionNamesByMetricAndDisaggregation,
    });
  const { getBarChartData } = useBarChart({
    getDataVizTimeRange:
      getDataVizTimeRangeByFilterByMetricFrequency(dataRangeFilter),
    datapointsByMetric,
  });
  const systemsWithData = agencySystemsWithData();

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <HeaderBar />
      <Styled.Wrapper>
        <Styled.Container>
          {/* Category Information */}
          <Styled.TopBlock>
            <Button
              label="<- Home"
              onClick={() => navigate("..", { relative: "path" })}
              labelColor="blue"
              noHover
              noSidePadding
              size="medium"
            />
            <Styled.AgencyTitle>{agencyName}</Styled.AgencyTitle>
            <Styled.CategoryTitle>
              {visibleCategoriesMetadata[category]?.label}
            </Styled.CategoryTitle>
            <Styled.CategoryDescription>
              {visibleCategoriesMetadata[category]?.description}
            </Styled.CategoryDescription>

            {/* Download/Share Buttons */}
            <Styled.TopBlockControls>
              <Styled.TopBlockControl onClick={downloadMetricsData}>
                <DownloadIcon /> Download Data
              </Styled.TopBlockControl>
              <Styled.TopBlockControl onClick={copyCurrentUrlToClipboard}>
                <ShareIcon /> Share
              </Styled.TopBlockControl>
            </Styled.TopBlockControls>
          </Styled.TopBlock>

          {/* System Selector */}
          {systemsWithData.length > 1 && (
            <Styled.CustomSystemChipsContainer>
              {agencySystemsWithData().map((system) => {
                return (
                  <Styled.CustomSystemChip
                    key={system}
                    onClick={() => setCurrentSystem(system)}
                    active={system === currentSystem}
                  >
                    {removeSnakeCase(system).toLocaleLowerCase()}
                  </Styled.CustomSystemChip>
                );
              })}
            </Styled.CustomSystemChipsContainer>
          )}

          {/* Metrics + Data Visualizations */}
          <Styled.MetricsBlock>
            {/* Time Range Filters */}
            <Styled.MetricsFilters>
              <Styled.MetricsFilterButton
                active={dataRangeFilter === "recent"}
                onClick={() => setDataRangeFilter("recent")}
              >
                Recent
              </Styled.MetricsFilterButton>
              <Styled.MetricsFilterButton
                active={dataRangeFilter === "all"}
                onClick={() => setDataRangeFilter("all")}
              >
                All
              </Styled.MetricsFilterButton>
            </Styled.MetricsFilters>

            {/* Metric Information & Data Visualization */}
            <Styled.MetricsWrapper>
              {metricsWithData
                ?.filter((metric) => metric.system.key === currentSystem)
                .map((metric: Metric) => (
                  <Styled.MetricBox key={metric.key}>
                    <Styled.MetricName>{metric.display_name}</Styled.MetricName>
                    <Styled.MetricDataVizContainer>
                      <Styled.MetricDescriptionBarChartWrapper>
                        <Styled.MetricDescription>
                          {metric.description}
                        </Styled.MetricDescription>

                        {/* Bar Chart */}
                        <MetricsCategoryBarChart
                          width={620}
                          data={getBarChartData(metric)}
                          onHoverBar={(payload) => {
                            setHoveredDate((prev) => ({
                              ...prev,
                              [metric.key]: payload.start_date,
                            }));
                          }}
                          dimensionNames={[DataVizAggregateName]}
                          metric={metric.display_name}
                          ref={ref}
                        />
                      </Styled.MetricDescriptionBarChartWrapper>

                      {/* Breakdown/Disaggregation Line Chart */}
                      {/* NOTE: CategoryOverviewLineChart will not appear if all metrics are disabled or the metric itself has no breakdowns */}
                      {/* TODO(#978) Refactor to handle multiple breakdowns */}
                      {getLineChartDataFromMetric(metric).length > 0 && (
                        <CategoryOverviewLineChart
                          data={getLineChartDataFromMetric(metric)}
                          isFundingOrExpenses={
                            metric.display_name === "Funding" ||
                            metric.display_name === "Expenses"
                          }
                          dimensions={getLineChartDimensionsFromMetric(metric)}
                          hoveredDate={hoveredDate[metric.key]}
                          setHoveredDate={setHoveredDate}
                          metric={metric}
                        />
                      )}
                    </Styled.MetricDataVizContainer>
                  </Styled.MetricBox>
                ))}
            </Styled.MetricsWrapper>
          </Styled.MetricsBlock>
        </Styled.Container>
      </Styled.Wrapper>
    </>
  );
});
