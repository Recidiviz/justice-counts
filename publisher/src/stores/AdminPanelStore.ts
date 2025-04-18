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

import {
  AgencySystem,
  AgencySystems,
  AgencyTeamMember,
  AgencyTeamMemberRole,
} from "@justice-counts/common/types";
import { removeSnakeCase } from "@justice-counts/common/utils";
import { makeAutoObservable, runInAction } from "mobx";

import {
  Agency,
  AgencyMetric,
  AgencyMetricResponse,
  AgencyProvisioningUpdates,
  AgencyResponse,
  AgencyTeamUpdates,
  AgencyWithTeamByID,
  BreakdownSettings,
  BreakdownSettingsUpdates,
  Environment,
  ErrorResponse,
  FipsCountyCodeKey,
  FipsCountyCodes,
  ReportingAgency,
  ReportingAgencyMetadata,
  SearchableEntity,
  SearchableListItem,
  StateCodeKey,
  StateCodesToStateNames,
  User,
  UserProvisioningUpdates,
  UserResponse,
  UserWithAgenciesByID,
  Vendor,
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
  is_stepping_up_agency: null,
  super_agency_id: null,
  is_superagency: null,
  child_agency_ids: [],
  team: [],
  agency_description: null,
  agency_url: null,
};

class AdminPanelStore {
  api: API;

  loading: boolean;

  usersByID: Record<string, UserWithAgenciesByID[]>;

  agenciesByID: Record<string, AgencyWithTeamByID[]>;

  systems: AgencySystem[];

  metrics: AgencyMetric[];

  vendors: Vendor[];

  reportingAgencyMetadata?: ReportingAgencyMetadata;

  reportingAgenciesUpdates: ReportingAgency[];

  agencyBreakdownSettings: BreakdownSettings[];

  breakdownSettingsUpdates: BreakdownSettingsUpdates[];

  userProvisioningUpdates: UserProvisioningUpdates;

  agencyProvisioningUpdates: AgencyProvisioningUpdates;

  userResponse?: UserResponse;

  agencyResponse?: Agency;

  userAgenciesLoading: boolean;

  teamMemberListLoading: boolean;

  reportingAgencyMetadataLoading: boolean;

  constructor(api: API) {
    makeAutoObservable(this, {}, { autoBind: true });
    this.api = api;
    this.loading = true;
    this.usersByID = {};
    this.agenciesByID = {};
    this.systems = [];
    this.metrics = [];
    this.vendors = [];
    this.reportingAgenciesUpdates = [];
    this.userProvisioningUpdates = initialEmptyUserProvisioningUpdates;
    this.agencyProvisioningUpdates = initialEmptyAgencyProvisioningUpdates;
    this.agencyBreakdownSettings = [];
    this.breakdownSettingsUpdates = [];
    this.userAgenciesLoading = false;
    this.teamMemberListLoading = false;
    this.reportingAgencyMetadataLoading = false;
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

  get searchableMetrics(): SearchableListItem[] {
    return this.metrics
      .filter((metric) => metric.sector !== AgencySystems.SUPERAGENCY)
      .map((metric) => ({
        ...metric,
        id: metric.key,
        sectors: metric.sector,
        name: `${metric.name}: ${metric.sector.toLocaleLowerCase()}`,
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

  async fetchUsersOverview() {
    try {
      const response = (await this.api.request({
        path: `/admin/user/overview`,
        method: "GET",
      })) as Response;
      const data = (await response.json()) as UserResponse;

      if (response.status !== 200) {
        throw new Error("There was an issue fetching users.");
      }

      /** Hydrate store with a list of users grouped by user ID from response  */
      runInAction(() => {
        this.usersByID = groupBy(
          data.users.map((user) => ({
            ...user,
            agencies: {}, // Agency associations will be fetched when a User Panel is opened.
          })),
          (user) => user.id
        );
      });
    } catch (error) {
      if (error instanceof Error) return new Error(error.message);
    }
  }

  async fetchUserAgencies(userId: string) {
    try {
      this.userAgenciesLoading = true;

      const response = (await this.api.request({
        path: `/admin/user/${userId}/agencies`,
        method: "GET",
      })) as Response;

      const data = (await response.json()) as { agencies: Agency[] };

      if (response.status !== 200) {
        throw new Error("There was an issue fetching the user's agencies.");
      }

      const userAgenciesGroupedByID = groupBy(
        data.agencies,
        (agency) => agency.id
      );

      runInAction(() => {
        const existingUser = this.usersByID[userId]?.[0] || {};

        this.usersByID = {
          ...this.usersByID,
          [userId]: [
            {
              ...existingUser,
              agencies: userAgenciesGroupedByID, // Update only the agencies field.
            },
          ],
        };

        this.userAgenciesLoading = false;
      });
    } catch (error) {
      if (error instanceof Error) {
        return new Error(error.message);
      }
    }
  }

  async fetchAgenciesOverview() {
    try {
      const response = (await this.api.request({
        path: `/admin/agency/overview`,
        method: "GET",
      })) as Response;
      const data = (await response.json()) as AgencyResponse;

      if (response.status !== 200) {
        throw new Error("There was an issue fetching agencies.");
      }

      /**
       * Hydrate store with a list of systems and a list of agencies grouped by agency
       * ID from response
       */
      runInAction(() => {
        this.agenciesByID = groupBy(
          data.agencies.map((agency) => ({
            ...agency,
            team: {}, // Team associations will be fetched when an Agency Panel is opened.
          })),
          (agency) => agency.id
        );
        this.systems = data.systems;
      });
    } catch (error) {
      if (error instanceof Error) return new Error(error.message);
    }
  }

  async fetchAgencyTeam(agencyID: string) {
    try {
      this.teamMemberListLoading = true;

      const response = (await this.api.request({
        path: `/admin/agency/${agencyID}/team`,
        method: "GET",
      })) as Response;
      const data = (await response.json()) as { team: AgencyTeamMember[] };

      if (response.status !== 200) {
        throw new Error("There was an issue fetching agency teams.");
      }
      const updatedTeam = groupBy(
        data.team,
        (member) => member.user_account_id || member.auth0_user_id
      );

      // Only update the team field in the agency object without overwriting other fields.
      runInAction(() => {
        const existingAgency = this.agenciesByID[agencyID]?.[0] || {};
        this.agenciesByID = {
          ...this.agenciesByID,
          [agencyID]: [
            {
              ...existingAgency,
              team: updatedTeam, // Update only the team field
            },
          ],
        };
        this.teamMemberListLoading = false;
      });
    } catch (error) {
      if (error instanceof Error) return new Error(error.message);
    }
  }

  async fetchAgencyMetrics(agencyID: string) {
    try {
      const response = (await this.api.request({
        path: `/admin/agency/${agencyID}`,
        method: "GET",
      })) as Response;
      const data = (await response.json()) as AgencyMetricResponse;

      if (response.status !== 200) {
        throw new Error("There was an issue fetching agency metrics.");
      }

      runInAction(() => {
        this.metrics = data.metrics;
      });
    } catch (error) {
      if (error instanceof Error) return new Error(error.message);
    }
  }

  async fetchVendors() {
    try {
      const response = (await this.api.request({
        path: `admin/vendors`,
        method: "GET",
      })) as Response;
      const data = (await response.json()) as Vendor[];

      if (response.status !== 200) {
        throw new Error("There was an issue fetching vendors.");
      }

      runInAction(() => {
        this.vendors = data;
      });
    } catch (error) {
      if (error instanceof Error) return new Error(error.message);
    }
  }

  async fetchReportingAgency(agencyID: string) {
    try {
      runInAction(() => {
        this.reportingAgencyMetadataLoading = true;
      });

      const response = (await this.api.request({
        path: `admin/agency/${agencyID}/reporting-agency`,
        method: "GET",
      })) as Response;
      const data = (await response.json()) as ReportingAgencyMetadata;

      if (response.status !== 200) {
        throw new Error("There was an issue fetching reporting agency.");
      }

      runInAction(() => {
        this.reportingAgencyMetadata = data;
        this.reportingAgencyMetadataLoading = false;
      });
    } catch (error) {
      if (error instanceof Error) return new Error(error.message);
    }
  }

  async fetchBreakdownSettings(agencyID: string) {
    try {
      const response = (await this.api.request({
        path: `admin/agency/${agencyID}/metric-setting`,
        method: "GET",
      })) as Response;
      const data = (await response.json()) as BreakdownSettings[];

      if (response.status !== 200) {
        throw new Error(
          "There was an issue fetching agency breakdown settings."
        );
      }

      runInAction(() => {
        this.agencyBreakdownSettings = data;
      });
    } catch (error) {
      if (error instanceof Error) return new Error(error.message);
    }
  }

  async fetchUsersAndAgencies() {
    await Promise.all([
      this.fetchUsersOverview(),
      this.fetchAgenciesOverview(),
      this.fetchVendors(),
    ]);
    runInAction(() => {
      this.loading = false;
    });
  }

  async copySuperagencyMetricSettingsToChildAgencies(
    superagencyID: string,
    agencyName: string,
    userEmail: string,
    metricDefinitionKeySubset: string[], // A list of metric definition keys for future use to update a subset of metrics
    childAgencyIdSubset: string[] // A list of child agencies ids for future use to update a subset of metrics
  ) {
    try {
      const response = (await this.api.request({
        path: `/admin/agency/${superagencyID}/child-agency/copy`,
        method: "POST",
        body: {
          agency_name: agencyName,
          user_email: userEmail,
          metric_definition_key_subset: metricDefinitionKeySubset,
          child_agency_id_subset: childAgencyIdSubset,
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

  async saveUserProvisioningUpdates(refetch?: boolean) {
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

        if (refetch) {
          await this.fetchUsersAndAgencies();
        }

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

  async deleteAgency(agencyID: string) {
    try {
      const response = (await this.api.request({
        path: `/admin/agency/${agencyID}`,
        method: "DELETE",
      })) as Response;
      if (response.status === 200) {
        runInAction(() => {
          const updatedAgenciesByID = { ...this.agenciesByID };
          delete updatedAgenciesByID[agencyID];
          this.agenciesByID = updatedAgenciesByID;
        });
      }
      return response;
    } catch (error) {
      if (error instanceof Error)
        return new Error(`There was an issue deleting agency ID ${agencyID}.`);
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

  updateAgencyDescription(description: string | null) {
    this.agencyProvisioningUpdates.agency_description = description;
  }

  updateAgencyURL(url: string | null) {
    this.agencyProvisioningUpdates.agency_url = url;
  }

  saveAgencyName(name: string) {
    this.agencyProvisioningUpdates.name = name
      .trim()
      .replaceAll(/\s+/gi, " ")
      .replaceAll("’", "'");
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

  updateIsSteppingUpAgency(isSteppingUpAgency: boolean | null) {
    this.agencyProvisioningUpdates.is_stepping_up_agency = isSteppingUpAgency;
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

  /** Metrics Reporting Agency */

  async saveReportingAgencies(
    agencyID: string,
    reportingAgencies: ReportingAgency[]
  ) {
    try {
      const response = (await this.api.request({
        path: `admin/agency/${agencyID}/reporting-agency`,
        method: "PUT",
        body: { reporting_agencies: reportingAgencies },
      })) as Response;
      const agenciesResponse = (await response.json()) as Response;

      if (response.status !== 200) {
        throw new Error(`There was an issue saving reporting agencies.`);
      }

      return agenciesResponse;
    } catch (error) {
      if (error instanceof Error) return new Error(error.message);
    }
  }

  updateReportingAgencies = (
    metricKey: string,
    reportingAgencyId: number,
    reportingAgencyName: string,
    isSelfReported: boolean
  ) => {
    const updatedEntry = {
      metric_key: metricKey,
      reporting_agency_id: reportingAgencyId,
      reporting_agency_name: reportingAgencyName,
      is_self_reported: isSelfReported,
    };

    const existingIndex = this.reportingAgenciesUpdates.findIndex(
      (item) => item.metric_key === metricKey
    );

    if (existingIndex !== -1) {
      // Update the existing object
      this.reportingAgenciesUpdates[existingIndex] = updatedEntry;
    } else {
      // Add a new object to the array
      this.reportingAgenciesUpdates.push(updatedEntry);
    }

    /** Return an object in the desired backend data structure */
    return {
      metric_key: metricKey,
      reporting_agency_id: reportingAgencyId,
      is_self_reported: isSelfReported,
    };
  };

  resetReportingAgenciesUpdates() {
    this.reportingAgenciesUpdates = [];
  }

  /** Agency Breakdown Settings */

  async saveBreakdownSettings(
    agencyID: string,
    updates: BreakdownSettingsUpdates[]
  ) {
    try {
      const response = (await this.api.request({
        path: `admin/agency/${agencyID}/metric-setting`,
        method: "PUT",
        body: { updates },
      })) as Response;
      const agenciesResponse = (await response.json()) as Response;

      if (response.status !== 200) {
        throw new Error(`There was an issue saving agency breakdown settings.`);
      }

      return agenciesResponse;
    } catch (error) {
      if (error instanceof Error) return new Error(error.message);
    }
  }

  updateBreakdownSettings = (
    breakdownSettings: BreakdownSettings[],
    inputMap: Record<string, string[]>
  ) => {
    const updates: BreakdownSettingsUpdates[] = [];

    breakdownSettings?.forEach((breakdown) =>
      breakdown.metric_settings.forEach((setting) => {
        const metricUpdates: BreakdownSettingsUpdates = {
          metric_key: setting.metric_key,
          breakdowns: [],
        };

        setting.disaggregations.forEach((disaggregation) => {
          disaggregation.other_sub_dimensions.forEach((dimension) => {
            const mapKey = `${setting.metric_key}_${dimension.dimension_name}`;
            const initialInputs = dimension.other_options;
            const currentInputs = inputMap[mapKey] || [];
            const cleanedInputs = currentInputs.map((x) => x.trim());

            const hasChanges =
              cleanedInputs.length !== (initialInputs.length || 0) ||
              cleanedInputs.some((val, index) => val !== initialInputs[index]);

            if (hasChanges) {
              metricUpdates.breakdowns.push({
                dimension_id: disaggregation.dimension_id,
                sub_dimensions: [
                  {
                    dimension_key: dimension.dimension_key,
                    other_options: cleanedInputs.filter(Boolean), // if empty, it's intentional
                  },
                ],
              });
            }
          });
        });

        if (metricUpdates.breakdowns.length > 0) {
          updates.push(metricUpdates);
        }
      })
    );

    runInAction(() => {
      this.breakdownSettingsUpdates = updates;
    });

    return updates;
  };

  /** Vendors Management */

  async addOrEditVendor(name: string, url: string, id?: number) {
    try {
      const response = (await this.api.request({
        path: `admin/vendors`,
        method: "PUT",
        body: { id: id ?? null, name, url },
      })) as Response;
      const vendorResponse = (await response.json()) as Vendor[];

      if (response.status !== 200) {
        throw new Error(
          `There was an issue ${id ? "editing" : "adding"} vendor.`
        );
      } else {
        await this.fetchVendors();
      }

      return vendorResponse;
    } catch (error) {
      if (error instanceof Error) return new Error(error.message);
    }
  }

  async deleteVendor(vendorID: number) {
    try {
      const response = (await this.api.request({
        path: `admin/vendors/${vendorID}`,
        method: "DELETE",
      })) as Response;

      await this.fetchVendors();

      return response;
    } catch (error) {
      if (error instanceof Error)
        return new Error(`There was an issue deleting vendor ID ${vendorID}.`);
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
