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

import { UserAgency } from "@justice-counts/common/types";

export const ALLOW_LIST: Record<string, boolean> = {
  "Puerto Rico Department of Corrections": true,
  "Louisiana Department Of Public Safety & Corrections": true,
  "Nebraska Department Of Correctional Services": true,
  "New Hampshire Department Of Corrections": true,
  "Massachusetts Department of Correction": true,
  "New York State Department of Corrections And Community Supervision": true,
  "Wisconsin Department of Corrections": true,
};

export const isAllowListed = ({ name }: UserAgency): boolean | undefined =>
  ALLOW_LIST[name];
