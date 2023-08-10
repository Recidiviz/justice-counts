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
import { showToast } from "@justice-counts/common/components/Toast";
import { useBarChart, useLineChart } from "@justice-counts/common/hooks";
import {
  DataVizAggregateName,
  DataVizTimeRangesMap,
  Metric,
} from "@justice-counts/common/types";
import { each } from "bluebird";
import { observer } from "mobx-react-lite";
import React, { useCallback, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCurrentPng } from "recharts-to-png";
import useAsyncEffect from "use-async-effect";

import { Footer } from "../Footer";
import { HeaderBar } from "../Header";
import { Loading } from "../Loading";
import { useStore } from "../stores";
import { downloadFeedData } from "../utils/downloadHelpers";
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
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  const getCurrentChartTimeRange = useCallback(
    (isAnnual: boolean) => {
      if (dataRangeFilter === "recent") {
        return isAnnual
          ? DataVizTimeRangesMap["5 Years Ago"]
          : DataVizTimeRangesMap["1 Year Ago"];
      }
      return DataVizTimeRangesMap.All;
    },
    [dataRangeFilter]
  );

  const { getLineChartData, getLineChartDimensions } = useLineChart({
    getCurrentChartTimeRange,
    datapointsByMetric: agencyDataStore.datapointsByMetric,
    dimensionNamesByMetricAndDisaggregation:
      agencyDataStore.dimensionNamesByMetricAndDisaggregation,
    dataRangeFilter,
  });

  const { getBarChartData } = useBarChart({
    getCurrentChartTimeRange,
    datapointsByMetric: agencyDataStore.datapointsByMetric,
  });

  const categoryMetrics = useMemo(
    () => agencyDataStore.metricsByCategory?.[categoryData[category].key],
    [agencyDataStore.metricsByCategory, category]
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

  useAsyncEffect(async () => {
    try {
      await agencyDataStore.fetchAgencyData(slug);
    } catch {
      showToast({
        message: "Error fetching data.",
        color: "red",
        timeout: 4000,
      });
    }
  }, []);

  const downloadMetricsData = useCallback(() => {
    categoryMetrics?.forEach((categoryMetric: Metric) => {
      const metric = agencyDataStore.metricsByKey?.[categoryMetric.key];
      if (metric && agencyDataStore.agency) {
        each(
          metric.filenames,
          downloadFeedData(metric.system.key, agencyDataStore.agency.id)
        );
      }
    });
  }, [categoryMetrics, agencyDataStore.metricsByKey, agencyDataStore.agency]);

  if (agencyDataStore.loading) {
    return <Loading />;
  }
  return categoryMetrics ? (
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
              {categoryMetrics.map((metric: Metric) => (
                <Styled.MetricBox key={metric.key}>
                  <Styled.MetricName>{metric.display_name}</Styled.MetricName>
                  <Styled.MetricDescription>
                    {metric.description}
                  </Styled.MetricDescription>
                  <Styled.MetricDataVizContainer>
                    <MetricsCategoryBarChart
                      width={620}
                      data={getBarChartData(metric)}
                      onHoverBar={(payload) => {
                        setHoveredDate(payload.start_date);
                      }}
                      dimensionNames={[DataVizAggregateName]}
                      metric={metric.display_name}
                      ref={ref}
                    />
                    <CategoryOverviewLineChart
                      data={getLineChartData(metric)}
                      dimensions={getLineChartDimensions(metric)}
                      hoveredDate={hoveredDate}
                      setHoveredDate={setHoveredDate}
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
  ) : null;
});
