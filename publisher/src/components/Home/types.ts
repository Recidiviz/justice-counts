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
  AgencySystems,
  Metric,
  Report,
  ReportFrequency,
  ReportStatus,
} from "@justice-counts/common/types";

export const taskCardLabelsActionLinks: TaskCardActionLinksMetadataList = {
  publish: { label: "Publish", path: "records/" },
  uploadData: { label: "Upload Data", path: "upload" },
  manualEntry: { label: "Manual Entry", path: "records/" },
  metricAvailability: {
    label: "Set Metric Availability",
    path: "metric-config",
  },
};

export type LatestRecordsAgencyMetrics = {
  agency_metrics: Metric[];
  annual_reports: { [key: string]: Report };
  monthly_report: Report;
};

export type TaskCardMetadata = {
  key: string;
  title: string;
  description: string;
  recordID?: number;
  actionLinks?: TaskCardActionLinksMetadata[];
  metricFrequency?: ReportFrequency;
  metricSettingsParams?: string;
  hasMetricValue?: boolean;
  status?: ReportStatus;
  metricKey?: string;
};

export type TaskCardActionLinksMetadata = { label: string; path: string };

export type TaskCardActionLinksMetadataList = {
  [key: string]: TaskCardActionLinksMetadata;
};

export type LatestRecordMetadata = {
  id: number;
  metrics: { [key: string]: Metric[] };
  status: ReportStatus;
  recordTitle: string;
};

export type AnnualRecordMetadata = {
  [startingMonth: string]: LatestRecordMetadata;
};

export type LatestAnnualMonthlyRecordMetadata = {
  monthly: LatestRecordMetadata;
  annual: AnnualRecordMetadata;
};

export type PublishMetricsTaskCardMetadatas = {
  MONTHLY: TaskCardMetadata[];
  ANNUAL: TaskCardMetadata[];
};

export type TaskCardMetadataValueConfigurationGroup = {
  publishMetricsTaskCardMetadatas: PublishMetricsTaskCardMetadatas;
  addDataConfigureMetricsTaskCardMetadatas: TaskCardMetadata[];
};

export type SystemSelectionOptions = AgencySystems | "ALL";
