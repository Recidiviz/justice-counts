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
import { showToast } from "@justice-counts/common/components/Toast";
import {
  AgencyTeamMemberRole,
  DropdownAgency,
  UserAgency,
} from "@justice-counts/common/types";
import { makeAutoObservable, runInAction, when } from "mobx";

import { AuthStore } from "../components/Auth";
import API from "./API";

type UserSettingsRequestBody = {
  name: string | null;
  email: string | null;
};

class UserStore {
  authStore: AuthStore;

  api: API;

  dropdownAgencies: DropdownAgency[] | undefined;

  userAgencies: UserAgency[] | undefined;

  queriedAgencies: string[] = [];

  userId: string | undefined;

  userInfoLoaded: boolean;

  loadingError: boolean;

  constructor(authStore: AuthStore, api: API) {
    makeAutoObservable(this, {}, { autoBind: true });

    this.authStore = authStore;
    this.api = api;
    this.dropdownAgencies = undefined;
    this.userAgencies = undefined;
    this.userInfoLoaded = false;
    this.userId = undefined;
    this.loadingError = false;

    when(
      () => api.isSessionInitialized,
      () => this.updateAndRetrieveUserPermissionsAndAgencies()
    );
  }

  async updateUserNameAndEmail(
    name: string,
    email: string
  ): Promise<string | undefined> {
    try {
      const body: UserSettingsRequestBody = { name: null, email: null };
      const isNameUpdated = name !== this.authStore.user?.name;
      const isEmailUpdated = email !== this.authStore.user?.email;
      if (isNameUpdated) {
        body.name = name;
      }
      if (isEmailUpdated) {
        body.email = email;
      }
      const response = await this.api.request({
        path: "/api/users",
        method: "PATCH",
        body,
      });
      runInAction(() => {
        this.authStore.user = { ...this.authStore.user, name, email };
      });

      if (response && response instanceof Response) {
        if (response.status === 200 && isNameUpdated && !isEmailUpdated) {
          showToast({
            message: `Name was successfully updated to ${name}.`,
            check: true,
          });
          return;
        }
        if (response.status === 200 && isNameUpdated && isEmailUpdated) {
          showToast({
            message: `Name and email were successfully updated. You will be logged out. Please check your email at ${email} to verify your new email before logging in again.`,
            check: true,
            timeout: 4500,
          });
          return;
        }
        if (response.status === 200 && !isNameUpdated && isEmailUpdated) {
          showToast({
            message: `Email was successfully updated. You will be logged out. Please check your email at ${email} to verify your new email before logging in again.`,
            check: true,
            timeout: 4500,
          });
          return;
        }
        if (response.status !== 200) {
          showToast({
            message: "Failed to update user details.",
            color: "red",
          });
        }
      }
    } catch (error) {
      let errorMessage;
      if (error instanceof Error) {
        errorMessage = error.message;
      } else {
        errorMessage = String(error);
      }

      showToast({
        message: `Failed to update user details. ${errorMessage}`,
        color: "red",
      });
      return errorMessage;
    }
  }

  getInitialAgencyIdOld(): number | undefined {
    if (this.userAgencies && this.userAgencies.length > 0) {
      // attempting to access 0 index in the empty array leads to the mobx warning "[mobx] Out of bounds read: 0"
      // so check the length of the array before accessing
      return this.userAgencies[0].id;
    }
    return undefined;
  }

  getInitialAgencyId(): number | undefined {
    if (this.dropdownAgencies && this.dropdownAgencies.length > 0) {
      // attempting to access 0 index in the empty array leads to the mobx warning "[mobx] Out of bounds read: 0"
      // so check the length of the array before accessing
      return this.dropdownAgencies[0].agency_id;
    }
    return undefined;
  }

  get userAgenciesById(): { [agencyId: string]: UserAgency } {
    return (this.userAgencies || []).reduce(
      (map: { [agencyId: string]: UserAgency }, agency: UserAgency) => ({
        ...map,
        [agency.id]: agency,
      }),
      {}
    );
  }

  // Function to check if an agency ID is in the queriedAgencies list
  isAgencyQueried(agencyId: string): boolean {
    // Return true if agencyId is in queriedAgencies, false otherwise
    return this.queriedAgencies?.includes(agencyId) || false;
  }

  get userAgenciesFromMultipleStates(): boolean {
    if (!this.userAgencies) return false;
    const agenciesStateCodes =
      this.userAgencies
        ?.filter((agency) => !!agency.state_code)
        .map((agency) => agency.state_code) || [];
    return (
      agenciesStateCodes.length > 0 &&
      agenciesStateCodes.length !== new Set(agenciesStateCodes).size
    );
  }

  getAgency(agencyId: string): UserAgency | undefined {
    if (agencyId) {
      return this.userAgenciesById[agencyId];
    }
    return undefined;
  }

  /**
   * Fetches agency group data for a given agencyId and adds those agency data to the
   * userStore. An agency "group" is defined as the superagency and all the child
   * agencies relevant to the agency.
   * For example, if the agency is a child agency, this fetches its superagency and all
   * of the child agencies of that superagency. If it is a superagency, we fetch that
   * agency and all of its child agencies. If the agency is neither a child or
   * superagency, we just fetch that one agency.
   *
   * @param {string} agencyId - The ID of the agency to fetch data for.
   * @returns {Promise<UserAgency | undefined>} - The agency object or undefined if not found.
   */
  async fetchAgencyGroupData(
    agencyId: string
  ): Promise<UserAgency | undefined> {
    if (!agencyId) {
      return undefined;
    }
    try {
      const response = (await this.api.request({
        path: `/api/agency_data2/${agencyId}`,
        method: "GET",
      })) as Response;
      if (response && response instanceof Response) {
        if (response.status === 200) {
          const { agencies: userAgencies } = await response.json();

          runInAction(() => {
            userAgencies.forEach((userAgency: UserAgency) => {
              // If undefined, initialize the list.
              if (!this.userAgencies) {
                this.userAgencies = [];
              }
              const index = this.userAgencies?.findIndex(
                (a) => a.id === userAgency.id
              );
              if (index !== -1) {
                this.userAgencies[index] = userAgency;
              } else {
                // Add to the list if the new agency doesn't exist already.
                this.userAgencies = [...this.userAgencies, userAgency];
              }
            });
          });

          if (agencyId in this.userAgenciesById) {
            return this.userAgenciesById[agencyId];
          }
          return undefined;
        }
        showToast({
          message: "Failed to fetch agency data.",
          color: "red",
        });
        runInAction(() => {
          this.loadingError = true;
        });
        return undefined;
      }
    } catch (error) {
      let errorMessage;
      if (error instanceof Error) {
        errorMessage = error.message;
      } else {
        errorMessage = String(error);
      }

      showToast({
        message: `Error fetching agency data. ${errorMessage}`,
        color: "red",
      });
      runInAction(() => {
        this.loadingError = true;
      });
      return undefined;
    }
  }

  get name(): string | undefined {
    return this.authStore.user?.name;
  }

  get email(): string | undefined {
    return this.authStore.user?.email;
  }

  get auth0UserID(): string | undefined {
    return this.authStore.user?.sub;
  }

  get nameOrEmail(): string | undefined {
    return this.name || this.email;
  }

  get email_verified(): boolean | undefined {
    return this.authStore.user?.email_verified;
  }

  getUserAgencyRole(agencyId: string): AgencyTeamMemberRole | undefined {
    const userAgency = this.getAgency(agencyId);
    if (!userAgency) {
      return undefined;
    }
    return userAgency.team.find(
      (member) => this.email !== undefined && member.email === this.email
    )?.role;
  }

  isJusticeCountsAdmin(agencyId: string): boolean {
    return (
      this.getUserAgencyRole(agencyId) ===
      AgencyTeamMemberRole.JUSTICE_COUNTS_ADMIN
    );
  }

  isAgencyAdmin(agencyId: string): boolean {
    return (
      this.getUserAgencyRole(agencyId) === AgencyTeamMemberRole.AGENCY_ADMIN
    );
  }

  isContributor(agencyId: string): boolean {
    return (
      this.getUserAgencyRole(agencyId) === AgencyTeamMemberRole.CONTRIBUTOR
    );
  }

  isUserReadOnly(agencyId: string): boolean {
    return this.getUserAgencyRole(agencyId) === AgencyTeamMemberRole.READ_ONLY;
  }

  isAgencySuperagency(agencyId: string): boolean | undefined {
    if (agencyId) {
      return this.userAgenciesById[agencyId]?.is_superagency;
    }
    return undefined;
  }

  async updateAndRetrieveUserPermissionsAndAgencies() {
    try {
      const dropdownResponse = (await this.api.request({
        path: "/api/user_dropdown",
        method: "PUT",
        body: {
          name: this.name,
          email: this.email,
          email_verified: this.email_verified,
        },
      })) as Response;
      const { agency_id_to_dropdown_names: dropdownAgencies, user_id: userId } =
        await dropdownResponse.json();
      runInAction(() => {
        this.userId = userId;
        this.userInfoLoaded = true;
        this.dropdownAgencies = dropdownAgencies;
      });
    } catch (error) {
      runInAction(() => {
        this.loadingError = true;
      });
      if (error instanceof Error) return error.message;
      return String(error);
    }
  }

  async updateUserAgencyPageVisit(agencyId: string) {
    try {
      const response = (await this.api.request({
        path: `/api/${this.userId}/${agencyId}/page_visit`,
        method: "PUT",
      })) as Response;
      if (response.status !== 200) {
        throw new Error("There was an issue updating the user/agency visit.");
      }
    } catch (error) {
      if (error instanceof Error) return error.message;
      return String(error);
    }
  }
}

export default UserStore;
