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

import { AgencySystems, AgencyTeamMember } from "@justice-counts/common/types";
import { removeSnakeCase } from "@justice-counts/common/utils";
import { makeAutoObservable, runInAction } from "mobx";

import {
  Agency,
  AgencyProvisioningUpdates,
  AgencyResponse,
  AgencyTeamUpdates,
  AgencyWithTeamByID,
  FipsCountyCodeKey,
  FipsCountyCodes,
  SearchableEntity,
  SearchableListItem,
  StateCodeKey,
  StateCodesToStateNames,
  User,
  UserProvisioningUpdates,
  UserResponse,
  UserWithAgenciesByID,
} from "../components/AdminPanel";
import { groupBy } from "../utils";
import API from "./API";

const initialEmptyUserProvisioningUpdates = {
  user_account_id: null,
  name: "",
  email: "",
  agency_ids: [],
};

const initialEmptyAgencyProvisioningUpdates = {
  agency_id: undefined,
  name: "",
  state_code: null,
  fips_county_code: null,
  systems: [],
  is_dashboard_enabled: true,
  super_agency_id: null,
  is_superagency: null,
  child_agency_ids: [],
  team: [],
};

class AdminPanelStore {
  api: API;

  loading: boolean;

  usersByID: Record<string, UserWithAgenciesByID[]>;

  agenciesByID: Record<string, AgencyWithTeamByID[]>;

  systems: AgencySystems[];

  userProvisioningUpdates: UserProvisioningUpdates;

  agencyProvisioningUpdates: AgencyProvisioningUpdates;

  constructor(api: API) {
    makeAutoObservable(this, {}, { autoBind: true });
    this.api = api;
    this.loading = true;
    this.usersByID = {};
    this.agenciesByID = {};
    this.systems = [];
    this.userProvisioningUpdates = initialEmptyUserProvisioningUpdates;
    this.agencyProvisioningUpdates = initialEmptyAgencyProvisioningUpdates;
  }

  get users(): UserWithAgenciesByID[] {
    return AdminPanelStore.objectToSortedFlatMappedValues(this.usersByID);
  }

  get agencies(): AgencyWithTeamByID[] {
    return AdminPanelStore.objectToSortedFlatMappedValues(this.agenciesByID);
  }

  get searchableSystems(): SearchableListItem[] {
    return this.systems.map((system) => ({
      id: system,
      name: removeSnakeCase(system.toLocaleLowerCase()),
    }));
  }

  /** Returns a list of searchable counties based on the currently selected `state_code` in `agencyProvisioningUpdates` */
  get searchableCounties(): SearchableListItem[] {
    if (!this.agencyProvisioningUpdates.state_code) return [];
    return Object.keys(FipsCountyCodes)
      .filter(
        (countyCode) =>
          this.agencyProvisioningUpdates.state_code &&
          countyCode.startsWith(this.agencyProvisioningUpdates.state_code)
      )
      .map((countyCode) => {
        const lowercaseCountyCode =
          countyCode.toLocaleLowerCase() as FipsCountyCodeKey;
        return {
          id: countyCode,
          name: FipsCountyCodes[lowercaseCountyCode],
        };
      });
  }

  async fetchUsers() {
    try {
      const response = (await this.api.request({
        path: `/admin/user`,
        method: "GET",
      })) as Response;
      const data = (await response.json()) as UserResponse;

      if (response.status !== 200) {
        throw new Error("There was an issue fetching users.");
      }

      /** Hydrate store with a list of users grouped by user ID (and a list of their agencies grouped by agency ID) from response  */
      runInAction(() => {
        this.usersByID = groupBy(
          data.users.map((user) => ({
            ...user,
            agencies: groupBy(user.agencies, (agency) => agency.id),
          })),
          (user) => user.id
        );
      });
    } catch (error) {
      if (error instanceof Error) return new Error(error.message);
    }
  }

  async fetchAgencies() {
    try {
      const response = (await this.api.request({
        path: `/admin/agency`,
        method: "GET",
      })) as Response;
      const data = (await response.json()) as AgencyResponse;

      if (response.status !== 200) {
        throw new Error("There was an issue fetching agencies.");
      }

      /**
       * Hydrate store with a list of systems and a list of agencies grouped by agency ID (and a list of
       * their team members grouped by user ID) from response
       */
      runInAction(() => {
        this.agenciesByID = groupBy(
          data.agencies.map((agency) => ({
            ...agency,
            team: groupBy(
              agency.team,
              (member) => member.user_account_id || member.auth0_user_id
            ),
          })),
          (agency) => agency.id
        );
        this.systems = data.systems;
      });
    } catch (error) {
      if (error instanceof Error) return new Error(error.message);
    }
  }

  fetchUsersAndAgencies() {
    this.fetchUsers();
    this.fetchAgencies();
    runInAction(() => {
      this.loading = false;
    });
  }

  /** User Provisioning */

  updateUserID(userAccountID: string | number) {
    this.userProvisioningUpdates.user_account_id = userAccountID;
  }

  updateUsername(username: string) {
    this.userProvisioningUpdates.name = username;
  }

  updateEmail(email: string) {
    this.userProvisioningUpdates.email = email;
  }

  updateUserAgencies(agencies: number[]) {
    this.userProvisioningUpdates.agency_ids = agencies;
  }

  resetUserProvisioningUpdates() {
    this.userProvisioningUpdates = initialEmptyUserProvisioningUpdates;
  }

  updateUsers(userResponse: UserResponse) {
    const user = userResponse.users[0];
    const userWithGroupedAgencies = {
      ...user,
      agencies: groupBy(user.agencies, (agency) => agency.id),
    };
    this.usersByID[user.id] = [userWithGroupedAgencies];
  }

  async saveUserProvisioningUpdates() {
    try {
      const response = (await this.api.request({
        path: `/admin/user`,
        method: "PUT",
        body: { users: [this.userProvisioningUpdates] },
      })) as Response;
      const userResponse = (await response.json()) as UserResponse;

      if (response.status !== 200) {
        throw new Error("There was an issue saving user provisioning updates.");
      }

      runInAction(() => this.updateUsers(userResponse));
      return response.status;
    } catch (error) {
      if (error instanceof Error) return new Error(error.message);
    }
  }

  /** Agency Provisioning */

  updateAgencyID(id: number) {
    this.agencyProvisioningUpdates.agency_id = id;
  }

  updateAgencyName(name: string) {
    this.agencyProvisioningUpdates.name = name;
  }

  updateStateCode(stateCode: StateCodeKey | null) {
    const lowercaseStateCode = stateCode?.toLocaleLowerCase() as StateCodeKey;
    this.agencyProvisioningUpdates.state_code = lowercaseStateCode;
  }

  updateCountyCode(countyCode: FipsCountyCodeKey | null) {
    const lowercaseCountyCode =
      countyCode?.toLocaleLowerCase() as FipsCountyCodeKey;
    this.agencyProvisioningUpdates.fips_county_code =
      lowercaseCountyCode || null;
  }

  updateSystems(systems: AgencySystems[]) {
    this.agencyProvisioningUpdates.systems = systems;
  }

  updateIsDashboardEnabled(isDashboardEnabled: boolean | null) {
    this.agencyProvisioningUpdates.is_dashboard_enabled = isDashboardEnabled;
  }

  updateIsSuperagency(isSuperagency: boolean | null) {
    this.agencyProvisioningUpdates.is_superagency = isSuperagency;
  }

  updateSuperagencyID(superagencyID: number | null) {
    this.agencyProvisioningUpdates.super_agency_id = superagencyID;
  }

  updateChildAgencyIDs(childAgencyIDs: number[]) {
    this.agencyProvisioningUpdates.child_agency_ids = childAgencyIDs;
  }

  updateTeamMembers(team: AgencyTeamUpdates[]) {
    this.agencyProvisioningUpdates.team = team;
  }

  resetAgencyProvisioningUpdates() {
    this.agencyProvisioningUpdates = initialEmptyAgencyProvisioningUpdates;
  }

  updateAgencies(agencyResponse: Agency) {
    const agency = agencyResponse;
    const agencyWithGroupedTeams = {
      ...agency,
      team: groupBy(
        agency.team,
        (member) => member.user_account_id || member.auth0_user_id
      ),
    };
    this.agenciesByID[agency.id] = [agencyWithGroupedTeams];
  }

  async saveAgencyProvisioningUpdates() {
    try {
      const response = (await this.api.request({
        path: `/admin/agency`,
        method: "PUT",
        body: this.agencyProvisioningUpdates,
      })) as Response;
      const agencyResponse = (await response.json()) as Agency;

      if (response.status !== 200) {
        throw new Error(
          "There was an issue saving agency provisioning updates."
        );
      }

      runInAction(() => this.updateAgencies(agencyResponse));
      return response.status;
    } catch (error) {
      if (error instanceof Error) return new Error(error.message);
    }
  }

  /** Helpers  */

  /**
   * Returns a normalized list of state codes & state name.
   */
  static get searchableStates(): SearchableListItem[] {
    return Object.keys(StateCodesToStateNames).map((stateCode) => {
      const lowercaseStateCode = stateCode.toLocaleLowerCase() as StateCodeKey;
      return {
        id: stateCode,
        name: StateCodesToStateNames[lowercaseStateCode],
      };
    });
  }

  /**
   * Sorts a list of agencies/users in ascending/descending alphabetical order.
   * @param list - The array of agency/user objects.
   * @param order - The sorting order - either "ascending" or "descending". Defaults to ascending order.
   * @returns A sorted array of agency objects.
   */
  static sortListByName<
    T extends
      | Agency
      | User
      | UserWithAgenciesByID
      | AgencyWithTeamByID
      | AgencyTeamMember
  >(list: T[], order: "ascending" | "descending" = "ascending"): T[] {
    return list.sort((a, b) => {
      if (order === "descending") {
        return b.name.localeCompare(a.name);
      }
      return a.name.localeCompare(b.name);
    });
  }

  /**
   * Returns a filtered array of objects for a given string within specified keys.
   * @param list - The array of objects to search.
   * @param searchInput - The string to search for.
   * @param searchByKeys - The keys to search within each object.
   * @returns An array of objects that match the search criteria.
   */
  static searchList<T extends SearchableEntity>(
    list: T[],
    searchInput: string,
    searchByKeys: (keyof T)[]
  ) {
    const regex = new RegExp(`${searchInput}`, `i`);
    return list.filter((listItem) =>
      searchByKeys.some(
        (key) => listItem[key] && regex.test(listItem[key] as string)
      )
    );
  }

  /**
   * Converts an object grouped by IDs (via the `groupBy` function) into a sorted, flat mapped array of the object's values.
   * @param obj - The object created by the `groupBy` function to convert
   * @returns A sorted array of the object's values
   */
  static objectToSortedFlatMappedValues<
    T extends
      | Agency
      | AgencyWithTeamByID
      | UserWithAgenciesByID
      | AgencyTeamMember
  >(obj: Record<string, T[]>) {
    return AdminPanelStore.sortListByName(
      Object.values(obj).flatMap((item) => item)
    );
  }
}

export default AdminPanelStore;
