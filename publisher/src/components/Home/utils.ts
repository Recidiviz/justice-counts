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

import { Metric, Report, ReportFrequency } from "@justice-counts/common/types";
import {
  groupBy,
  monthsByName,
  printReportTitle,
} from "@justice-counts/common/utils";

import {
  AnnualRecordMetadata,
  LatestRecordMetadata,
  TaskCardMetadata,
  taskCardLabelsActionLinks,
} from ".";

export const metricEnabled = ({ enabled }: Metric) => enabled;
export const metricNotConfigured = ({ enabled }: Metric) => enabled === null;
export const metricIsMonthly = (metric: Metric) =>
  metric.custom_frequency === "MONTHLY" || metric.frequency === "MONTHLY";

export const createReportTitle = (record: Report, monthName?: string) => {
  return monthName
    ? `${printReportTitle(
        record.month,
        record.year,
        record.frequency
      )} (${monthName})`
    : printReportTitle(record.month, record.year, record.frequency);
};

export const createMonthlyRecordMetadata = (
  monthlyRecord: Report
): LatestRecordMetadata => {
  return {
    id: monthlyRecord.id,
    reportTitle: createReportTitle(monthlyRecord),
    metrics: groupBy(monthlyRecord.metrics, (metric: Metric) => metric.key),
    status: monthlyRecord.status,
  };
};

export const createAnnualRecordsMetadata = (annualRecords: {
  [key: string]: Report;
}) => {
  const annualRecordsEntries = Object.entries(annualRecords);
  return annualRecordsEntries.reduce((acc, [startingMonth, record]) => {
    // Exclude annual records with no metrics assigned to them
    if (record.metrics.length === 0) return acc;
    const monthName = monthsByName[Number(startingMonth) - 1];

    acc[startingMonth] = {
      id: record.id,
      reportTitle: createReportTitle(record, monthName), // Add starting month to report title to differentiate same year annual record titles
      metrics: groupBy(record.metrics, (metric: Metric) => metric.key),
      status: record.status,
    };

    return acc;
  }, {} as AnnualRecordMetadata);
};

export const createDataEntryOrPublishTaskCard = (
  currentMetric: Metric,
  recordMetadata?: LatestRecordMetadata
) => {
  const metricFrequency =
    currentMetric.custom_frequency || currentMetric.frequency;
  const hasMetricValue = Boolean(
    recordMetadata?.metrics?.[currentMetric.key][0].value
  );
  return {
    reportID: recordMetadata?.id,
    title: currentMetric.display_name,
    description: currentMetric.description,
    actionLinks: hasMetricValue
      ? [taskCardLabelsActionLinks.publish]
      : [
          taskCardLabelsActionLinks.uploadData,
          taskCardLabelsActionLinks.manualEntry,
        ],
    metricFrequency,
    hasMetricValue,
  };
};

export const createConfigurationTaskCard = (
  currentMetric: Metric,
  recordMetadata?: LatestRecordMetadata
) => {
  return {
    reportID: recordMetadata?.id,
    title: currentMetric.display_name,
    description: currentMetric.description,
    actionLinks: [taskCardLabelsActionLinks.metricAvailability],
    metricSettingsParams: `?system=${currentMetric.system.key.toLowerCase()}&metric=${currentMetric.key.toLowerCase()}`,
  };
};

export const createTaskCards = (
  metric: Metric,
  recordMetadatas: [
    () => LatestRecordMetadata | undefined,
    (startingMonth: number | string) => LatestRecordMetadata | undefined
  ],
  createTaskCard: (
    currentMetric: Metric,
    recordMetadata?: LatestRecordMetadata
  ) => TaskCardMetadata
) => {
  const metricFrequency = metric.custom_frequency || metric.frequency;
  const startingMonth = metric.starting_month;
  const [latestMonthlyRecord, latestAnnualRecord] = recordMetadatas;
  /** Create Task Card linked to the latest Monthly Record */
  if (metricFrequency === "MONTHLY") {
    return createTaskCard(metric, latestMonthlyRecord());
  }
  /** Create Task Card linked to the latest Annual Record */
  return createTaskCard(metric, latestAnnualRecord(startingMonth as number));
};
