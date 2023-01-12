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

import {
  Metric,
  MetricConfigurationSettingsOptions,
  MetricContext,
  ReportFrequency,
} from "@justice-counts/common/types";

export type MetricSettings = {
  key: string;
  enabled?: boolean;
  settings?: { key: string; included: MetricConfigurationSettingsOptions }[];
  contexts?: {
    key: string;
    value: MetricContext["value"];
  }[];
  disaggregations?: {
    key: string;
    enabled?: boolean;
    dimensions?: {
      key: string;
      enabled?: boolean;
      settings?: {
        key: string;
        included: MetricConfigurationSettingsOptions;
      }[];
    }[];
  }[];
};

export type UpdatedDimension = {
  key: string;
  label: string;
  enabled: boolean;
  race: Races;
  ethnicity: Ethnicities;
};

export type UpdatedDisaggregation = {
  key: string;
  disaggregations: {
    key: string;
    dimensions: UpdatedDimension[];
  }[];
};

export const races = [
  "American Indian / Alaskan Native",
  "Asian",
  "Black",
  "Native Hawaiian / Pacific Islander",
  "White",
  "More than one race",
  "Other",
  "Unknown",
] as const;
export type Races = typeof races[number];

export const ethnicities = [
  "Hispanic",
  "Not Hispanic",
  "Unknown Ethnicity",
] as const;
export type Ethnicities = typeof ethnicities[number];

export enum ChartView {
  Chart = "CHART",
  Table = "TABLE",
}

export type MetricInfo = {
  enabled?: boolean;
  label?: string;
  description?: Metric["description"];
  defaultFrequency?: ReportFrequency;
  customFrequency?: Metric["custom_frequency"];
  startingMonth?: Metric["starting_month"] | null;
  disaggregatedBySupervisionSubsystems?: boolean;
};

export type ReportFrequencyUpdate = {
  defaultFrequency?: ReportFrequency;
  customFrequency?: ReportFrequency;
  startingMonth?: number | null;
};
