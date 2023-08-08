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

import { filter, invertObj, mapObjIndexed, pipe, reduce } from "ramda";
import React from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  XAxis,
} from "recharts";

import { useLineChartLegend } from "../../hooks";
import { Datapoint } from "../../types";
import { printDateAsYear } from "../../utils";
import { palette } from "../GlobalStyles";
import { CategoryOverviewBreakdown } from "./CategoryOverviewBreakdown";

export type LineChartProps = {
  data: Datapoint[];
  dimensions: string[];
};

export function CategoryOverviewLineChart({
  data,
  dimensions,
}: LineChartProps) {
  const colorDict = pipe(
    invertObj,
    mapObjIndexed(
      (colorName: string, fill) =>
        dimensions[Number(colorName.replace("bar", "")) - 1]
    ),
    invertObj
  )(palette.dataViz);

  const renderLines = () => {
    // each Recharts Bar component defines a category type in the stacked bar chart
    let lineDefinitions: JSX.Element[] = [];
    dimensions.forEach((dimension, index) => {
      const newLine = (
        <Line
          key={dimension}
          dataKey={dimension}
          stroke={colorDict[dimension]}
          type="monotone"
        />
      );
      lineDefinitions = [newLine, ...lineDefinitions];
    });
    return lineDefinitions;
  };

  const { legendData } = useLineChartLegend(data, dimensions, colorDict);

  return (
    <>
      <LineChart
        width={533}
        height={500}
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid horizontal={false} />
        {
          <ReferenceLine
            y={reduce(
              (total: number, dimension: keyof Datapoint) => {
                const reducedDatapoints = pipe(
                  filter(
                    (datapoint: Datapoint) =>
                      typeof datapoint[dimension] === "number"
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
            )}
            stroke={"#ECECEC"}
          />
        }
        <XAxis dataKey={(datapoint) => printDateAsYear(datapoint.start_date)} />
        {/*<Tooltip />*/}
        {renderLines()}
        {legendData && (
          <Legend
            content={(props) => {
              return (
                <CategoryOverviewBreakdown
                  data={legendData}
                  dimensions={dimensions}
                />
              );
            }}
          />
        )}
      </LineChart>
    </>
  );
}
