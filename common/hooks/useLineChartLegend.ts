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

import { filter, head, keys, map, mergeAll, pipe, reverse } from "ramda";
import { useEffect, useState } from "react";

import { Datapoint } from "../types";

export const useLineChartLegend = (
  data: Datapoint[],
  dimensions: (keyof Datapoint)[],
  colorDict: Record<string, string>
) => {
  const [legendData, setLegendData] =
    useState<Record<keyof Datapoint, { value: number; fill: string }>>();

  useEffect(() => {
    const transformDataForLegend = (
      datapoint: Datapoint
    ): Record<keyof Datapoint, { value: number; fill: string }> =>
      pipe(
        keys,
        map((dimension: keyof Datapoint) => ({
          [dimension]: {
            value: datapoint[dimension],
            fill: colorDict[dimension],
          },
        })),
        mergeAll
      )(datapoint) as Record<keyof Datapoint, { value: number; fill: string }>;

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
  return { legendData };
};
