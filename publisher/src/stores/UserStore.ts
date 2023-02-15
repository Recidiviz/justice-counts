// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2022 Recidiviz, Inc.
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
import { AgencyTeamMemberRole, UserAgency } from "@justice-counts/common/types";
import { makeAutoObservable, runInAction, when } from "mobx";

import { APP_METADATA_CLAIM, AuthStore } from "../components/Auth";
import API from "./API";

type UserSettingsRequestBody = {
  name: string | null;
  email: string | null;
};

class UserStore {
  authStore: AuthStore;

  api: API;

  userAgencies: UserAgency[] | undefined;

  userInfoLoaded: boolean;

  onboardingTopicsCompleted: { [topic: string]: boolean } | undefined;

  constructor(authStore: AuthStore, api: API) {
    makeAutoObservable(this);

    this.authStore = authStore;
    this.api = api;
    this.userAgencies = undefined;
    this.userInfoLoaded = false;
    this.onboardingTopicsCompleted = undefined;

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
          return;
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
    if (this.userAgencies && this.userAgencies.length > 0) {
      // attempting to access 0 index in the empty array leads to the mobx warning "[mobx] Out of bounds read: 0"
      // so check the length of the array before accessing
      return this.userAgencies[0].id;
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

  getAgency(agencyId: string): UserAgency | undefined {
    if (agencyId) {
      return this.userAgenciesById[agencyId];
    }
    return undefined;
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

  async updateAndRetrieveUserPermissionsAndAgencies() {
    try {
      const response = (await this.api.request({
        path: "/api/users",
        method: "PUT",
        body: {
          name: this.name,
          email: this.email,
          email_verified: this.email_verified,
        },
      })) as Response;
      const { agencies: userAgencies } = await response.json();
      runInAction(() => {
        this.userAgencies = userAgencies;
        this.onboardingTopicsCompleted = this.authStore.user?.[
          APP_METADATA_CLAIM
        ]?.onboarding_topics_completed || {
          reportsview: false,
          dataentryview: false,
        };
      });
    } catch (error) {
      if (error instanceof Error) return error.message;
      return String(error);
    } finally {
      runInAction(() => {
        this.userInfoLoaded = true;
      });
    }
  }

  async updateOnboardingStatus(topic: string, status: boolean) {
    try {
      const response = (await this.api.request({
        path: "/api/users",
        method: "PATCH",
        body: {
          onboarding_topics_completed: {
            ...this.onboardingTopicsCompleted,
            [topic]: status,
          },
        },
      })) as Response;

      runInAction(() => {
        this.onboardingTopicsCompleted = {
          ...this.onboardingTopicsCompleted,
          [topic]: status,
        };
      });

      return response;
    } catch (error) {
      if (error instanceof Error) return error.message;
      return String(error);
    }
  }
}

export default UserStore;
