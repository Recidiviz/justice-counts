// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2022 Recidiviz, Inc.
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

import { ReportFrequency } from "@justice-counts/common/types";
import React from "react";

import { Badge } from "../Badge";
import {
  MetricBoxContainer,
  MetricDescription,
  MetricName,
  MetricNameBadgeWrapper,
} from ".";

type MetricBoxProps = {
  metricKey: string;
  displayName: string;
  frequency: ReportFrequency;
  description: string;
  enabled?: boolean;
  setActiveMetricKey: React.Dispatch<React.SetStateAction<string | undefined>>;
};

export const MetricBox: React.FC<MetricBoxProps> = ({
  metricKey,
  displayName,
  frequency,
  description,
  enabled,
  setActiveMetricKey,
}): JSX.Element => {
  return (
    <MetricBoxContainer
      onClick={() => setActiveMetricKey(metricKey)}
      enabled={enabled}
    >
      <MetricName>{displayName}</MetricName>
      <MetricDescription>{description}</MetricDescription>
      <MetricNameBadgeWrapper>
        <Badge color={!enabled ? "GREY" : "GREEN"} disabled={!enabled} noMargin>
          {!enabled ? "Inactive" : frequency.toLowerCase()}
        </Badge>
      </MetricNameBadgeWrapper>
    </MetricBoxContainer>
  );
};
