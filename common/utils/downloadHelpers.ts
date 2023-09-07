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

import { Metric } from "@justice-counts/common/types";

export const downloadFeedData = async (
  system: string,
  agencyId: number | string,
  filename: string
) => {
  const a = document.createElement("a");
  a.href = `/feed/${agencyId}?system=${system}&metric=${filename}`;
  a.setAttribute("download", `${filename}.csv`);
  a.click();
  a.remove();
};

export const downloadMetricData = (
  metric: Metric,
  agencyId: number | string
) => {
  if (metric) {
    metric.filenames.forEach((fileName) => {
      downloadFeedData(metric.system.key, agencyId, fileName);
    });
  }
};
