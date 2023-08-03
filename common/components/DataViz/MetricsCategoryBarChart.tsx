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

import React, { forwardRef } from "react";
import {
  Bar,
  BarChart as BarChartComponent,
  ResponsiveContainer,
  Tooltip as TooltipComponent,
  XAxis,
  YAxis,
} from "recharts";
import styled from "styled-components/macro";

import { rem } from "../../utils";
import { palette } from "../GlobalStyles";
import { CustomCursor, CustomYAxisTick } from "./BarChartComponents";
import Tooltip from "./Tooltip";
import { ResponsiveBarChartProps, TickProps } from "./types";
import { splitUtcString } from "./utils";

const MAX_BAR_SIZE = 150;

const NoReportedData = styled.div`
  position: absolute;
  background: white;
  padding: 0 0 0 53px;

  &::after {
    content: "No reported data for this metric.";
  }
`;

const tickStyle = {
  fontSize: rem("12px"),
  fontWeight: 600,
  fill: palette.highlight.grey8,
};

const ResponsiveBarChart = forwardRef<never, ResponsiveBarChartProps>(
  ({ data, dimensionNames, width, metric }: ResponsiveBarChartProps, ref) => {
    const renderBarDefinitions = () => {
      // each Recharts Bar component defines a category type in the stacked bar chart
      let barDefinitions: JSX.Element[] = [];
      dimensionNames.forEach((dimension, index) => {
        const newBar = (
          <Bar
            key={dimension}
            dataKey={dimension}
            stackId="a"
            fill={Object.values(palette.dataViz)[index]}
            maxBarSize={MAX_BAR_SIZE}
          />
        );
        barDefinitions = [newBar, ...barDefinitions];
      });
      barDefinitions.push(
        <Bar
          key="dataVizMissingData"
          dataKey="dataVizMissingData"
          stackId="a"
          fill="url(#gradient)"
          maxBarSize={MAX_BAR_SIZE}
        />
      );
      return barDefinitions;
    };

    return (
      <>
        <ResponsiveContainer width={width} height="100%">
          <BarChartComponent
            data={data}
            barGap={0}
            barCategoryGap={0.5}
            margin={{
              top: 20,
              right: 0,
              left: 0,
              bottom: 16,
            }}
            ref={ref}
          >
            <defs>
              <linearGradient
                key="gradient"
                x1="0"
                x2="0"
                y1="0"
                y2="1"
                id="gradient"
              >
                <stop stopColor="rgba(221, 18, 18, 0)" offset="0%" />
                <stop stopColor="rgba(221, 18, 18, 0.25)" offset="100%" />
              </linearGradient>
            </defs>
            <XAxis
              dataKey={(datapoint) => {
                const [, , , year] = splitUtcString(datapoint.start_date);
                return year;
              }}
              padding={{ left: -0.5, right: -0.5 }}
              interval="preserveEnd"
              minTickGap={16}
              tick={tickStyle}
              tickLine={false}
              tickMargin={12}
              stroke="transparent"
            />
            {data.length !== 0 && (
              <YAxis
                // TODO(#803): Fix lint error and remove the `eslint-disable-next-line`
                // eslint-disable-next-line react/no-unstable-nested-components
                tick={(props: TickProps) => (
                  <CustomYAxisTick
                    y={props.y}
                    payload={props.payload}
                    percentageView={false}
                    styles={tickStyle}
                    metric={metric}
                  />
                )}
                tickLine={false}
                tickCount={6}
                axisLine={false}
              />
            )}
            <TooltipComponent
              isAnimationActive={false}
              position={{ y: 100 }}
              cursor={data.length === 0 ? false : <CustomCursor />}
              content={
                <Tooltip
                  dimensionNames={dimensionNames}
                  percentOnly={false}
                  metric={metric}
                />
              }
            />
            {renderBarDefinitions()}
          </BarChartComponent>
        </ResponsiveContainer>
        {data.length === 0 && <NoReportedData />}
      </>
    );
  }
);

export default ResponsiveBarChart;
