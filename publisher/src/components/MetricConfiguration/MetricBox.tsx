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

import { Badge } from "@justice-counts/common/components/Badge";
import { ReportFrequency } from "@justice-counts/common/types";
import { observer } from "mobx-react-lite";
import React from "react";

import { useSettingsSearchParams } from "../Settings";
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
  customFrequency: ReportFrequency;
  description: string;
  enabled?: boolean | null;
};

export const MetricBox: React.FC<MetricBoxProps> = observer(
  ({
    metricKey,
    displayName,
    frequency,
    customFrequency,
    description,
    enabled,
  }): JSX.Element => {
    const [settingsSearchParams, setSettingsSearchParams] =
      useSettingsSearchParams();

    const handleMetricBoxClick = () => {
      setSettingsSearchParams({ ...settingsSearchParams, metric: metricKey });
    };
    const displayFrequency = customFrequency
      ? customFrequency.toLowerCase()
      : frequency.toLowerCase();

    return (
      <MetricBoxContainer onClick={handleMetricBoxClick} enabled={enabled}>
        <MetricName>{displayName}</MetricName>
        <MetricDescription>{description}</MetricDescription>
        <MetricNameBadgeWrapper>
          <Badge
            color={!enabled ? "GREY" : "GREEN"}
            disabled={!enabled}
            noMargin
          >
            {!enabled && "Inactive"}
            {enabled && (
              <>
                {displayFrequency === "annual" ? "Annually" : displayFrequency}
              </>
            )}
          </Badge>
        </MetricNameBadgeWrapper>
      </MetricBoxContainer>
    );
  }
);
