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

import {
  AgencySystem,
  AgencyTeamMember,
  AgencyTeamMemberRole,
} from "@justice-counts/common/types";
import { removeSnakeCase } from "@justice-counts/common/utils";
import { makeAutoObservable, runInAction } from "mobx";

import {
  Agency,
  AgencyProvisioningUpdates,
  AgencyResponse,
  AgencyTeamUpdates,
  AgencyWithTeamByID,
  Environment,
  ErrorResponse,
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
  agency_id: null,
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

  systems: AgencySystem[];

  userProvisioningUpdates: UserProvisioningUpdates;

  agencyProvisioningUpdates: AgencyProvisioningUpdates;

  userResponse?: UserResponse;

  agencyResponse?: Agency;

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

  get csgAndRecidivizUsers(): UserWithAgenciesByID[] {
    return this.users.filter(
      (user) =>
        user.email.includes("@csg.org") || user.email.includes("@recidiviz.org")
    );
  }

  /**
   * Returns the default role for CSG/Recidiviz users based on the agency's name and
   * current environment.
   * Production environment: READ_ONLY is the default role
   * Staging environment or DEMO agencies: JUSTICE_COUNTS_ADMIN is the default role
   */
  get csgAndRecidivizDefaultRole(): AgencyTeamMemberRole {
    const isStagingEnv = this.api.environment === Environment.STAGING;
    const agencyName = this.agencyProvisioningUpdates.name;
    const isDemoAgency =
      agencyName.includes("DEMO") || agencyName === "Department of Corrections";

    if (isStagingEnv || isDemoAgency) {
      return AgencyTeamMemberRole.JUSTICE_COUNTS_ADMIN;
    }

    return AgencyTeamMemberRole.READ_ONLY;
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

  get createdUserResponse(): UserResponse | undefined {
    return this.userResponse;
  }

  get createdAgencyResponse(): Agency | undefined {
    return this.agencyResponse;
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

  async fetchUsersAndAgencies() {
    await Promise.all([this.fetchUsers(), this.fetchAgencies()]);
    runInAction(() => {
      this.loading = false;
    });
  }

  async copySuperagencyMetricSettingsToChildAgencies(
    superagencyID: string,
    agencyName: string,
    userEmail: string,
    metricDefinitionKeySubset: string[] // A list of metric definition keys for future use to update a subset of metrics
  ) {
    try {
      const response = (await this.api.request({
        path: `/admin/agency/${superagencyID}/child-agency/copy`,
        method: "POST",
        body: {
          agency_name: agencyName,
          user_email: userEmail,
          metric_definition_key_subset: metricDefinitionKeySubset,
        },
      })) as Response;

      return response;
    } catch (error) {
      if (error instanceof Error)
        return new Error(
          "There was an issue copying metric settings from superagency to child agencies."
        );
    }
  }

  /** User Provisioning */

  setCreatedUserResponse(userResponse: UserResponse) {
    this.userResponse = userResponse;
  }

  updateUsername(username: string) {
    this.userProvisioningUpdates.name = username.trimStart();
  }

  updateEmail(email: string) {
    this.userProvisioningUpdates.email = email;
  }

  updateUserAccountId(id: number) {
    this.userProvisioningUpdates.user_account_id = id;
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
      const userResponse = (await response.json()) as
        | UserResponse
        | ErrorResponse;

      if (response.status === 200) {
        runInAction(() => {
          this.updateUsers(userResponse as UserResponse);
          this.setCreatedUserResponse(userResponse as UserResponse);
        });
        return response;
      }

      return userResponse;
    } catch (error) {
      if (error instanceof Error)
        return new Error(
          "There was an issue saving user provisioning updates."
        );
    }
  }

  async deleteUser(userID: string) {
    try {
      const response = (await this.api.request({
        path: `/admin/user/${userID}`,
        method: "DELETE",
      })) as Response;
      if (response.status === 200) {
        runInAction(() => {
          const updatedUsersByID = { ...this.usersByID };
          delete updatedUsersByID[userID];
          this.usersByID = updatedUsersByID;
        });
      }
      return response;
    } catch (error) {
      if (error instanceof Error)
        return new Error(`There was an issue deleting user ID ${userID}.`);
    }
  }

  /** Agency Provisioning */

  setCreatedAgencyResponse(agencyResponse: Agency) {
    this.agencyResponse = agencyResponse;
  }

  updateAgencyID(id: number) {
    this.agencyProvisioningUpdates.agency_id = id;
  }

  updateAgencyName(name: string) {
    this.agencyProvisioningUpdates.name = name;
  }

  saveAgencyName(name: string) {
    this.agencyProvisioningUpdates.name = name.trim().replaceAll(/s+/, " ");
    console.log(this.agencyProvisioningUpdates.name);
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

  updateSystems(systems: AgencySystem[]) {
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

  async saveAgencyProvisioningUpdates(refetch?: boolean) {
    try {
      const response = (await this.api.request({
        path: `/admin/agency`,
        method: "PUT",
        body: this.agencyProvisioningUpdates,
      })) as Response;
      const agencyResponse = (await response.json()) as Agency | ErrorResponse;

      if (response.status === 200) {
        runInAction(() =>
          this.setCreatedAgencyResponse(agencyResponse as Agency)
        );

        if (!refetch) {
          runInAction(() => this.updateAgencies(agencyResponse as Agency));
        } else {
          await this.fetchUsersAndAgencies();
        }

        return response;
      }

      return agencyResponse;
    } catch (error) {
      if (error instanceof Error)
        return new Error(
          "There was an issue saving agency provisioning updates."
        );
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
      | AgencyTeamMember,
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
    // Escape special characters in search input
    const sanitizedSearchInput = searchInput.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );
    const regex = new RegExp(`${sanitizedSearchInput}`, `i`);
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
      | AgencyTeamMember,
  >(obj: Record<string, T[]>) {
    return AdminPanelStore.sortListByName(
      Object.values(obj).flatMap((item) => item)
    );
  }
}

export default AdminPanelStore;
