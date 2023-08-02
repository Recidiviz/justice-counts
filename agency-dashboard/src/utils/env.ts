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

enum envRegexes {
  PRODUCTION = "/dashboard.justice-counts.org/i",
  STAGING = "/dashboard-staging.justice-counts.org/i",
}

export const getEnv = () => {
  if (new RegExp(envRegexes.PRODUCTION).test(window.location.host)) {
    return "production";
  }
  if (new RegExp(envRegexes.STAGING).test(window.location.host)) {
    return "staging";
  }
  return "development";
};
