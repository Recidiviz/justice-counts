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

import MiniBarChart from "@justice-counts/common/components/DataViz/MiniBarChart";
import { transformDataForBarChart } from "@justice-counts/common/components/DataViz/utils";
import {
  AgencySystems,
  DataVizAggregateName,
  DataVizTimeRangesMap,
} from "@justice-counts/common/types";
import { printDateAsShortMonthYear } from "@justice-counts/common/utils";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Footer } from "../Footer";
import { HeaderBar } from "../Header";
import { Loading } from "../Loading";
import { NotFound } from "../NotFound";
import { useStore } from "../stores";
import {
  AgencyDescription,
  AgencyHomepage,
  AgencyOverviewHeader,
  AgencyOverviewWrapper,
  AgencyTitle,
  CategorizedMetricsContainer,
  CategoryDescription,
  CategoryTitle,
  MetricBox,
  MetricBoxContentContainer,
  MetricBoxGraphContainer,
  MetricBoxGraphRange,
  MetricBoxTitle,
  MetricsContainer,
  MetricsViewContainer,
  MiniChartContainer,
  SystemChip,
  SystemChipsContainer,
} from ".";

// Only showing Capacity and Cost metrics currently
const orderedCategoriesMap: {
  [category: string]: { label: string; description: string };
} = {
  "Capacity and Costs": {
    label: "Understand the Finances",
    description: "See how we’re funded and where we use those funds",
  },
};

export const AgencyOverview = observer(() => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { agencyDataStore } = useStore();
  const [currentSystem, setCurrentSystem] = useState<
    AgencySystems | undefined
  >();
  const agencyDescription =
    agencyDataStore.agencySettingsBySettingType.PURPOSE_AND_FUNCTIONS?.value;
  const agencyHomepageUrl =
    agencyDataStore.agencySettingsBySettingType.HOMEPAGE_URL?.value;

  useEffect(() => {
    setCurrentSystem(agencyDataStore.agency?.systems[0]);
  }, [agencyDataStore]);

  const metricsByAvailableCategories = agencyDataStore.metrics.filter(
    (metric) => Object.keys(orderedCategoriesMap).includes(metric.category)
  );

  const metricsByAvailableCategoriesWithData =
    metricsByAvailableCategories.filter(
      (metric) =>
        agencyDataStore.datapointsByMetric[metric.key].aggregate.filter(
          (dp) => dp[DataVizAggregateName] !== null
        ).length > 0
    );

  if (agencyDataStore.loading) return <Loading />;

  const AgencyHeader = () => (
    <AgencyOverviewHeader>
      <AgencyTitle>{agencyDataStore.agency?.name}</AgencyTitle>
      <AgencyDescription>
        {agencyDescription}{" "}
        {agencyHomepageUrl && (
          <AgencyHomepage href={agencyHomepageUrl}>
            Visit our Website
          </AgencyHomepage>
        )}
      </AgencyDescription>
    </AgencyOverviewHeader>
  );

  if (metricsByAvailableCategoriesWithData.length === 0) {
    return (
      <>
        <HeaderBar />
        <AgencyOverviewWrapper>
          <AgencyHeader />
          <div>This dashboard is currently under construction.</div>
        </AgencyOverviewWrapper>
      </>
    );
  }

  return (
    <>
      <HeaderBar />
      <AgencyOverviewWrapper>
        <AgencyHeader />
        <MetricsViewContainer>
          <SystemChipsContainer>
            {agencyDataStore.agency?.systems.map((system) => (
              <SystemChip
                key={system}
                onClick={() => setCurrentSystem(system)}
                active={system === currentSystem}
              >
                {system.toLowerCase().replaceAll("_", " ")}
              </SystemChip>
            ))}
          </SystemChipsContainer>
          {Object.keys(orderedCategoriesMap).map((category) => {
            const isCapacityAndCostCategory = category === "Capacity and Costs";
            const metricsByCategory =
              agencyDataStore.metricsByCategory[category] || [];
            const metricsByCategoryBySystem = metricsByCategory.filter(
              (metric) => metric.system.key === currentSystem
            );
            const metricsWithData = metricsByCategoryBySystem.filter(
              (metric) =>
                agencyDataStore.datapointsByMetric[metric.key].aggregate.filter(
                  (dp) => dp[DataVizAggregateName] !== null
                ).length > 0
            );

            if (metricsWithData.length === 0) return null;

            return (
              <CategorizedMetricsContainer key={category}>
                <CategoryTitle
                  onClick={() => {
                    if (isCapacityAndCostCategory) {
                      const categoryUrlParam = category
                        .toLowerCase()
                        .replaceAll(" ", "-");
                      navigate(`/agency/${slug}/${categoryUrlParam}`);
                    }
                  }}
                  hasHover={isCapacityAndCostCategory}
                >
                  {`${orderedCategoriesMap[category].label}${
                    isCapacityAndCostCategory ? " ->" : ""
                  }`}
                </CategoryTitle>
                <CategoryDescription>
                  {orderedCategoriesMap[category].description}
                </CategoryDescription>
                <MetricsContainer
                  onClick={() => {
                    if (isCapacityAndCostCategory) {
                      const categoryUrlParam = category
                        .toLowerCase()
                        .replaceAll(" ", "-");
                      navigate(`/agency/${slug}/${categoryUrlParam}`);
                    }
                  }}
                  hasHover={isCapacityAndCostCategory}
                >
                  {metricsWithData.map((metric) => {
                    const data =
                      agencyDataStore.datapointsByMetric[metric.key].aggregate;
                    const isAnnual = metric.custom_frequency === "ANNUAL";
                    const transformedDataForChart = transformDataForBarChart(
                      data,
                      isAnnual
                        ? DataVizTimeRangesMap["5 Years Ago"]
                        : DataVizTimeRangesMap["1 Year Ago"],
                      "Count"
                    );
                    const firstDatapointDate = new Date(
                      transformedDataForChart[0].start_date
                    );
                    const lastDatapointDate = new Date(
                      transformedDataForChart[
                        transformedDataForChart.length - 1
                      ].start_date
                    );

                    return (
                      <MetricBox key={metric.key}>
                        <MetricBoxTitle>
                          {metric.display_name.toUpperCase()}
                        </MetricBoxTitle>
                        <MetricBoxContentContainer>
                          <MetricBoxGraphContainer>
                            <MiniChartContainer>
                              <MiniBarChart
                                data={transformedDataForChart}
                                dimensionNames={[DataVizAggregateName]}
                              />
                            </MiniChartContainer>
                            <MetricBoxGraphRange>
                              <span>
                                {isAnnual
                                  ? firstDatapointDate.getUTCFullYear()
                                  : printDateAsShortMonthYear(
                                      firstDatapointDate.getMonth() + 1,
                                      firstDatapointDate.getUTCFullYear()
                                    )}
                              </span>
                              <span>
                                {isAnnual
                                  ? lastDatapointDate.getUTCFullYear()
                                  : printDateAsShortMonthYear(
                                      lastDatapointDate.getMonth() + 1,
                                      lastDatapointDate.getUTCFullYear()
                                    )}
                              </span>
                            </MetricBoxGraphRange>
                          </MetricBoxGraphContainer>
                        </MetricBoxContentContainer>
                      </MetricBox>
                    );
                  })}
                </MetricsContainer>
              </CategorizedMetricsContainer>
            );
          })}
        </MetricsViewContainer>
      </AgencyOverviewWrapper>
      <Footer />
    </>
  );
});
