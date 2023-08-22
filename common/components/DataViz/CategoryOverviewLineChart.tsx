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
import { invertObj, map, mapObjIndexed, pipe } from "ramda";
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
import {
  convertShortDateToUTCDateString,
  printDateAsShortMonthYear,
} from "../../utils";
import { formatNumberForChart } from "../../utils/helperUtils";
import { palette } from "../GlobalStyles";
import { CategoryOverviewBreakdown } from "./CategoryOverviewBreakdown";
import { trimArrayEnds } from "./utils";

export type LineChartProps = {
  data: Datapoint[];
  isFundingOrExpenses: boolean;
  dimensions: string[];
  hoveredDate: string | null;
  setHoveredDate: (date: string | null) => void;
};

export type CustomXAxisTickProps = {
  x?: number;
  y?: number;
  length: number;
  payload?: {
    coordinate: number;
    index: number;
    isShow: boolean;
    offset: number;
    tickCoord: number;
    value: string;
  };
};

const axisTickStyle: CSSProperties = {
  fontFamily: "Inter",
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: "0em",
  textAlign: "right",
  fill: "rgba(0, 17, 51, 0.5)",
};

const CustomizedAxisTick = ({
  x,
  y,
  payload,
  length,
}: CustomXAxisTickProps) => {
  return payload?.index === length - 1 || payload?.index === 0 ? (
    <g transform={`translate(${x},${y})`}>
      <text
        style={axisTickStyle}
        x={0}
        y={0}
        dy={16}
        textAnchor="end"
        fill="#666"
        transform="translate(25, 0)"
      >
        {payload.value}
      </text>
    </g>
  ) : null;
};

export function CategoryOverviewLineChart({
  data,
  isFundingOrExpenses,
  dimensions,
  hoveredDate,
  setHoveredDate,
}: LineChartProps) {
  const colorDict: Record<keyof Datapoint, string> = useMemo(
    () =>
      dimensions?.length
        ? pipe(
            invertObj,
            mapObjIndexed(
              (colorName: string, fill) =>
                dimensions[Number(colorName.replace("bar", "")) - 1]
            ),
            invertObj
          )(palette.dataViz)
        : {},
    [dimensions]
  );
  const renderLines = () => {
    // each Recharts Bar component defines a category type in the stacked bar chart
    let lineDefinitions: JSX.Element[] = [];
    dimensions?.forEach((dimension) => {
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

  return (
    <Container>
      <BreakdownsTitle>Breakdowns</BreakdownsTitle>
      <LineChart
        width={680}
        height={550}
        data={data}
        style={{ paddingLeft: 11 }}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        onClick={() => setHoveredDate(null)}
        onMouseMove={(e) => {
          if (e.activeLabel) {
            setHoveredDate(convertShortDateToUTCDateString(e.activeLabel));
          }
        }}
      >
        <CartesianGrid horizontal={false} />
        <ReferenceLine y={referenceLineHeight} />
        {pipe(
          trimArrayEnds<Datapoint>,
          map(
            (datapoint: Datapoint): JSX.Element => (
              <ReferenceLine
                x={printDateAsShortMonthYear(
                  new Date(datapoint.start_date).getUTCMonth() + 1,
                  new Date(datapoint.start_date).getUTCFullYear()
                )}
              />
            )
          )
        )(data)}
        <XAxis
          dataKey={(datapoint) =>
            printDateAsShortMonthYear(
              new Date(datapoint.start_date).getUTCMonth() + 1,
              new Date(datapoint.start_date).getUTCFullYear()
            )
          }
          style={axisTickStyle}
          tickLine
          tick={<CustomizedAxisTick length={data.length} />}
          interval="preserveStartEnd"
        />
        <YAxis
          type="number"
          domain={[0, "dataMax"]}
          tickFormatter={formatNumberForChart as (value: number) => string}
          style={axisTickStyle}
          ticks={[0, referenceLineHeight]}
        />
        {
          <Tooltip
            wrapperStyle={{ display: "none" }}
          /> /* This preserves dot highlighting on hover; seems useful */
        }
        {renderLines()}
        {legendData && (
          <Legend
            content={
              <CategoryOverviewBreakdown
                data={legendData}
                isFundingOrExpenses={isFundingOrExpenses}
                dimensions={dimensions}
                hoveredDate={hoveredDate}
              />
            }
          />
        )}
      </LineChart>
    </Container>
  );
}
