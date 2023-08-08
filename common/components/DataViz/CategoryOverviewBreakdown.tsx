import { keys, map, mergeAll, pipe } from "ramda";
import React, { FunctionComponent } from "react";
import styled from "styled-components";
import { Datapoint } from "../../types";
import { formatNumberInput } from "../../utils";
import { palette } from "../GlobalStyles";
import { getSumOfDimensionValues } from "./utils";

export const CategoryOverviewBreakdown: FunctionComponent<{
  data: Record<keyof Datapoint, { value: number; fill: string }>;
  dimensions: string[];
}> = ({ data, dimensions }) => {
  const renderText = (val: number | null, maxValue: number) => {
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
      {dimensions.map((dimension) => (
        <LegendItem>
          <LegendName color={data[dimension]?.fill}>
            {`▪`}&nbsp;&nbsp;
          </LegendName>
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

const LegendItem = styled.li`
  font-size: 24px;
  display: flex;
  flex-direction: row;
`;

const LegendName = styled.span<{ color: string }>`
  font-size: 18px;
  color: ${({ color }) => color};
  align-self: flex-start;
`;

const LegendValue = styled.span`
  font-size: 18px;
  align-self: flex-end;
`;
