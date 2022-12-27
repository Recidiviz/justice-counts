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

import React, { useCallback, useState } from "react";

import { useWindowWidth } from "../../hooks";
import { ReportFrequency } from "../../types";
import { Badge, reportFrequencyBadgeColors } from "../Badge";
import { MIN_DESKTOP_WIDTH } from "../GlobalStyles";
import {
  MetricTitle,
  MetricTitleWrapper,
  MetricTitleWrapperGradient,
} from "./DatapointsTitle.styles";

export const DatapointsTitle: React.FC<{
  metricName: string;
  metricFrequency?: string;
}> = ({ metricName, metricFrequency }) => {
  const [titleWidth, setTitleWidth] = useState<number>(0);
  const windowWidth = useWindowWidth();

  const titleRef = useCallback(
    (node: HTMLDivElement) => {
      if (node !== null) setTitleWidth(node.clientWidth);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [metricName]
  );

  return (
    <MetricTitleWrapper>
      <MetricTitle ref={titleRef} titleWidth={titleWidth}>
        {metricName}
        {metricFrequency && windowWidth > MIN_DESKTOP_WIDTH && (
          <Badge
            color={
              reportFrequencyBadgeColors[metricFrequency as ReportFrequency]
            }
            noMargin
          >
            {metricFrequency}
          </Badge>
        )}
      </MetricTitle>
      {titleWidth > 700 && <MetricTitleWrapperGradient />}
    </MetricTitleWrapper>
  );
};
