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

import { Dimensions, UpdatedDimension } from "./types";

/**
 * Sort Races from an `ethnicitiesByRace` object entries array in the following order:
 * 'American Indian / Alaskan Native', 'Asian', 'Black', 'Native Hawaiian / Pacific Islander', 'White', 'More than one race', 'Other', 'Unknown'
 */
export const sortRaces = (
  [a, _]: [
    string,
    {
      [ethnicity: string]: UpdatedDimension;
    }
  ],
  [b, __]: [
    string,
    {
      [ethnicity: string]: UpdatedDimension;
    }
  ]
) => {
  if (b === "More than one race" && (a === "Other" || a === "Unknown")) {
    return 0;
  }
  if (b === "More than one race" && a !== "Other" && a !== "Unknown") {
    return -1;
  }
  return 1;
};

/**  In some cases we can have multiple dimensions that starts with the word "Other",
 * however there could be only one fallback "Other" breakdown for the metric
 * and we assume that it is located at the end of the list according to logical flow and specificity
 * ("Other" and "Unknown" are typically catch-all or fallback options, used when none of the specific options are applicable or sufficient)
 */
export const getOtherDimensonKey = (dimensions: Dimensions) => {
  return Object.values(dimensions)
    .filter((d) => d.key?.startsWith("Other"))
    .pop()?.key as string;
};
