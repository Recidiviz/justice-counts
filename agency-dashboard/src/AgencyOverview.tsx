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

import placeholderGraph from "@justice-counts/common/assets/graph-white.png";
import arrow from "@justice-counts/common/assets/left-arrow-icon.svg";
import { showToast } from "@justice-counts/common/components/Toast";
import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { DatapointsGroupedByAggregateAndDisaggregations } from "../../common/types";
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
  MetricBoxGraphImage,
  MetricBoxGraphLastUpdate,
  MetricBoxTitle,
  MetricsContainer,
  MetricsCount,
  MetricsViewContainer,
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

  const metricsCount = agencyDataStore.metrics.length;
  const availableMetricsCount = Object.values(
    agencyDataStore.datapointsByMetric
  ).filter((datapoints) => datapoints.aggregate.length > 0).length;

  const handleNavigate = (isPublished: boolean, metricKey: string) => {
    if (isPublished) {
      navigate(`/agency/${agencyId}/dashboard?metric=${metricKey}`);
    }
  };

  const getPublishCount = (
    datapoint: DatapointsGroupedByAggregateAndDisaggregations
  ): string => {
    if (!datapoint.aggregate.length) {
      return "No Data";
    }

    let result = "";

    const monthlyPublishes = datapoint.aggregate.filter(
      (aggregation) => aggregation.frequency === "MONTHLY"
    );
    const yearlyPublishes = datapoint.aggregate.filter(
      (aggregation) => aggregation.frequency === "ANNUAL"
    );

    if (monthlyPublishes.length > 0) {
      result = `${monthlyPublishes.length} ${
        monthlyPublishes.length > 1 ? "Months" : "Month"
      } `;
    }

    if (yearlyPublishes.length > 0) {
      result += `${yearlyPublishes.length} ${
        yearlyPublishes.length > 1 ? "Years" : "Year"
      }`;
    }

    return result;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await agencyDataStore.fetchAgencyData(agencyId);
      } catch (error) {
        showToast("Error fetching data.", false, "red", 4000);
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
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vel
          tempor nisi. Fusce efficitur dignissim augue vitae interdum. Fusce
          volutpat mi at imperdiet semper. Learn More
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
                      const isPublished =
                        agencyDataStore.datapointsByMetric[metric.key].aggregate
                          .length > 0;
                      const publishCount = getPublishCount(
                        agencyDataStore.datapointsByMetric[metric.key]
                      );
                      return (
                        <MetricBox
                          key={metric.key}
                          isPublished={isPublished}
                          onClick={() =>
                            handleNavigate(isPublished, metric.key)
                          }
                        >
                          <MetricBoxTitle isPublished={isPublished}>
                            {metric.display_name}
                          </MetricBoxTitle>
                          <MetricBoxContentContainer>
                            {isPublished && (
                              <MetricBoxGraphContainer>
                                <MetricBoxGraphImage
                                  src={placeholderGraph}
                                  alt=""
                                />
                                <MetricBoxGraphLastUpdate>
                                  {/* change it with actual data in future */}
                                  Last Updated: 01/01/2022
                                </MetricBoxGraphLastUpdate>
                              </MetricBoxGraphContainer>
                            )}
                            <MetricBoxFooter isPublished={isPublished}>
                              {publishCount}{" "}
                              {isPublished && <img src={arrow} alt="" />}
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
