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
  Metric,
} from "@justice-counts/common/types";
import { useCallback } from "react";
import { transformDataForBarChart } from "../components/DataViz/utils";
import { Datapoint, UserAgency } from "../types";

export type BarChartProps = {
  getBarChartData: (metric: Metric) => Datapoint[];
};

export type BarChartHookProps = Partial<UserAgency> & {
  filterDatapoints: (datapoints: Datapoint[]) => Datapoint[];
  datapointsByMetric: DatapointsByMetric | undefined;
};

export const useBarChart = ({
  filterDatapoints,
  datapointsByMetric,
}: BarChartHookProps): BarChartProps => {
  const getBarChartData = useCallback(
    (metric: Metric) => {
      if (datapointsByMetric) {
        return filterDatapoints(
          transformDataForBarChart(
            datapointsByMetric[metric.key].aggregate,
            DataVizTimeRangesMap.All,
            "Count"
          )
        );
      } else return [];
    },
    [filterDatapoints, datapointsByMetric]
  );

  return {
    getBarChartData,
  };
};
