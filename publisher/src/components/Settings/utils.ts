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

import { AgencySystem } from "@justice-counts/common/types";

import { SettingsSearchParams } from "./types";

export const getActiveSystemMetricKey = ({
  system,
  metric,
}: SettingsSearchParams): string => {
  return `${system?.toUpperCase()}-${metric}`;
};

export const getSettingsSearchParams = (
  params: URLSearchParams
): SettingsSearchParams => {
  const system =
    (params.get("system")?.toUpperCase() as AgencySystem) || undefined;
  const metric = params.get("metric")?.toUpperCase() || undefined;

  return { system, metric };
};
