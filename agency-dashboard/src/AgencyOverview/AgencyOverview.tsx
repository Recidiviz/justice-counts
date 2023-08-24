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

import { Footer } from "../Footer";
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
export type VisibleCategoriesMetadata = {
  [category: string]: { label: string; description: string };
};

const visibleCategoriesMetadata: VisibleCategoriesMetadata = {
  "Capacity and Costs": {
    label: "Understand the Finances",
    description: "See how we’re funded and where we use those funds",
  },
};

const AgencyHeader = ({
  description,
  url,
  name,
}: {
  description: string;
  url: string;
  name?: string;
}) => (
  <AgencyOverviewHeader>
    {name && <AgencyTitle>{name}</AgencyTitle>}
    <AgencyDescription>
      {description}{" "}
      {url && <AgencyHomepage href={url}>Visit our Website</AgencyHomepage>}
    </AgencyDescription>
  </AgencyOverviewHeader>
);

export const AgencyOverview = observer(() => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { agencyDataStore } = useStore();
  const {
    agencyDescription,
    agencyHomepageUrl,
    agencySystems,
    getMetricsWithDataByCategoryByCurrentSystem,
    getMetricsByAvailableCategoriesWithData,
    getMiniChartDateRangeAndTransformedData,
  } = agencyDataStore;
  const metricsByAvailableCategoriesWithData =
    getMetricsByAvailableCategoriesWithData(visibleCategoriesMetadata);

  const [currentSystem, setCurrentSystem] = useState<AgencySystems | undefined>(
    agencySystems?.[0]
  );

  const handleCategoryClick = (isClickable: boolean, category: string) => {
    if (isClickable) {
      navigate(`/agency/${slug}/${slugify(category)}`);
    }
  };

  if (agencyDataStore.loading) return <Loading />;

  return (
    <>
      <HeaderBar />
      <AgencyOverviewWrapper>
        <AgencyHeader
          name={agencyDataStore.agency?.name}
          description={agencyDescription}
          url={agencyHomepageUrl}
        />

        {metricsByAvailableCategoriesWithData.length === 0 ? (
          <div>This dashboard is currently under construction.</div>
        ) : (
          <MetricsViewContainer>
            {/* System Selector Chips */}
            <SystemChipsContainer>
              {agencySystems?.map((system) => (
                <SystemChip
                  key={system}
                  onClick={() => setCurrentSystem(system)}
                  active={system === currentSystem}
                >
                  {removeSnakeCase(system).toLocaleLowerCase()}
                </SystemChip>
              ))}
            </SystemChipsContainer>

            {/* Metric Categories (with data) */}
            {Object.keys(visibleCategoriesMetadata).map((category) => {
              const metrics = getMetricsWithDataByCategoryByCurrentSystem(
                category,
                currentSystem
              );
              if (metrics.length === 0) return null;
              const isCapacityAndCostCategory =
                category === "Capacity and Costs";

              return (
                <CategorizedMetricsContainer key={category}>
                  <CategoryTitle
                    onClick={() =>
                      handleCategoryClick(isCapacityAndCostCategory, category)
                    }
                    hasHover={isCapacityAndCostCategory}
                  >
                    {`${visibleCategoriesMetadata[category].label}${
                      isCapacityAndCostCategory ? " ->" : ""
                    }`}
                  </CategoryTitle>
                  <CategoryDescription>
                    {visibleCategoriesMetadata[category].description}
                  </CategoryDescription>

                  {/* Metrics Row */}
                  <MetricsContainer
                    onClick={() =>
                      handleCategoryClick(isCapacityAndCostCategory, category)
                    }
                    hasHover={isCapacityAndCostCategory}
                  >
                    {metrics.map((metric) => {
                      const { beginDate, endDate, transformedDataForChart } =
                        getMiniChartDateRangeAndTransformedData(metric);
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
            })}
          </MetricsViewContainer>
        )}
      </AgencyOverviewWrapper>
      <Footer />
    </>
  );
});
