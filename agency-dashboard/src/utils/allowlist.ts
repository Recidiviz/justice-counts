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
  "Alabama Department of Corrections": true,
  "Alaska Department of Corrections": true,
  "Arizona Department of Corrections, Rehabilitation & Reentry": true,
  "Arkansas Department of Correction": true,
  "California Department of Corrections and Rehabilitation": true,
  "Colorado Department of Corrections": true,
  "Connecticut Department of Correction": true,
  "Delaware Department of Correction": true,
  "District of Columbia Department of Corrections": true,
  "Florida Department of Corrections": true,
  "Georgia Department of Corrections": true,
  "Hawaii Department of Public Safety": true,
  "Idaho Department of Correction": true,
  "Illinois Department of Corrections": true,
  "Indiana Department of Correction": true,
  "Iowa Department of Corrections": true,
  "Kansas Department of Corrections": true,
  "Kentucky Department of Corrections": true,
  "Louisiana Department of Public Safety & Corrections": true,
  "Maine Department of Corrections": true,
  "Maryland Department of Public Safety and Correctional Services": true,
  "Massachusetts Department of Correction": true,
  "Michigan Department of Corrections": true,
  "Minnesota Department of Corrections": true,
  "Mississippi Department of Corrections": true,
  "Missouri Department of Corrections": true,
  "Montana Department of Corrections": true,
  "Nebraska Department of Correctional Services": true,
  "Nevada Department of Corrections": true,
  "New Hampshire Department of Corrections": true,
  "New Jersey Department of Corrections": true,
  "New Mexico Corrections Department": true,
  "New York State Department of Corrections and Community Supervision": true,
  "North Carolina Department of Public Safety": true,
  "North Dakota Department of Corrections and Rehabilitation": true,
  "Ohio Department of Rehabilitation and Correction": true,
  "Oklahoma Department of Corrections": true,
  "Oregon Department of Corrections": true,
  "Pennsylvania Department of Corrections": true,
  "Rhode Island Department of Corrections": true,
  "South Carolina Department of Corrections": true,
  "South Dakota Department of Corrections": true,
  "Tennessee Department of Correction": true,
  "Texas Department of Criminal Justice": true,
  "Utah Department of Corrections": true,
  "Vermont Department of Corrections": true,
  "Virginia Department of Corrections": true,
  "Washington State Department of Corrections": true,
  "West Virginia Division of Corrections and Rehabilitation": true,
  "Wisconsin Department of Corrections": true,
  "Wyoming Department of Corrections": true,
};

export const isAllowListed = ({ name }: UserAgency): boolean | undefined =>
  ALLOW_LIST[name];
