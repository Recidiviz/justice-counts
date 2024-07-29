// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2024 Recidiviz, Inc.
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
import {
  Bar,
  BarChart as BarChartComponent,
  ResponsiveContainer,
} from "recharts";

import { palette } from "../GlobalStyles";
import { ResponsiveBarChartProps } from "./types";

const MAX_BAR_SIZE = 100;

const MiniBarChart: React.FC<Omit<ResponsiveBarChartProps, "metric">> = ({
  data,
  dimensionNames,
}) => {
  const renderBarDefinitions = () => {
    const barDefinitions = [];
    dimensionNames.forEach((dimension) => {
      barDefinitions.push(
        <Bar
          key={dimension}
          dataKey={dimension}
          stackId="a"
          fill={palette.dataViz.bar11}
          maxBarSize={MAX_BAR_SIZE}
        />
      );
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
    <ResponsiveContainer width="100%" height="100%">
      <BarChartComponent
        data={data}
        barGap={0}
        barCategoryGap="2%"
        margin={{
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
        }}
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
            <stop stopColor="rgba(23, 28, 43, 0)" offset="0%" />
            <stop stopColor="rgba(23, 28, 43, 0.1)" offset="100%" />
          </linearGradient>
          <linearGradient
            key="hovered-gradient"
            x1="0"
            x2="0"
            y1="0"
            y2="1"
            id="hovered-gradient"
          >
            <stop stopColor="rgba(255, 255, 255, 0)" offset="0%" />
            <stop stopColor="rgba(255, 255, 255, 0.7)" offset="100%" />
          </linearGradient>
        </defs>
        {renderBarDefinitions()}
      </BarChartComponent>
    </ResponsiveContainer>
  );
};

export default MiniBarChart;
