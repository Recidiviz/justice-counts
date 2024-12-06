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

import { AgencySystems } from "@justice-counts/common/types";

export enum IncludesExcludesEnum {
  YES = "YES",
  NO = "NO",
}

export type IncludesExcludesWithDefault = {
  [key: string]: {
    label: string;
    default: IncludesExcludesEnum;
  };
};

export type AgencySystemKeys =
  | AgencySystems.COURTS_AND_PRETRIAL
  | AgencySystems.PAROLE
  | AgencySystems.PROBATION
  | AgencySystems.PRETRIAL_SUPERVISION
  | AgencySystems.OTHER_SUPERVISION;

export type AgencyIncludesExcludesType = {
  [key in AgencySystemKeys]: IncludesExcludesWithDefault;
};
