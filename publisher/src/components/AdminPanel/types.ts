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

export enum Environment {
  LOCAL = "local",
  STAGING = "staging",
  PRODUCTION = "production",
}

export enum Setting {
  USERS = "USERS",
  AGENCIES = "AGENCIES",
}

export type EnvironmentType = `${Environment}`;

export type SettingType = `${Setting}`;

export type AgencyTeamMember = {
  auth0_user_id: string;
  name: string;
  email: string;
  invitation_status: "NOT_SENT" | "PENDING" | "ACCEPTED" | "ERRORED";
  role: string;
};

export type Agency = {
  id: number;
  name: string;
  systems: string[];
  state_code: string;
  fips_county_code?: string;
  team: AgencyTeamMember[];
  super_agency_id: number;
  is_superagency: boolean;
  is_dashboard_enabled: boolean;
};

export type User = {
  id: string;
  auth0_user_id: string;
  email: string;
  name: string;
  agencies: Agency[];
};

export const UserProvisioningActions = {
  ADD: "ADD",
  DELETE: "DELETE",
} as const;

export type UserProvisioningAction =
  (typeof UserProvisioningActions)[keyof typeof UserProvisioningActions];

export const AgencyListTypes = {
  CURRENT: "CURRENT",
  ADDED: "ADDED",
} as const;

export type AgencyListType =
  (typeof AgencyListTypes)[keyof typeof AgencyListTypes];
