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

import {
  DataUploadResponseBody,
  ErrorsWarningsMetrics,
  UploadedMetric,
} from "./types";

export const processUploadResponseBody = (
  data: DataUploadResponseBody
): ErrorsWarningsMetrics => {
  const errorsWarningsAndSuccessfulMetrics = data.metrics.reduce(
    (acc, metric) => {
      const noSheetErrorsFound =
        metric.metric_errors.filter(
          (sheet) =>
            sheet.messages.filter((msg) => msg.type === "ERROR")?.length > 0
        ).length === 0;
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
        acc.successfulMetrics.push(metric);
      } else if (noMetricUpload) {
        acc.notUploadedMetrics.push(metric);
      } else {
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
