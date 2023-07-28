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

export const ALLOW_LIST = [
  "Alabama Department of Corrections",
  "Alaska Department of Corrections",
  "Arizona Department of Corrections, Rehabilitation & Reentry",
  "Arkansas Department of Correction",
  "California Department of Corrections and Rehabilitation",
  "Colorado Department of Corrections",
  "Connecticut Department of Correction",
  "Delaware Department of Correction",
  "District of Columbia Department of Corrections",
  "Florida Department of Corrections",
  "Georgia Department of Corrections",
  "Hawaii Department of Public Safety",
  "Idaho Department of Correction",
  "Illinois Department of Corrections",
  "Indiana Department of Correction",
  "Iowa Department of Corrections",
  "Kansas Department of Corrections",
  "Kentucky Department of Corrections",
  "Louisiana Department of Public Safety & Corrections",
  "Maine Department of Corrections",
  "Maryland Department of Public Safety and Correctional Services",
  "Massachusetts Department of Correction",
  "Michigan Department of Corrections",
  "Minnesota Department of Corrections",
  "Mississippi Department of Corrections",
  "Missouri Department of Corrections",
  "Montana Department of Corrections",
  "Nebraska Department of Correctional Services",
  "Nevada Department of Corrections",
  "New Hampshire Department of Corrections",
  "New Jersey Department of Corrections",
  "New Mexico Corrections Department",
  "New York State Department of Corrections and Community Supervision",
  "North Carolina Department of Public Safety",
  "North Dakota Department of Corrections and Rehabilitation",
  "Ohio Department of Rehabilitation and Correction",
  "Oklahoma Department of Corrections",
  "Oregon Department of Corrections",
  "Pennsylvania Department of Corrections",
  "Rhode Island Department of Corrections",
  "South Carolina Department of Corrections",
  "South Dakota Department of Corrections",
  "Tennessee Department of Correction",
  "Texas Department of Criminal Justice",
  "Utah Department of Corrections",
  "Vermont Department of Corrections",
  "Virginia Department of Corrections",
  "Washington State Department of Corrections",
  "West Virginia Division of Corrections and Rehabilitation",
  "Wisconsin Department of Corrections",
  "Wyoming Department of Corrections",
];

export const isAllowListed = ({ name }: UserAgency) =>
  ALLOW_LIST.includes(name);
