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

import { Datapoint, ReportFrequency } from "../../types";

export interface TickProps {
  y: number;
  payload: {
    coordinate: number;
    isShow: boolean;
    offset: number;
    tickCoord: number;
    value: number;
  };
}

export interface CustomYAxisTickProps extends TickProps {
  percentageView: boolean;
  styles: React.CSSProperties;
  metric?: string;
  rightAligned?: boolean;
}

export type ResponsiveBarChartProps = {
  data: Datapoint[];
  dimensionNames: string[];
  metric: string;
  percentageView?: boolean;
  resizeHeight?: boolean;
  width?: string | number;
  maxBarSize?: number;
  onHoverBar?: (data: ResponsiveBarData) => void;
};

export type BarChartBackground = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type BarChartTooltipPayload = {
  color: string;
  dataKey: string;
  fill: string;
  name: string;
  payload: Datapoint;
  value: number;
};

export type ResponsiveBarData = Datapoint &
  BarChartBackground &
  Record<string, number | string | null> & {
    height: number;
    width: number;
    value: number[];
    x: number;
    y: number;
    payload: Datapoint;
    background: BarChartBackground;
    tooltipPayload: BarChartTooltipPayload;
  };

export type LineChartBreakdownValue = {
  fill: string;
  value?: number | string | null;
  enabled?: boolean;
};

export type LineChartBreakdownNumericValue = {
  value: number;
  fill: string;
  enabled?: boolean;
};

export type LineChartBreakdownProps = {
  data: Record<keyof Datapoint, LineChartBreakdownValue> & {
    frequency?: ReportFrequency;
  };
  isFundingOrExpenses: boolean;
  dimensions: string[];
  hoveredDate: string | null;
};

export type LegendData = Record<
  keyof Datapoint,
  LineChartBreakdownNumericValue | LineChartBreakdownValue
>;
