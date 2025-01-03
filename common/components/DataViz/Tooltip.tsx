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

import { sum } from "lodash";
import React from "react";
import { TooltipProps as RechartsTooltipProps } from "recharts";
// eslint-disable-next-line no-restricted-imports
import styled from "styled-components";

import { Datapoint } from "../../types";
import { formatNumberInput } from "../../utils";
import { palette, typography } from "../GlobalStyles";
import { LegendColor } from "./Legend";
import { getDatapointBarLabel, getSumOfDimensionValues } from "./utils";

const TooltipContainer = styled.div`
  padding: 16px;
  border-radius: 4px;
  background: ${palette.solid.darkgrey};
`;

const TooltipItemContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const TooltipName = styled.div`
  ${typography.sizeCSS.normal}
  flex-grow: 1;
  color: ${palette.solid.white};
`;

const TooltipValue = styled(TooltipName)`
  flex-grow: 0;
  margin-left: 32px;
`;

const TooltipNameWithBottomMargin = styled(TooltipName)`
  margin-bottom: 16px;
`;

interface TooltipProps extends RechartsTooltipProps<number, string> {
  percentOnly: boolean;
  dimensionNames: string[];
  metric: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  active,
  payload,
  label,
  percentOnly,
  dimensionNames,
  metric,
}) => {
  if (active && payload && payload.length) {
    const datapoint = payload[0].payload as Datapoint;
    const textHasDollarSign = metric === "Funding" || metric === "Expenses";

    const renderText = (val: string | number | null, maxValue: number) => {
      if (typeof val !== "number") {
        return "Not Recorded";
      }

      let percentText = `${
        val !== 0 ? Math.round((val / maxValue) * 100) : 0
      }%`;
      // handle case of non-zero being rounded down to 0%
      if (percentText === "0%" && val !== 0) {
        percentText = "<1%";
      }
      return percentOnly
        ? percentText
        : `${textHasDollarSign ? "$" : ""}${formatNumberInput(val.toString())}${
            payload.length > 2 ? ` (${percentText})` : ""
          }`;
    };

    const renderItems = () => {
      if (payload.length === 0) {
        return null;
      }

      if (datapoint.dataVizMissingData !== 0) {
        return (
          <TooltipItemContainer>
            <TooltipName>Not Recorded</TooltipName>
          </TooltipItemContainer>
        );
      }

      const sumOfDimensions = getSumOfDimensionValues(datapoint);

      return dimensionNames.map((dimension, idx: number) => {
        if (dimension === "dataVizMissingData") {
          return null;
        }

        return (
          <TooltipItemContainer key={dimension}>
            <LegendColor index={idx} />
            <TooltipName>{`${dimension}${
              dimension === "Total" ? ` ${metric}` : ""
            }`}</TooltipName>
            <TooltipValue>
              {renderText(datapoint[dimension], sumOfDimensions)}
            </TooltipValue>
          </TooltipItemContainer>
        );
      });
    };

    const renderTotalValue = () => {
      const hasTotalValue = dimensionNames.includes("Total");
      const totalValue = sum(
        dimensionNames.map((dimension) => datapoint[dimension])
      );

      if (datapoint.dataVizMissingData !== 0 || hasTotalValue) return null;

      return (
        <TooltipNameWithBottomMargin>
          <TooltipItemContainer>
            <TooltipName>Total</TooltipName>
            <TooltipValue>
              {textHasDollarSign ? "$" : ""}
              {formatNumberInput(totalValue.toString())}
            </TooltipValue>
          </TooltipItemContainer>
        </TooltipNameWithBottomMargin>
      );
    };

    return (
      <TooltipContainer>
        <TooltipNameWithBottomMargin>
          {getDatapointBarLabel(datapoint)}
        </TooltipNameWithBottomMargin>
        {renderTotalValue()}
        {renderItems()}
      </TooltipContainer>
    );
  }

  return null;
};

export default Tooltip;
