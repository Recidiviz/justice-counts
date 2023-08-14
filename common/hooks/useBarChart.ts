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
  Datapoint,
  DatapointsByMetric,
  DataVizTimeRange,
  Metric,
  UserAgency,
} from "@justice-counts/common/types";
import { useCallback } from "react";

import { transformDataForBarChart } from "../components/DataViz/utils";

export type BarChartProps = {
  getBarChartData: (metric: Metric) => Datapoint[];
};

export type BarChartHookProps = Partial<UserAgency> & {
  getCurrentChartTimeRange: (isAnnual: boolean) => DataVizTimeRange;
  datapointsByMetric: DatapointsByMetric | undefined;
  disaggregations: string[];
};

export const useBarChart = ({
  getCurrentChartTimeRange,
  datapointsByMetric,
  disaggregations,
}: BarChartHookProps): BarChartProps => {
  const getBarChartData = useCallback(
    (metric: Metric) => {
      if (datapointsByMetric) {
        return transformDataForBarChart(
          datapointsByMetric[metric.key].aggregate as Datapoint[],
          getCurrentChartTimeRange(metric.custom_frequency === "ANNUAL"),
          "Count"
        );
      }
      return [];
    },
    [getCurrentChartTimeRange, datapointsByMetric]
  );

  return {
    getBarChartData,
  };
};
