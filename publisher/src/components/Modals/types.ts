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

import { REPORT_LOWERCASE, REPORT_UPPERCASE } from "../Global/constants";

export const ResourceTypes: Record<string, ResourceType> = {
  FILE: "FILE",
  RECORD: REPORT_UPPERCASE,
};
export const resourceTypeToDisplayName = {
  FILE: "file",
  RECORD: REPORT_LOWERCASE,
};

export type ResourceType = keyof typeof resourceTypeToDisplayName;
