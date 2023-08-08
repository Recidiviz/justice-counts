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

import { keys, map, mergeAll, pipe } from "ramda";
import React, { FunctionComponent } from "react";
import styled from "styled-components";
import { Datapoint } from "../../types";
import { formatNumberInput, printDateAsYear } from "../../utils";
import { palette } from "../GlobalStyles";
import { getSumOfDimensionValues } from "./utils";

export const CategoryOverviewBreakdown: FunctionComponent<{
  data: Record<
    keyof Datapoint,
    { value: number | string | null; fill: string }
  >;
  dimensions: string[];
}> = ({ data, dimensions }) => {
  const renderText = (val: number | string | null, maxValue: number) => {
    if (typeof val !== "number") {
      return "Not Reported";
    }

    let percentText = `${val !== 0 ? Math.round((val / maxValue) * 100) : 0}%`;
    // handle case of non-zero being rounded down to 0%
    if (percentText === "0%" && val !== 0) {
      percentText = "<1%";
    }
    return `${formatNumberInput(val.toString())} (${percentText})`;
  };
  return (
    <Container>
      <LegendTitle>{`Recent (${printDateAsYear(
        String(data.end_date.value)
      )})`}</LegendTitle>
      {dimensions.map((dimension) => (
        <LegendItem>
          <LegendBullet color={data[dimension]?.fill}>{`▪`}</LegendBullet>
          <LegendName color={palette.solid.black}>{dimension}</LegendName>
          <LegendValue>
            {renderText(
              data[dimension]?.value,
              getSumOfDimensionValues(
                pipe(
                  keys,
                  map((key: keyof Datapoint) => ({
                    [key]: data?.[dimension]?.value,
                  })),
                  mergeAll
                )(data) as Datapoint
              )
            )}
          </LegendValue>
        </LegendItem>
      ))}
    </Container>
  );
};

const Container = styled.ul`
  width: 100%;
  display: flex;
  flex-direction: column;
  list-style-type: square;
  margin-top: 32px;
`;

const LegendTitle = styled.p`
  font-size: 14px;
  line-height: 22px;
`;

const LegendItem = styled.li`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`;

const LegendBullet = styled.span<{ color: string }>`
  font-size: 32px;
  color: ${({ color }) => color};
  line-height: 18px;
  text-align: left;
`;

const LegendName = styled.span<{ color: string }>`
  font-size: 14px;
  line-height: 22px;
  color: ${({ color }) => color};
  text-align: left;
`;

const LegendValue = styled.span`
  font-size: 14px;
  line-height: 22px;
  margin-left: auto;
  text-align: right;
`;
