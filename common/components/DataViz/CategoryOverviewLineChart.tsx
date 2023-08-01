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

import React from "react";
import { Legend, Line, LineChart, Tooltip, XAxis } from "recharts";

import { Datapoint } from "../../types";
import { palette } from "../GlobalStyles";
import { splitUtcString } from "./utils";

type LineChartProps = {
  data: Datapoint[];
  dimensions: string[];
};

export function CategoryOverviewLineChart({
  data,
  dimensions,
}: LineChartProps) {
  const renderLines = () => {
    // each Recharts Bar component defines a category type in the stacked bar chart
    let lineDefinitions: JSX.Element[] = [];
    dimensions.forEach((dimension, index) => {
      const newLine = (
        <Line
          key={dimension}
          dataKey={dimension}
          stroke={Object.values(palette.dataViz)[index]}
        />
      );
      lineDefinitions = [newLine, ...lineDefinitions];
    });
    return lineDefinitions;
  };

  return (
    <LineChart
      width={730}
      height={250}
      data={data}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
    >
      <XAxis
        dataKey={(datapoint) => {
          const [, , , year] = splitUtcString(datapoint.start_date);
          return year;
        }}
      />
      <Tooltip />
      <Legend />
      {renderLines()}
    </LineChart>
  );
}
