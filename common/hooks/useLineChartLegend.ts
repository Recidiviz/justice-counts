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

import { LegendData } from "../components/DataViz/types";
import { Datapoint, Metric } from "../types";
import { groupBy } from "../utils";

export const useLineChartLegend = (
  datapoints: Datapoint[],
  dimensions: string[],
  hoveredDate: string | null,
  metric: Metric,
  dimensionsToColorMap: Record<string, string>
) => {
  /** For now, only groups dimensions by label for the first disaggregation. We'll have to adjust this to handle multiple disaggregations. */
  const dimensionsByLabel = groupBy(
    metric.disaggregations[0].dimensions,
    (dim) => dim.label
  );

  const transformDataForLegend = (datapoint: Datapoint): LegendData => {
    const dimensionsValueFillEnabled = dimensions.reduce((acc, dim) => {
      if (datapoint) {
        acc[dim] = {
          value: datapoint[dim],
          fill: dimensionsToColorMap[dim],
          enabled: dimensionsByLabel[dim][0].enabled,
        };
      }
      return acc;
    }, {} as LegendData);

    return { ...datapoint, ...dimensionsValueFillEnabled } as LegendData;
  };

  const getLastDatapoint = (dps: Datapoint[]): Datapoint => dps[dps.length - 1];

  const getHoveredDatapoint = (dps: Datapoint[]): Datapoint =>
    dps.filter((dp) => dp.start_date === hoveredDate)[0];

  const legendData = transformDataForLegend(
    hoveredDate ? getHoveredDatapoint(datapoints) : getLastDatapoint(datapoints)
  );

  /**
   * For each record, calculate the highest value across all dimensions to be used as the
   * upper limit in the chart Y axis.
   */
  const maxDimensionsValuesPerRecord = datapoints.map((dp) => {
    const {
      start_date: startDate,
      end_date: endDate,
      frequency,
      dataVizMissingData,
      ...dimensionVals
    } = dp;
    const dimensionValsFlattened = Object.values(
      dimensionVals
    ).flat() as number[];
    return Math.max(...dimensionValsFlattened);
  });

  const referenceLineUpperLimit = Math.max(...maxDimensionsValuesPerRecord);

  return { legendData, referenceLineUpperLimit };
};
