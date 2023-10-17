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
import {
  AgencySystems,
  DataVizAggregateName,
} from "@justice-counts/common/types";
import { removeSnakeCase } from "@justice-counts/common/utils";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { VisibleCategoriesMetadata } from "../CategoryOverview/types";
import { HeaderBar } from "../Header";
import { Loading } from "../Loading";
import { useStore } from "../stores";
import { slugify } from "../utils";
import {
  AgencyDescription,
  AgencyHomepage,
  AgencyOverviewHeader,
  AgencyOverviewWrapper,
  AgencyTitle,
  CategorizedMetricsContainer,
  CategoryDescription,
  CategoryTitle,
  DemoLabel,
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

/** "Visible Categories" are the categories of metrics we are allowing users to view */
export const agencyOverviewVisibleCategoriesMetadata: VisibleCategoriesMetadata =
  {
    "Capacity and Costs": {
      label: "Understand the Finances",
      description: "See how we’re funded and where we use those funds",
    },
  };

export const AgencyOverview = observer(() => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { agencyDataStore } = useStore();
  const {
    agencyName,
    agencyDescription,
    agencyHomepageUrl,
    agencySystemsWithData,
    getMetricsWithDataByCategoryByCurrentSystem,
    getMetricsByAvailableCategoriesWithData,
    getMiniChartDateRangeAndTransformedData,
  } = agencyDataStore;
  const metricsByAvailableCategoriesWithData =
    getMetricsByAvailableCategoriesWithData(
      agencyOverviewVisibleCategoriesMetadata
    );

  const availableSystems = agencySystemsWithData(
    agencyOverviewVisibleCategoriesMetadata
  );

  const [currentSystem, setCurrentSystem] = useState<AgencySystems | undefined>(
    availableSystems[0]
  );

  const handleCategoryClick = (
    isClickable: boolean,
    category: string,
    currSystem: string | undefined
  ) => {
    if (isClickable) {
      navigate(`/agency/${slug}/${slugify(category)}`, {
        state: { currentSystem: currSystem },
      });
    }
  };

  if (agencyDataStore.loading) return <Loading />;

  return (
    <>
      <HeaderBar />
      <AgencyOverviewWrapper>
        <AgencyOverviewHeader>
          <AgencyTitle>{agencyName}</AgencyTitle>
          <AgencyDescription>
            {agencyDescription}{" "}
            {agencyHomepageUrl && (
              <AgencyHomepage href={agencyHomepageUrl}>
                Visit our Website
              </AgencyHomepage>
            )}
          </AgencyDescription>
          <DemoLabel>Demo</DemoLabel>
        </AgencyOverviewHeader>

        {metricsByAvailableCategoriesWithData.length === 0 ? (
          <div>This dashboard is currently under construction.</div>
        ) : (
          <MetricsViewContainer>
            {/* System Selector Chips */}
            <SystemChipsContainer>
              {availableSystems.map((system) => {
                return (
                  <SystemChip
                    key={system}
                    onClick={() => setCurrentSystem(system)}
                    active={system === currentSystem}
                  >
                    {removeSnakeCase(system).toLocaleLowerCase()}
                  </SystemChip>
                );
              })}
            </SystemChipsContainer>

            {/* Metric Categories (with data only) */}
            {Object.keys(agencyOverviewVisibleCategoriesMetadata).map(
              (category) => {
                const metricsWithData =
                  getMetricsWithDataByCategoryByCurrentSystem(
                    category,
                    currentSystem
                  );
                if (metricsWithData.length === 0) return null;
                const isCapacityAndCostCategory =
                  category === "Capacity and Costs";

                return (
                  <CategorizedMetricsContainer key={category}>
                    <CategoryTitle
                      onClick={() =>
                        handleCategoryClick(
                          isCapacityAndCostCategory,
                          category,
                          currentSystem
                        )
                      }
                      hasHover={isCapacityAndCostCategory}
                    >
                      {`${
                        agencyOverviewVisibleCategoriesMetadata[category].label
                      }${isCapacityAndCostCategory ? " ->" : ""}`}
                    </CategoryTitle>
                    <CategoryDescription>
                      {
                        agencyOverviewVisibleCategoriesMetadata[category]
                          .description
                      }
                    </CategoryDescription>

                    {/* Metrics Row (w/ mini charts) */}
                    <MetricsContainer
                      onClick={() =>
                        handleCategoryClick(
                          isCapacityAndCostCategory,
                          category,
                          currentSystem
                        )
                      }
                      hasHover={isCapacityAndCostCategory}
                    >
                      {metricsWithData.map((metric) => {
                        const { beginDate, endDate, transformedDataForChart } =
                          getMiniChartDateRangeAndTransformedData(metric);
                        const metricDisplayName = metric.display_name
                          .toUpperCase()
                          .split("(")[0] // Removes system name parenthesis from display name (e.g. "Staff With Caseloads (Supervision)" becomes "Staff With Caseloads")
                          .trim();
                        return (
                          <MetricBox key={metric.key}>
                            <MetricBoxTitle>{metricDisplayName}</MetricBoxTitle>
                            <MetricBoxContentContainer>
                              <MetricBoxGraphContainer>
                                <MiniChartContainer>
                                  <MiniBarChart
                                    data={transformedDataForChart}
                                    dimensionNames={[DataVizAggregateName]}
                                  />
                                </MiniChartContainer>
                                <MetricBoxGraphRange>
                                  <span>{beginDate}</span>
                                  <span>{endDate}</span>
                                </MetricBoxGraphRange>
                              </MetricBoxGraphContainer>
                            </MetricBoxContentContainer>
                          </MetricBox>
                        );
                      })}
                    </MetricsContainer>
                  </CategorizedMetricsContainer>
                );
              }
            )}
          </MetricsViewContainer>
        )}
      </AgencyOverviewWrapper>
    </>
  );
});
