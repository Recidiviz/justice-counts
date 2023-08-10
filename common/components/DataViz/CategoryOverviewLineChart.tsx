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
  BreakdownsTitle,
  Container,
} from "@justice-counts/agency-dashboard/src/CategoryOverview/CategoryOverview.styled";
import { invertObj, map, mapObjIndexed, pipe, reverse, tail } from "ramda";
import React, { CSSProperties, useMemo } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useLineChartLegend } from "../../hooks";
import { Datapoint } from "../../types";
import { printDateAsYear } from "../../utils";
import { formatNumberForChart } from "../../utils/helperUtils";
import { palette } from "../GlobalStyles";
import { CategoryOverviewBreakdown } from "./CategoryOverviewBreakdown";

export type LineChartProps = {
  data: Datapoint[];
  dimensions: string[];
  hoveredDate: string | null;
};

export function CategoryOverviewLineChart({
  data,
  dimensions,
  hoveredDate,
}: LineChartProps) {
  const colorDict = useMemo(
    () =>
      pipe(
        invertObj,
        mapObjIndexed(
          (colorName: string, fill) =>
            dimensions[Number(colorName.replace("bar", "")) - 1]
        ),
        invertObj
      )(palette.dataViz),
    [dimensions]
  );

  const renderLines = () => {
    // each Recharts Bar component defines a category type in the stacked bar chart
    let lineDefinitions: JSX.Element[] = [];
    dimensions.forEach((dimension) => {
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
  const { legendData, referenceLineHeight } = useLineChartLegend(
    data,
    dimensions,
    hoveredDate,
    colorDict
  );
  const axisTickStyle: CSSProperties = useMemo(
    () => ({
      fontFamily: "Inter",
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: "0em",
      textAlign: "right",
      fill: "rgba(0, 17, 51, 0.5)",
    }),
    []
  );
  return (
    <Container>
      <BreakdownsTitle>Breakdowns</BreakdownsTitle>
      <LineChart
        width={600}
        height={500}
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid horizontal={false} />
        <ReferenceLine y={referenceLineHeight} />
        {map(
          (datapoint: Datapoint) => (
            <ReferenceLine x={printDateAsYear(datapoint.end_date)} />
          ),
          pipe(
            tail,
            reverse<Datapoint>,
            tail,
            reverse<Datapoint>
          )(data) as Datapoint[]
        )}
        <XAxis
          dataKey={(datapoint) => printDateAsYear(datapoint.end_date)}
          style={axisTickStyle}
          tickLine={true}
          ticks={[
            printDateAsYear(data[0].end_date),
            printDateAsYear(data[data.length - 1].end_date),
          ]}
          interval="preserveStartEnd"
        />
        <YAxis
          type="number"
          domain={[0, "dataMax"]}
          tickFormatter={formatNumberForChart as (value: number) => string}
          style={axisTickStyle}
          ticks={[0, referenceLineHeight]}
        />
        {<Tooltip wrapperStyle={{ display: "none" }} />}
        {renderLines()}
        {legendData && (
          <Legend
            content={
              <CategoryOverviewBreakdown
                data={legendData}
                dimensions={dimensions}
              />
            }
          />
        )}
      </LineChart>
    </Container>
  );
}
