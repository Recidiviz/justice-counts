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
