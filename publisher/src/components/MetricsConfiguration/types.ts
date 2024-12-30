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
  ConfigurationStatus,
  Metric,
  MetricConfigurationSettings,
  MetricConfigurationSettingsOptions,
  MetricContext,
  MetricDimensionContext,
  MetricDisaggregationContext,
  ReportFrequency,
} from "@justice-counts/common/types";

import { Ethnicity, Race } from "./RaceEthnicitiesGridStates";

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
    contexts?: MetricDisaggregationContext[];
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

export type MetricInfo = {
  key?: string;
  enabled?: boolean | null;
  is_includes_excludes_configured?: ConfigurationStatus | null;
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

export type SettingsByIncludesExcludesKey = {
  [includesExcludesKey: string]: {
    description?: string;
    settings: {
      [settingKey: string]: Partial<MetricConfigurationSettings>;
    };
  };
};

export type Dimensions = {
  [dimensionKey: string]: {
    enabled?: boolean | null;
    label?: string;
    description?: string;
    contexts?: MetricDimensionContext[];
    key?: string;
    race?: Races;
    ethnicity?: Ethnicities;
    is_dimension_includes_excludes_configured?: ConfigurationStatus | null;
  };
};

export type DimensionSettings = {
  [dimensionKey: string]: SettingsByIncludesExcludesKey;
};

export type ContextsByContextKey = {
  [contextKey: string]: { label: string; value: string };
};

export type UpdatedDimension = {
  key: string;
  label: string;
  enabled: boolean;
  race: Races;
  ethnicity: Ethnicities;
  contexts?: MetricDimensionContext[];
};

export type UpdatedDisaggregation = {
  key: string;
  disaggregations: {
    key: string;
    contexts?: MetricDisaggregationContext[];
    dimensions: UpdatedDimension[];
  }[];
};

export const races = [...Object.values(Race)] as const;
export type Races = (typeof races)[number];

export const ethnicities = [...Object.values(Ethnicity)] as const;
export type Ethnicities = (typeof ethnicities)[number];
