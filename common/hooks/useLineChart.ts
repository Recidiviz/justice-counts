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
  DimensionNamesByMetricAndDisaggregation,
  Metric,
  UserAgency,
} from "@justice-counts/common/types";

export type LineChartProps = {
  getLineChartDimensionsFromMetric: (metric: Metric) => string[];
  getLineChartDataFromMetric: (metric: Metric) => Datapoint[];
};

export type LineChartHookProps = Partial<UserAgency> & {
  datapointsByMetric: DatapointsByMetric | undefined;
  dimensionNamesByMetricAndDisaggregation:
    | DimensionNamesByMetricAndDisaggregation
    | undefined;
};

/** Returns methods used to convert data into a structure line charts can consume */
export const useLineChart = ({
  datapointsByMetric,
  dimensionNamesByMetricAndDisaggregation,
}: LineChartHookProps): LineChartProps => {
  const getLineChartDataFromMetric = (metric: Metric) => {
    if (datapointsByMetric) {
      /**
       * Gets the first set of disaggregated datapoints.
       * NOTE: This assumes there's just one breakdown per metric. We will need to adjust this
       *       based on how we want to handle displaying metrics w/ multiple breakdowns.
       */
      const { disaggregations } = datapointsByMetric[metric.key];
      const disaggregationKey = Object.keys(disaggregations)[0];
      return disaggregations[disaggregationKey]
        ? Object.values(disaggregations[disaggregationKey])
        : [];
    }
    return [];
  };

  const getLineChartDimensionsFromMetric = (metric: Metric) => {
    if (dimensionNamesByMetricAndDisaggregation) {
      /**
       * Gets an array of dimension keys.
       * NOTE: This assumes there's just one breakdown per metric. We will need to adjust this
       *       based on how we want to handle displaying metrics w/ multiple breakdowns.
       */
      return Object.values(
        dimensionNamesByMetricAndDisaggregation[metric.key]
      )[0];
    }
    return [];
  };

  return {
    getLineChartDimensionsFromMetric,
    getLineChartDataFromMetric,
  };
};
