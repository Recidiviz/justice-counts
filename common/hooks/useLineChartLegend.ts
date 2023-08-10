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
  filter,
  head,
  keys,
  map,
  mergeAll,
  pipe,
  reduce,
  reverse,
} from "ramda";
import { useEffect, useMemo, useState } from "react";

import { LegendData } from "../components/DataViz/types";
import { Datapoint } from "../types";

export const useLineChartLegend = (
  data: Datapoint[],
  dimensions: (keyof Datapoint)[],
  hoveredYear: string | null,
  colorDict: Record<string, string>
) => {
  const [legendData, setLegendData] = useState<LegendData>();

  useEffect(() => {
    const transformDataForLegend = (datapoint: Datapoint): LegendData =>
      pipe(
        keys,
        map((dimension: keyof Datapoint) => ({
          [dimension]: {
            value: datapoint[dimension],
            fill: colorDict[dimension],
          },
        })),
        mergeAll
      )(datapoint) as LegendData;

    const getLatestDatapoint = (datapoints: Datapoint[]): Datapoint =>
      pipe(
        reverse as (list: readonly Datapoint[]) => Datapoint[],
        filter<Datapoint>((datapoint: Datapoint): boolean => {
          let hasReportedAnyMetrics = false;
          dimensions.forEach((dimension: keyof Datapoint) => {
            if (typeof datapoint[dimension] === "number")
              hasReportedAnyMetrics = true;
          });
          return hasReportedAnyMetrics;
        }) as (pred: Datapoint[]) => Datapoint[],
        head
      )(datapoints) as Datapoint;

    setLegendData(pipe(getLatestDatapoint, transformDataForLegend)(data));
  }, [data, colorDict, dimensions]);

  const referenceLineHeight = useMemo(
    () =>
      reduce(
        (total: number, dimension: keyof Datapoint) => {
          const reducedDatapoints = pipe(
            filter(
              (datapoint: Datapoint) => typeof datapoint[dimension] === "number"
            ),
            reduce(
              (acc: number, datapoint: Datapoint): number =>
                Number(datapoint[dimension]) > acc
                  ? Number(datapoint[dimension])
                  : acc,
              0
            )
          )(data);
          return reducedDatapoints > total ? reducedDatapoints : total;
        },
        0,
        dimensions
      ),
    [dimensions, data]
  );
  return { legendData, referenceLineHeight };
};
