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

import { NavigateFunction } from "react-router-dom";

import { REPORTS_CAPITALIZED, REPORTS_LOWERCASE } from "../Global/constants";

/**
 * Creates an array of button metadata (labels and onClick redirect)
 * used by the publish review success modal's `buttons` prop.
 * @param agencyId - the agency's ID to include in the navigation path.
 * @param navigate - callback function for navigating with react-router-dom.
 * @returns an array of objects with properties { label, onClick }.
 */
export const createPublishSuccessModalButtons = (
  agencyId: string | number,
  navigate: NavigateFunction
) => [
  {
    label: "Go Home",
    onClick: () => navigate(`/agency/${agencyId}`),
  },
  {
    label: `Go to ${REPORTS_CAPITALIZED}`,
    onClick: () => navigate(`/agency/${agencyId}/${REPORTS_LOWERCASE}`),
  },
  {
    label: "View Data",
    onClick: () => navigate(`/agency/${agencyId}/data`),
  },
];
