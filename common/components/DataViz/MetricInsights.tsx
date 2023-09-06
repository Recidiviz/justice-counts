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

import React, { useCallback } from "react";

import { Datapoint } from "../../types";
import {
  MetricInsight,
  MetricInsightsContainer,
} from "./DatapointsView.styles";
import {
  getAverageTotalValue,
  getLatestDateFormatted,
  getPercentChangeOverTime,
} from "./utils";

export const MetricInsights: React.FC<{
  datapoints: Datapoint[];
  enableHideByWidth?: boolean;
}> = ({ datapoints, enableHideByWidth = false }) => {
  const isAnnual = datapoints[0]?.frequency === "ANNUAL";
  const percentChange = getPercentChangeOverTime(datapoints);
  const avgValue = getAverageTotalValue(datapoints, isAnnual);
  const mostRecentValue = getLatestDateFormatted(datapoints, isAnnual);

  const [insightsWidth, setInsightsWidth] = React.useState<number>(0);

  const insightsRef = useCallback(
    (node: HTMLDivElement) => {
      if (node !== null) {
        setInsightsWidth(node.clientWidth);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [percentChange, avgValue, mostRecentValue]
  );

  return (
    <MetricInsightsContainer
      ref={insightsRef}
      selfWidth={insightsWidth}
      enableHideByWidth={enableHideByWidth}
    >
      <MetricInsight title="Percent Change" value={percentChange} />
      <MetricInsight title="Avg. Total Value" value={avgValue} />
      <MetricInsight title="Most Recent" value={mostRecentValue} />
    </MetricInsightsContainer>
  );
};
``;
