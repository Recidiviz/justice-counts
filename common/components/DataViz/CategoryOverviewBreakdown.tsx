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
import { filter, is, pipe, reduce, values } from "ramda";
import React, { FunctionComponent } from "react";

// eslint-disable-next-line no-restricted-imports
import { printDateAsYear } from "../../utils";
import { palette } from "../GlobalStyles";
import {
  Container,
  LegendBullet,
  LegendItem,
  LegendName,
  LegendTitle,
  LegendValue,
} from "./CategoryOverviewBreakdown.styled";
import {
  LineChartBreakdownNumericValue,
  LineChartBreakdownProps,
  LineChartBreakdownValue,
} from "./types";

export const CategoryOverviewBreakdown: FunctionComponent<
  LineChartBreakdownProps
> = ({ data, dimensions }) => (
  <Container>
    <LegendTitle>{`Recent (${printDateAsYear(
      String(data.end_date.value)
    )})`}</LegendTitle>
    {dimensions.map((dimension) => (
      <LegendItem>
        <LegendBullet color={data[dimension]?.fill}>▪</LegendBullet>
        <LegendName color={palette.solid.black}>{dimension}</LegendName>
        <LegendValue>
          {renderPercentText(
            data[dimension]?.value,
            pipe(
              values,
              filter(({ value }: LineChartBreakdownValue) => is(Number, value)),
              reduce(
                (acc: number, { value }: LineChartBreakdownNumericValue) =>
                  acc + value,
                0
              )
            )(data)
          )}
        </LegendValue>
      </LegendItem>
    ))}
  </Container>
);
