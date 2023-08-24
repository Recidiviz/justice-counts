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
import {
  descend,
  filter,
  is,
  map,
  Ord,
  pipe,
  reduce,
  sort,
  values,
} from "ramda";
import React, { FunctionComponent } from "react";

// eslint-disable-next-line no-restricted-imports
import { Datapoint } from "../../types";
import { printDateAsShortMonthYear } from "../../utils";
import { palette } from "../GlobalStyles";
import {
  Container,
  LegendBullet,
  LegendItem,
  LegendName,
  LegendTitle,
  LegendValue,
} from "./CategoryOverviewBreakdown.styles";
import {
  LineChartBreakdownNumericValue,
  LineChartBreakdownProps,
  LineChartBreakdownValue,
} from "./types";

export const CategoryOverviewBreakdown: FunctionComponent<
  LineChartBreakdownProps
> = ({ data, isFundingOrExpenses, dimensions, hoveredDate }) => (
  <Container>
    <LegendTitle>
      {data.start_date &&
        (hoveredDate
          ? printDateAsShortMonthYear(
              new Date(data.start_date?.value as string).getUTCMonth() + 1,
              new Date(data.start_date?.value as string).getUTCFullYear()
            )
          : `Recent (${printDateAsShortMonthYear(
              new Date(data.start_date?.value as string).getUTCMonth() + 1,
              new Date(data.start_date?.value as string).getUTCFullYear()
            )})`)}
    </LegendTitle>
    {pipe(
      sort(
        descend(
          (dimension: keyof Datapoint) => Number(data[dimension]?.value) as Ord
        )
      ),
      map((dimension: keyof Datapoint) => (
        <LegendItem key={dimension}>
          <LegendBullet color={data[dimension]?.fill}>▪</LegendBullet>
          <LegendName color={palette.solid.black}>{dimension}</LegendName>
          <LegendValue>
            {renderPercentText(
              data[dimension]?.value,
              pipe(
                values as unknown as (
                  obj: Record<keyof Datapoint, LineChartBreakdownValue>
                ) => LineChartBreakdownValue,
                filter(({ value }: LineChartBreakdownValue) =>
                  is(Number, value)
                ) as (
                  pred: LineChartBreakdownValue
                ) => LineChartBreakdownNumericValue[],
                reduce<LineChartBreakdownNumericValue, number>(
                  (acc: number, { value }: LineChartBreakdownNumericValue) =>
                    acc + value,
                  0
                )
              )(data) as number,
              isFundingOrExpenses
            )}
          </LegendValue>
        </LegendItem>
      ))
    )(dimensions)}
  </Container>
);
