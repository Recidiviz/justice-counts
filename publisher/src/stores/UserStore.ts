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

  dropdownAgenciesById: { [agencyId: string]: DropdownAgency } = {};

  userAgenciesById: { [agencyId: string]: UserAgency } = {};

  userId: string | undefined;

  userInfoLoaded: boolean;

  loadingError: boolean;

  constructor(authStore: AuthStore, api: API) {
    makeAutoObservable(this, {}, { autoBind: true });

    this.authStore = authStore;
    this.api = api;
    this.dropdownAgenciesById = {};
    this.userAgenciesById = {};
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

  getInitialAgencyId(): number | undefined {
    if (this.dropdownAgencies && this.dropdownAgencies.length > 0) {
      return this.dropdownAgencies[0].agency_id;
    }
    return undefined;
  }

  get userAgencies(): UserAgency[] {
    return Object.values(this.userAgenciesById);
  }

  get dropdownAgencies(): DropdownAgency[] {
    return Object.values(this.dropdownAgenciesById);
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
   * Loads agency data for a given agencyId and adds that agency data to the
   * userStore.
   *
   * This also loads the agency's superagency if one exists, which is necessary for
   * rendering the child agency dropdown menus.
   *
   * @param {string} agencyId - The ID of the agency to fetch data for.
   * @returns {Promise<void>} - Resolves when the data is loaded.
   */
  async loadAgencyData(agencyId: string): Promise<void> {
    if (!agencyId) {
      return;
    }

    try {
      const response = (await this.api.request({
        path: `/api/agency/${agencyId}`,
        method: "GET",
      })) as Response;

      if (response.status !== 200) {
        return Promise.reject(
          new Error(`Failed to fetch agency data for ID ${agencyId}`)
        );
      }

      const { agencies: userAgencies }: { agencies: UserAgency[] } =
        await response.json();

      runInAction(() => {
        userAgencies.forEach((userAgency: UserAgency) => {
          this.userAgenciesById[userAgency.id] = userAgency;
        });
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      showToast({
        message: `Error fetching agency data for ID ${agencyId}: ${errorMessage}`,
        color: "red",
      });

      runInAction(() => {
        this.loadingError = true;
      });
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
        dropdownAgencies.forEach((dropdownAgency: DropdownAgency) => {
          this.dropdownAgenciesById[dropdownAgency.agency_id] = dropdownAgency;
        });
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
