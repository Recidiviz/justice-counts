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

import { palette } from "../GlobalStyles";
import { CustomYAxisTickProps } from "./types";
import { abbreviateNumber } from "./utils";

export const CustomYAxisTick = (props: CustomYAxisTickProps) => {
  const { y, payload, percentageView, styles, metric, rightAligned } = props;
  const str = percentageView
    ? `${payload.value * 100}%`
    : abbreviateNumber(payload.value);
  const label = str.length > 7 ? str.substring(0, 5).concat("...") : str;
  const labelHasDollarSign = metric === "Funding" || metric === "Expenses";
  return (
    <g transform={`translate(${0},${y})`}>
      <text
        x={rightAligned ? 50 : 0}
        y={0}
        textAnchor={rightAligned ? "end" : "start"}
        fill={palette.solid.darkgrey}
        style={styles}
      >
        {`${labelHasDollarSign ? "$" : ""}${label}`}
      </text>
    </g>
  );
};

export const CustomCursor = (props: React.SVGProps<SVGRectElement>) => {
  const { x, y, width, height } = props;
  return (
    <rect
      fill={palette.solid.darkgrey}
      x={Number(x) + Number(width) / 2}
      y={y}
      width={1}
      height={height}
    />
  );
};
