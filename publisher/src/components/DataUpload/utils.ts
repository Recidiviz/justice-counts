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

import { UserAgency } from "@justice-counts/common/types";

import {
  DataUploadResponseBody,
  ErrorsWarningsMetrics,
  UploadedMetric,
} from "./types";

export const isSupervisionMetricForSupervisionAgencyThatReportsSubsystems = (
  metric: UploadedMetric,
  agency: UserAgency | undefined
): boolean => {
  if (
    metric.key.includes("SUPERVISION") &&
    agency?.systems.some(
      (system) =>
        system === "PAROLE" ||
        system === "PROBATION" ||
        system === "OTHER_SUPERVISION" ||
        system === "PRETRIAL_SUPERVISION"
    )
  ) {
    return true;
  }
  return false;
};
export const processUploadResponseBody = (
  data: DataUploadResponseBody,
  currentAgency: UserAgency | undefined
): ErrorsWarningsMetrics => {
  const errorsWarningsAndSuccessfulMetrics = data.metrics.reduce(
    (acc, metric) => {
      const noSheetErrorsFound =
        metric.metric_errors.filter(
          (sheet) =>
            sheet.messages.filter((msg) => msg.type === "ERROR")?.length > 0
        ).length === 0;
      const sheetWarningsFound =
        metric.metric_errors.filter(
          (sheet) =>
            sheet.messages.filter((msg) => msg.type === "WARNING")?.length > 0
        ).length > 0;
      const isSuccessfulMetric =
        noSheetErrorsFound && metric.datapoints.length > 0;
      const noMetricUpload =
        noSheetErrorsFound && metric.datapoints.length === 0;

      /**
       * If there are no errors and only warnings, we still want to show the
       * error/warning page so users can review the warnings (that now appear in the success section).
       */
      metric.metric_errors.forEach((sheet) =>
        sheet.messages.forEach((msg) => {
          if (msg.type === "WARNING" && !acc.hasWarnings) {
            acc.hasWarnings = true;
          }
        })
      );

      if (isSuccessfulMetric) {
        // If there are no errors/warnings associated with the metric, add it to successfulMetrics.
        acc.successfulMetrics.push(metric);
      } else if (noMetricUpload) {
        if (
          isSupervisionMetricForSupervisionAgencyThatReportsSubsystems(
            metric,
            currentAgency
          ) &&
          // If the agency is a Supervision agency that also reports for subsystem, we want to add Supervision
          // warnings to errorWarningMetrics. We group supervision sheet errors under the combined supervision
          // metric keys. If there are errors/warnings we don't want to group them under "Metrics Not Uploaded"
          // we want them to be in alerts.
          sheetWarningsFound
        ) {
          acc.errorWarningMetrics.push(metric);
        } else {
          // In every other case, if no data metric was not explicitly uploaded for the metric, it should be
          // added to notUploadedMetrics
          acc.notUploadedMetrics.push(metric);
        }
      } else {
        // If there are errors and warnings associated with the metric add it to errorWarningMetrics.
        acc.errorWarningMetrics.push(metric);
      }

      return acc;
    },
    {
      successfulMetrics: [] as UploadedMetric[],
      notUploadedMetrics: [] as UploadedMetric[],
      errorWarningMetrics: [] as UploadedMetric[],
      hasWarnings: false,
    }
  );

  /**
   * Non-metric errors: errors that are not associated with a metric.
   * @example: user uploads an excel file that contains a sheet not associated
   * with a metric.
   */
  if (data.non_metric_errors && data.non_metric_errors.length > 0) {
    return {
      errorsWarningsAndSuccessfulMetrics,
      metrics: data.metrics,
      nonMetricErrors: data.non_metric_errors,
    };
  }

  return { errorsWarningsAndSuccessfulMetrics, metrics: data.metrics };
};
