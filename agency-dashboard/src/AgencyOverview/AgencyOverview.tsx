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
import { showToast } from "@justice-counts/common/components/Toast";
import {
  AgencySystems,
  DataVizAggregateName,
  DataVizTimeRangesMap,
} from "@justice-counts/common/types";
import { printDateAsShortMonthYear } from "@justice-counts/common/utils";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAsyncEffect from "use-async-effect";

import { Footer } from "../Footer";
import { HeaderBar } from "../Header";
import { Loading } from "../Loading";
import { NotFoundComponent } from "../NotFound";
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

const orderedCategoriesMap: {
  [category: string]: { label: string; description: string };
} = {
  "Capacity and Cost": {
    label: "Understand the Finances",
    description: "See how we’re funded and where we use those funds",
  },
  Populations: {
    label: "Track Population Movements",
    description: "Observe how people move in and out of our system",
  },
};

// include here systems that you want users to be able to choose
const availableSystems: AgencySystems[] = ["PRISONS"];

export const AgencyOverview = observer(() => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { agencyDataStore } = useStore();
  const [currentSystem, setCurrentSystem] = useState<AgencySystems>(
    availableSystems[0]
  );
  const agencyDescription =
    agencyDataStore.agencySettingsBySettingType.PURPOSE_AND_FUNCTIONS?.value;
  const agencyHomepageUrl =
    agencyDataStore.agencySettingsBySettingType.HOMEPAGE_URL?.value;

  useAsyncEffect(async () => {
    try {
      await agencyDataStore.fetchAgencyData(slug as string);
    } catch (error) {
      showToast({
        message: "Error fetching data.",
        color: "red",
        timeout: 4000,
      });
    }
  }, []);

  const agencyHasAvailableSystems = agencyDataStore.agency?.systems?.some(
    (system) => availableSystems.includes(system)
  );
  const metricsByAvailableCategoriesAndSystems = agencyDataStore.metrics.filter(
    (metric) =>
      Object.keys(orderedCategoriesMap).includes(metric.category) &&
      availableSystems.includes(metric.system.key)
  );
  const metricsByAvailableCategoriesAndSystemsWithData =
    metricsByAvailableCategoriesAndSystems.filter(
      (metric) =>
        agencyDataStore.datapointsByMetric[metric.key].aggregate.filter(
          (dp) => dp[DataVizAggregateName] !== null
        ).length > 0
    );
  const agencyHasNoAvailableSystemsOrHasNoData =
    !agencyHasAvailableSystems ||
    metricsByAvailableCategoriesAndSystemsWithData.length === 0;

  if (agencyDataStore.loading) return <Loading />;

  if (agencyHasNoAvailableSystemsOrHasNoData && !agencyDataStore.loading)
    return <NotFoundComponent />;

  return (
    <>
      <HeaderBar />
      <AgencyOverviewWrapper>
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
        <MetricsViewContainer>
          <SystemChipsContainer>
            {availableSystems.map((system) => (
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
            const metricsByCategory =
              agencyDataStore.metricsByCategory[category];
            if (!metricsByCategory) return null;
            const metricsByCategoryBySystem = metricsByCategory.filter(
              (metric) => metric.system.key === currentSystem
            );
            const metricsWithData = metricsByCategoryBySystem.filter(
              (metric) =>
                agencyDataStore.datapointsByMetric[metric.key].aggregate.filter(
                  (dp) => dp[DataVizAggregateName] !== null
                ).length > 0
            );
            const isCapacityAndCostCategory = category === "Capacity and Cost";

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
                    const lastDatapointDate = new Date(
                      data[data.length - 1].start_date
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
                                data={transformDataForBarChart(
                                  data,
                                  isAnnual
                                    ? DataVizTimeRangesMap["5 Years Ago"]
                                    : DataVizTimeRangesMap["1 Year Ago"],
                                  "Count"
                                )}
                                dimensionNames={[DataVizAggregateName]}
                              />
                            </MiniChartContainer>
                            <MetricBoxGraphRange>
                              <span>
                                {isAnnual
                                  ? lastDatapointDate.getFullYear() - 5
                                  : printDateAsShortMonthYear(
                                      lastDatapointDate.getMonth() + 1,
                                      lastDatapointDate.getFullYear() - 1
                                    )}
                              </span>
                              <span>
                                {isAnnual
                                  ? lastDatapointDate.getFullYear()
                                  : printDateAsShortMonthYear(
                                      lastDatapointDate.getMonth() + 1,
                                      lastDatapointDate.getFullYear()
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
