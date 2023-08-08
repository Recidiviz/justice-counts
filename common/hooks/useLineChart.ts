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

import {
  DataVizTimeRangesMap,
  DatapointsByMetric,
  DimensionNamesByMetricAndDisaggregation,
  Metric,
} from "@justice-counts/common/types";
import { head, keys, pipe, prop, values } from "ramda";
import { useCallback } from "react";
import { transformDataForBarChart } from "../components/DataViz/utils";
import { Datapoint, UserAgency } from "../types";

export type LineChartProps = {
  getLineChartDimensions: (metric: Metric) => string[];
  getLineChartData: (metric: Metric) => Datapoint[];
};

export type LineChartHookProps = Partial<UserAgency> & {
  filterDatapoints: (datapoints: Datapoint[]) => Datapoint[];
  datapointsByMetric: DatapointsByMetric | undefined;
  dimensionNamesByMetricAndDisaggregation:
    | DimensionNamesByMetricAndDisaggregation
    | undefined;
  dataRangeFilter: "recent" | "all";
};

export const useLineChart = ({
  filterDatapoints,
  datapointsByMetric,
  dimensionNamesByMetricAndDisaggregation,
  dataRangeFilter,
}: LineChartHookProps): LineChartProps => {
  const getLineChartData = useCallback(
    (metric: Metric) => {
      if (datapointsByMetric) {
        const disaggregationProp: string = pipe(
          keys,
          head
        )(datapointsByMetric[metric.key]?.disaggregations) as string;
        return filterDatapoints(
          transformDataForBarChart(
            pipe(
              prop(disaggregationProp) as (value: {
                [disaggregation: string]: { [start_date: string]: Datapoint };
              }) => object,
              values
            )(datapointsByMetric[metric.key]?.disaggregations) as Datapoint[],
            DataVizTimeRangesMap.All,
            "Count"
          )
        );
      } else return [];
    },
    [filterDatapoints, datapointsByMetric]
  );

  const getLineChartDimensions = useCallback(
    (metric: Metric) => {
      if (dimensionNamesByMetricAndDisaggregation) {
        return pipe(
          prop(metric.key) as (
            value: DimensionNamesByMetricAndDisaggregation
          ) => object,
          values,
          head
        )(dimensionNamesByMetricAndDisaggregation) as string[];
      } else return [];
    },
    [dimensionNamesByMetricAndDisaggregation]
  );

  return {
    getLineChartDimensions,
    getLineChartData,
  };
};
