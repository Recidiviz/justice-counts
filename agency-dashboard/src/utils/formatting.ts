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

import { splitUtcString } from "@justice-counts/common/components/DataViz/utils";
import { Datapoint } from "@justice-counts/common/types";
import { formatNumberInput } from "@justice-counts/common/utils";

// =============================================================================
export const slugify = (str: string): string =>
  str?.replace(/\s/g, "-")?.toLowerCase();

export const getDatapointYear = (datapoint: Datapoint) => {
  const [, , , year] = splitUtcString(datapoint.start_date);
  return year;
};

export const renderPercentText = (
  val: number | string | null,
  maxValue: number
) => {
  if (typeof val !== "number") {
    return "Not Recorded";
  }

  let percentText = `${val !== 0 ? Math.round((val / maxValue) * 100) : 0}%`;
  // handle case of non-zero being rounded down to 0%
  if (percentText === "0%" && val !== 0) {
    percentText = "<1%";
  }
  return `${formatNumberInput(val.toString())} (${percentText})`;
};
