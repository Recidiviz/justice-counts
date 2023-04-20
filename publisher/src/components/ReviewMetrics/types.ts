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

import {
  ButtonBorderColor,
  ButtonColor,
  ButtonLabelColor,
} from "@justice-counts/common/components/Button";
import {
  RawDatapoint,
  RawDatapointsByMetric,
  Report,
  ReportOverview,
} from "@justice-counts/common/types";
import React from "react";

export type ReviewHeaderActionButton = {
  name: string;
  onClick: () => void;
  disabled?: boolean;
  buttonColor?: ButtonColor;
  labelColor?: ButtonLabelColor;
  borderColor?: ButtonBorderColor;
};

export type ReviewMetric = {
  datapoints: RawDatapoint[];
  display_name: string;
  key: string;
  metricHasError?: boolean;
  metricHasValidInput?: boolean;
};

export type ReviewMetricOverwrites = {
  key: number;
  metricName: string;
  dimensionName: string;
  startDate: string;
};

export type ReviewMetricsProps = {
  title: string;
  description: string | React.ReactNode;
  buttons: ReviewHeaderActionButton[];
  metrics: ReviewMetric[];
  metricOverwrites?: ReviewMetricOverwrites[];
  records?: ReportOverview[];
};

export type PublishReviewPropsFromDatapoints = {
  records: Report[];
  datapointsByMetric: RawDatapointsByMetric;
  metricsToDisplay: {
    key: string;
    displayName: string;
  }[];
  firstSystemKey: string | undefined;
  firstMetricKey: string;
};
