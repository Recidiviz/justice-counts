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
import { palette } from "../components/GlobalStyles";
import { Datapoint } from "../types";

export const useLineChartLegend = (
  datapoints: Datapoint[],
  dimensions: string[],
  hoveredDate: string | null
) => {
  const transformDataForLegend = (datapoint: Datapoint): LegendData => {
    const dimensionsValueFill = dimensions.reduce((acc, dim, idx) => {
      acc[dim] = {
        value: datapoint[dim] as number,
        fill: Object.values(palette.dataViz)[idx],
      };
      return acc;
    }, {} as LegendData);

    return { ...datapoint, ...dimensionsValueFill } as LegendData;
  };

  const getLatestDatapoint = (datapoints: Datapoint[]): Datapoint =>
    datapoints[datapoints.length - 1];

  const getHoveredDatapoint = (datapoints: Datapoint[]): Datapoint =>
    datapoints.filter((dp) => dp.start_date === hoveredDate)[0];

  const legendData = transformDataForLegend(
    hoveredDate
      ? getHoveredDatapoint(datapoints)
      : getLatestDatapoint(datapoints)
  );

  const maxDimensionsValuesPerRecord = datapoints.map((dp) => {
    const {
      start_date,
      end_date,
      frequency,
      dataVizMissingData,
      ...dimensionVals
    } = dp;
    const dimensionValsFlattened = Object.values(
      dimensionVals
    ).flat() as number[];
    return Math.max(...dimensionValsFlattened);
  });

  const referenceLineHeight = Math.max(...maxDimensionsValuesPerRecord);

  return { legendData, referenceLineHeight };
};
