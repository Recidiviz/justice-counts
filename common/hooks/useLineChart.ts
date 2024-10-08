// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2024 Recidiviz, Inc.
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

import { groupBy } from "../utils";

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
/** TODO(#978) Refactor to handle multiple breakdowns */
export const useLineChart = ({
  datapointsByMetric,
  dimensionNamesByMetricAndDisaggregation,
}: LineChartHookProps): LineChartProps => {
  const getLineChartDataFromMetric = (metric: Metric) => {
    const disaggregationsByDisplayName = groupBy(
      metric.disaggregations,
      (disaggregation) => disaggregation.display_name
    );

    if (datapointsByMetric) {
      /**
       * Gets the first set of disaggregated datapoints (if atleast one dimension is enabled).
       * NOTE: This assumes there's just one breakdown per metric. We will need to adjust this
       *       based on how we want to handle displaying metrics w/ multiple breakdowns.
       */
      const { disaggregations } = datapointsByMetric[metric.key];
      /**
       * Get start dates of aggregate datapoints that have a `null` value for the `Total` property
       * so we can filter those datapoints out of the disaggregations to match the date ranges
       * rendered in the bar charts.
       */
      const startDatesOfNullTotalAggregateDatapoints = datapointsByMetric[
        metric.key
      ].aggregate
        .filter((dp) => dp.Total === null)
        .map((dp) => dp.start_date);
      const disaggregationDisplayName = Object.keys(disaggregations)[0];
      const disaggregationWithDimensionValues = disaggregations[
        disaggregationDisplayName
      ]
        ? Object.values(disaggregations[disaggregationDisplayName]).filter(
            (dp) =>
              !startDatesOfNullTotalAggregateDatapoints.includes(dp.start_date)
          )
        : [];
      const hasAllDisabledDimensions =
        disaggregationsByDisplayName[
          disaggregationDisplayName
        ]?.[0].dimensions.find((dim) => dim.enabled) === undefined;

      return !hasAllDisabledDimensions &&
        disaggregations[disaggregationDisplayName]
        ? disaggregationWithDimensionValues
        : [];
    }
    return [];
  };

  const getLineChartDimensionsFromMetric = (metric: Metric) => {
    if (dimensionNamesByMetricAndDisaggregation) {
      /**
       * Gets an array of dimension keys (filtering out disabled dimensions).
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
