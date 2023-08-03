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
import MetricsCategoryBarChart from "@justice-counts/common/components/DataViz/MetricsCategoryBarChart";
import { transformDataForBarChart } from "@justice-counts/common/components/DataViz/utils";
import { showToast } from "@justice-counts/common/components/Toast";
import {
  Datapoint,
  DataVizAggregateName,
  DataVizTimeRangesMap,
  Metric,
} from "@justice-counts/common/types";
import { each } from "bluebird";
import { observer } from "mobx-react-lite";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCurrentPng } from "recharts-to-png";

import { ResponsiveBarData } from "@justice-counts/common/components/DataViz/types";
import { Footer } from "../Footer";
import { HeaderBar } from "../Header";
import { Loading } from "../Loading";
import { useStore } from "../stores";
import { downloadFeedData } from "../utils/downloadHelpers";
import { getDatapointYear } from "../utils/formatting";
import * as Styled from "./CategoryOverview.styled";
import { CategoryData } from "./types";

const categoryData: CategoryData = {
  "capacity-and-costs": {
    key: "Capacity and Costs",
    label: "Capacity and Costs",
    description:
      "The number of full-time equivalent (FTE) positions budgeted and paid for by the agency for the operation and maintenance of the jail facilities and the care of people who are incarcerated under the jurisdiction of the agency.",
  },
};

export const CategoryOverview = observer(() => {
  const { slug, category } = useParams() as {
    slug: string;
    category: string;
  };
  const navigate = useNavigate();
  const [, { ref }] = useCurrentPng({
    scale: 10,
  });
  const { agencyDataStore } = useStore();
  const [dataRangeFilter, setDataRangeFilter] = useState<"recent" | "all">(
    "recent"
  );
  const [lineChartData, setLineChartData] = useState<Datapoint[]>([]);

  const categoryMetrics =
    agencyDataStore.metricsByCategory[categoryData[category].key];
  const [selectedMetricKey, setSelectedMetricKey] = useState<string>();
  const [selectedYear, setSelectedYear] = useState<string>();

  const filterDatapoints = useCallback(
    (datapoints: Datapoint[]) => {
      return dataRangeFilter === "recent" ? datapoints.slice(-5) : datapoints;
    },
    [dataRangeFilter]
  );

  const copyUrlToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast({
        message: "Link copied",
        color: "blue",
      });
    } catch {
      showToast({
        message: "Error copying link",
        color: "blue",
      });
    }
  };

  // this will only download last chart since refs are the same, leave it like that for separate task for download button
  // TODO
  // const handleChartDownload = useCallback(async () => {
  //   const png = await getChartPng();
  //
  //   if (png) {
  //     FileSaver.saveAs(png, "data.png");
  //   }
  // }, [getChartPng]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (agencyDataStore.metrics.length === 0) {
          await agencyDataStore.fetchAgencyData(slug);
        }
      } catch {
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

  const getBarChartData = useCallback(
    (metric: Metric) => {
      return filterDatapoints(
        transformDataForBarChart(
          agencyDataStore.datapointsByMetric[metric.key].aggregate,
          DataVizTimeRangesMap.All,
          "Count"
        )
      );
    },
    [filterDatapoints, agencyDataStore.datapointsByMetric]
  );

  const getLineChartData = useCallback(
    (metricKey: string) => {
      return filterDatapoints(
        transformDataForBarChart(
          Object.values(
            agencyDataStore.datapointsByMetric[metricKey]?.disaggregations[
              Object.keys(
                agencyDataStore.datapointsByMetric[metricKey]?.disaggregations
              )[0]
            ]
          ),
          DataVizTimeRangesMap.All,
          "Count"
        )
      );
    },
    [filterDatapoints, agencyDataStore.datapointsByMetric]
  );

  useEffect(() => {
    console.log(selectedYear, selectedMetricKey);
    if (selectedYear && selectedMetricKey)
      setLineChartData(
        getLineChartData(selectedMetricKey).filter(
          (datapoint) => getDatapointYear(datapoint) === selectedYear
        )
      );
  }, [selectedYear, selectedMetricKey]);

  if (agencyDataStore.loading) {
    return <Loading />;
  }

  const downloadMetricsData = () => {
    categoryMetrics.forEach((categoryMetric) => {
      const metric = agencyDataStore.metricsByKey[categoryMetric.key];
      if (metric && agencyDataStore.agency) {
        each(
          metric.filenames,
          downloadFeedData(metric.system.key, agencyDataStore.agency.id)
        );
      }
    });
  };

  return (
    <>
      <HeaderBar />
      <Styled.Wrapper>
        <Styled.Container>
          <Styled.TopBlock>
            <Button
              label="<- Home"
              onClick={() => navigate(-1)}
              labelColor="blue"
              noHover
              noSidePadding
            />
            <Styled.CategoryTitle>
              {categoryData[category].label}
            </Styled.CategoryTitle>
            <Styled.CategoryDescription>
              {categoryData[category].description}
            </Styled.CategoryDescription>
            <Styled.TopBlockControls>
              <Styled.TopBlockControl onClick={downloadMetricsData}>
                <DownloadIcon /> Download Data
              </Styled.TopBlockControl>
              <Styled.TopBlockControl onClick={copyUrlToClipboard}>
                <ShareIcon /> Share
              </Styled.TopBlockControl>
            </Styled.TopBlockControls>
          </Styled.TopBlock>
          <Styled.MetricsBlock>
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
            <Styled.MetricsWrapper>
              {categoryMetrics.map((metric) => (
                <Styled.MetricBox key={metric.key}>
                  <Styled.MetricName>{metric.display_name}</Styled.MetricName>
                  <Styled.MetricDescription>
                    {metric.description}
                  </Styled.MetricDescription>
                  <Styled.MetricDataVizContainer>
                    <MetricsCategoryBarChart
                      width={1059}
                      maxBarSize={193}
                      onHoverBar={(data: ResponsiveBarData) => {
                        console.log(data, getDatapointYear(data));
                        setSelectedMetricKey(metric.key);
                        setSelectedYear(getDatapointYear(data));
                      }}
                      data={getBarChartData(metric)}
                      dimensionNames={[DataVizAggregateName]}
                      metric={metric.display_name}
                      ref={ref}
                    />
                    <CategoryOverviewLineChart
                      data={lineChartData}
                      dimensions={
                        Object.values(
                          agencyDataStore
                            .dimensionNamesByMetricAndDisaggregation[metric.key]
                        )[0]
                      }
                    />
                  </Styled.MetricDataVizContainer>
                </Styled.MetricBox>
              ))}
            </Styled.MetricsWrapper>
          </Styled.MetricsBlock>
        </Styled.Container>
      </Styled.Wrapper>
      <Footer />
    </>
  );
});
