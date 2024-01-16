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

import { renderPercentText } from "@justice-counts/agency-dashboard/src/utils/formatting";
import React, { FunctionComponent } from "react";

import { palette } from "../GlobalStyles";
import {
  Container,
  LegendBullet,
  LegendItem,
  LegendName,
  LegendTitle,
  LegendValue,
} from "./CategoryOverviewBreakdown.styles";
import { LineChartBreakdownProps } from "./types";
import {
  abbreviatedMonths,
  getMonthYearBasedOnMonth,
  splitUtcString,
} from "./utils";

/** TODO(#978) Refactor to handle multiple breakdowns */
export const CategoryOverviewBreakdown: FunctionComponent<
  LineChartBreakdownProps
> = ({ data, isFundingOrExpenses, dimensions, hoveredDate }) => {
  const { month, year } = splitUtcString(String(data.start_date));
  const { displayDate } = getMonthYearBasedOnMonth({
    monthStr: month,
    yearStr: year,
  });

  const totalDimensionValues = dimensions.reduce((acc, dim) => {
    if (data[dim]?.value) {
      const sum = acc + Number(data[dim].value);
      return sum;
    }
    return acc;
  }, 0);
  /** Dimensions sorted in descending order based on value, and enabled status (disabled dimensions go to bottom of list) */
  const sortedDimensions = dimensions
    .sort(
      (dimA: string, dimB: string) =>
        Number(data[dimB]?.value) - Number(data[dimA]?.value)
    )
    .sort((_: string, dimB: string) => (data[dimB]?.enabled ? 1 : -1));

  return (
    <Container>
      <LegendTitle>
        {data.start_date &&
          (hoveredDate ? displayDate : `Recent (${displayDate})`)}
      </LegendTitle>

      {sortedDimensions.map((dimension) => {
        const isDisabled = data[dimension]?.enabled !== true;

        /* Dimensions are only hidden from UI when they are disabled, otherwise they will visible and display their value or "Not Recorded" when there is no value */
        return (
          <LegendItem key={dimension} hidden={isDisabled}>
            <LegendBullet color={data[dimension]?.fill}>▪</LegendBullet>
            <LegendName color={palette.solid.black}>{dimension}</LegendName>
            <LegendValue>
              {renderPercentText(
                data[dimension]?.value,
                totalDimensionValues,
                isFundingOrExpenses
              )}
            </LegendValue>
          </LegendItem>
        );
      })}
    </Container>
  );
};
