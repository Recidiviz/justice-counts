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
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as TooltipComponent,
  XAxis,
  YAxis,
} from "recharts";
import styled from "styled-components/macro";

import { rem } from "../../utils";
import { MIN_DESKTOP_WIDTH, palette } from "../GlobalStyles";
import { CustomCursor, CustomYAxisTick } from "./BarChartComponents";
import Tooltip from "./Tooltip";
import { ResponsiveBarChartProps, TickProps } from "./types";
import { generateDummyDataForChart, getDatapointBarLabel } from "./utils";

const MAX_BAR_SIZE = 150;

const ChartContainer = styled.div`
  width: 100%;
  height: 100%;
  max-height: calc(100% - 220px);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;

  @media only screen and (max-width: ${MIN_DESKTOP_WIDTH}px) {
    min-height: 400px;
  }
`;

const NoReportedData = styled.div`
  position: absolute;
  background: white;
  padding: 8px;

  &::after {
    content: "No reported data for this metric.";
  }
`;

const tickStyle = {
  fontSize: rem("12px"),
  fontWeight: 600,
  fill: palette.solid.darkgrey,
};

const ResponsiveBarChart = forwardRef<never, ResponsiveBarChartProps>(
  (
    {
      data,
      dimensionNames,
      percentageView,
      resizeHeight,
      metric,
    }: ResponsiveBarChartProps,
    ref
  ) => {
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

    const responsiveContainerProps = resizeHeight
      ? {
          width: "100%",
          height: "100%",
        }
      : {
          width: "100%",
          height: 500,
        };

    return (
      <ChartContainer>
        <ResponsiveContainer {...responsiveContainerProps}>
          <BarChartComponent
            data={data.length > 0 ? data : generateDummyDataForChart()}
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
            <CartesianGrid vertical={false} strokeDasharray="1 0" />
            <XAxis
              dataKey={(datapoint) => {
                if (data.length === 0) return datapoint.date;
                return getDatapointBarLabel(datapoint);
              }}
              padding={{ left: -0.5, right: -0.5 }}
              interval="preserveEnd"
              minTickGap={32}
              tick={tickStyle}
              tickLine={false}
              tickMargin={12}
            />
            <YAxis
              allowDecimals={percentageView}
              // TODO(#803): Fix lint error and remove the `eslint-disable-next-line`
              // eslint-disable-next-line react/no-unstable-nested-components
              tick={(props: TickProps) => (
                <CustomYAxisTick
                  y={props.y}
                  payload={props.payload}
                  percentageView={!!percentageView}
                  styles={tickStyle}
                />
              )}
              tickLine={false}
              tickCount={percentageView ? 5 : 12}
              domain={percentageView ? ["dataMin", "dataMax"] : undefined}
              axisLine={false}
            />
            <TooltipComponent
              isAnimationActive={false}
              position={{ y: 100 }}
              cursor={data.length === 0 ? false : <CustomCursor />}
              content={
                <Tooltip
                  percentOnly={!!percentageView}
                  dimensionNames={dimensionNames}
                  metric={metric}
                />
              }
            />
            {renderBarDefinitions()}
          </BarChartComponent>
        </ResponsiveContainer>
        {data.length === 0 && <NoReportedData />}
      </ChartContainer>
    );
  }
);

export default ResponsiveBarChart;
