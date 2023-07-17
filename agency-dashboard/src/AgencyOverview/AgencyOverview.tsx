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
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Footer } from "../Footer";
import { HeaderBar } from "../Header";
import { useMaxMetricBoxesInRow } from "../hooks";
import { Loading } from "../Loading";
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
  NoDataText,
  SectorChip,
  SectorChipsContainer,
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

// include here sectors that you want users to be able to choose
const availableSectors: AgencySystems[] = ["PRISONS"];

export const AgencyOverview = observer(() => {
  const navigate = useNavigate();
  const params = useParams();
  const agencyId = Number(params.id);
  const { agencyDataStore } = useStore();
  const maxMetricsInRow = useMaxMetricBoxesInRow();
  const [currentSector, setCurrentSector] = useState<AgencySystems>(
    availableSectors[0]
  );

  const agencyDescription =
    agencyDataStore.agencySettingsBySettingType.PURPOSE_AND_FUNCTIONS?.value;
  const agencyHomepageUrl =
    agencyDataStore.agencySettingsBySettingType.HOMEPAGE_URL?.value;

  const handleNavigate = (isPublished: boolean, metricKey: string) => {
    if (isPublished) {
      navigate(
        `/agency/${agencyId}/dashboard?metric=${metricKey.toLocaleLowerCase()}`
      );
    }
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

  const isAgencyIncludesAvailableSectors =
    agencyDataStore.agency?.systems?.some((system) =>
      availableSectors.includes(system)
    );

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
        {isAgencyIncludesAvailableSectors ? (
          <MetricsViewContainer>
            <SectorChipsContainer>
              {availableSectors.map((sector) => (
                <SectorChip
                  key={sector}
                  onClick={() => setCurrentSector(sector)}
                  active={sector === currentSector}
                >
                  {sector.toLowerCase().replaceAll("_", " ")}
                </SectorChip>
              ))}
            </SectorChipsContainer>
            {Object.keys(orderedCategoriesMap).map((category) => {
              const metricsByCategory =
                agencyDataStore.metricsByCategory[category];
              if (!metricsByCategory) return null;
              const metricsByCategoryBySector = metricsByCategory.filter(
                (metric) => metric.system.key === currentSector
              );
              const metricsWithData = metricsByCategoryBySector.filter(
                (metric) =>
                  agencyDataStore.datapointsByMetric[
                    metric.key
                  ].aggregate.filter((dp) => dp[DataVizAggregateName] !== null)
                    .length > 0
              );
              return (
                metricsWithData.length > 0 && (
                  <CategorizedMetricsContainer key={category}>
                    <CategoryTitle>
                      {`${orderedCategoriesMap[category].label} ->`}
                    </CategoryTitle>
                    <CategoryDescription>
                      {orderedCategoriesMap[category].description}
                    </CategoryDescription>
                    <MetricsContainer
                      maxMetricsInRow={
                        maxMetricsInRow >= 4 ||
                        maxMetricsInRow > metricsWithData.length
                          ? metricsWithData.length
                          : maxMetricsInRow
                      }
                    >
                      {metricsWithData.map((metric) => {
                        const data =
                          agencyDataStore.datapointsByMetric[metric.key]
                            .aggregate;
                        const isAnnual = metric.custom_frequency === "ANNUAL";
                        const lastDatapointDate = new Date(
                          data[data.length - 1].start_date
                        );

                        return (
                          <MetricBox
                            key={metric.key}
                            onClick={() => handleNavigate(true, metric.key)}
                          >
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
                )
              );
            })}
          </MetricsViewContainer>
        ) : (
          <NoDataText>Data for this agency is not available</NoDataText>
        )}
      </AgencyOverviewWrapper>
      <Footer />
    </>
  );
});
