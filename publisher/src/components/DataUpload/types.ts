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

import { RawDatapoint, ReportOverview } from "@justice-counts/common/types";

export interface DataUploadResponseBody {
  metrics: UploadedMetric[];
  non_metric_errors?: ErrorWarningMessage[];
  new_reports: ReportOverview[];
  updated_reports: ReportOverview[];
  unchanged_reports: ReportOverview[];
  file_name?: string;
}

export interface UploadedMetric {
  datapoints: RawDatapoint[];
  display_name: string;
  key: string;
  metric_errors: MetricErrors[];
  enabled?: boolean;
}

export type ErrorWarningMessage = {
  title: string;
  subtitle: string;
  description: string;
  type: "ERROR" | "WARNING";
};

export type MetricErrors = {
  display_name: string;
  sheet_name: string;
  messages: ErrorWarningMessage[];
};

export type ErrorsWarningsMetrics = {
  metrics: UploadedMetric[];
  errorsWarningsAndSuccessfulMetrics: {
    successfulMetrics: UploadedMetric[];
    errorWarningMetrics: UploadedMetric[];
    notUploadedMetrics: UploadedMetric[];
    hasWarnings: boolean;
  };
  nonMetricErrors?: ErrorWarningMessage[];
};
