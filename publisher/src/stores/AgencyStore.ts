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
import {
  AgencySystems,
  AgencyTeam,
  AgencyTeamMemberRole,
  UserAgency,
} from "@justice-counts/common/types";
import { makeAutoObservable, runInAction } from "mobx";

import { AgencySettingType } from "../components/Settings";
import API from "./API";
import UserStore from "./UserStore";

type AgencySettings = {
  settings: [{ setting_type: AgencySettingType; value: string }];
  systems: AgencySystems[] | undefined;
};

class AgencyStore {
  userStore: UserStore;

  api: API;

  currentAgency: UserAgency | undefined;

  settings: Record<AgencySettingType, string>;

  loadingSettings: boolean;

  constructor(userStore: UserStore, api: API) {
    makeAutoObservable(this);

    this.userStore = userStore;
    this.api = api;
    this.currentAgency = undefined;
    this.settings = { PURPOSE_AND_FUNCTIONS: "", HOMEPAGE_URL: "" };
    this.loadingSettings = true;
  }

  get currentAgencySystems(): AgencySystems[] | undefined {
    return this.currentAgency?.systems;
  }

  get currentAgencyTeam(): AgencyTeam[] | undefined {
    return this.currentAgency?.team;
  }

  get isAgencySupervision(): boolean {
    return !!this.currentAgency?.systems.find(
      (system) => system === "SUPERVISION"
    );
  }

  initCurrentUserAgency = async (agencyId: string) => {
    await this.getAgencySettings(agencyId);
    const agency = this.userStore.getAgency(agencyId);

    runInAction(() => {
      this.currentAgency = agency;
      this.loadingSettings = false;
    });
  };

  async getAgencySettings(agencyId: string): Promise<void | Error> {
    try {
      const response = (await this.api.request({
        path: `/api/agencies/${agencyId}`,
        method: "GET",
      })) as Response;

      if (response.status !== 200) {
        throw new Error("There was an issue getting agency description.");
      }

      const agencySettings = (await response.json()) as AgencySettings;
      runInAction(() => {
        this.settings.PURPOSE_AND_FUNCTIONS =
          agencySettings.settings.find(
            (setting) => setting.setting_type === "PURPOSE_AND_FUNCTIONS"
          )?.value || "";
        this.settings.HOMEPAGE_URL =
          agencySettings.settings.find(
            (setting) => setting.setting_type === "HOMEPAGE_URL"
          )?.value || "";
      });
    } catch (error) {
      if (error instanceof Error) return new Error(error.message);
    }
  }

  saveAgencySettings = async (
    settings: Partial<AgencySettings>,
    agencyId: string
  ): Promise<void> => {
    const response = (await this.api.request({
      path: `/api/agencies/${agencyId}`,
      body: settings,
      method: "PATCH",
    })) as Response;

    if (response.status !== 200) {
      showToast({
        message: `Failed to save.`,
        color: "red",
        timeout: 4000,
      });
      throw new Error("There was an issue updating purpose and functions.");
    }

    showToast({
      message: `Settings saved.`,
      check: true,
      color: "blue",
      timeout: 4000,
    });
  };

  updateAgencySettings = (
    type: AgencySettingType,
    text: string
  ): Partial<AgencySettings> => {
    this.settings[type] = text;

    return {
      settings: [{ setting_type: type, value: text }],
    };
  };

  updateAgencySystems = (systems: AgencySystems[]): Partial<AgencySettings> => {
    if (this.currentAgency) {
      this.currentAgency.systems = systems;
    }
    return {
      systems,
    };
  };

  removeAgencyTeamMemberRequest = async (
    body: { email: string },
    agencyId: string
  ): Promise<void> => {
    const response = (await this.api.request({
      path: `/api/agencies/${agencyId}/users`,
      body,
      method: "DELETE",
    })) as Response;

    if (response.status !== 200) {
      showToast({
        message: "Failed to remove user.",
        color: "red",
        timeout: 4000,
      });
      throw new Error("There was an issue removing a user.");
    }

    showToast({
      message: "User has been removed.",
      check: true,
      color: "blue",
      timeout: 4000,
    });
  };

  removeAgencyTeamMember = (email: string) => {
    if (this.currentAgency) {
      this.currentAgency.team = this.currentAgency.team.filter(
        (member) => member.email !== email
      );
    }
  };

  inviteTeamMemberRequest = async (
    body: { invite_name: string; invite_email: string },
    agencyId: string
  ): Promise<void> => {
    const response = (await this.api.request({
      path: `/api/agencies/${agencyId}/users`,
      body,
      method: "POST",
    })) as Response;

    if (response.status !== 200) {
      showToast({
        message: "Failed to invite user.",
        color: "red",
        timeout: 4000,
      });
      throw new Error("There was an issue inviting a user.");
    }

    showToast({
      message: "User has been invited.",
      check: true,
      color: "blue",
      timeout: 4000,
    });
  };

  inviteTeamMember = (name: string, email: string) => {
    const newTeamMember: AgencyTeam = {
      auth0_user_id: "",
      name,
      email,
      role: AgencyTeamMemberRole.CONTRIBUTOR,
      invitation_status: "PENDING",
    };
    if (this.currentAgency) {
      this.currentAgency.team = [newTeamMember, ...this.currentAgency.team];
    }
  };

  changeTeamMemberAdminStatusRequest = async (
    body: { email: string; role: AgencyTeamMemberRole },
    agencyId: string
  ): Promise<void> => {
    const response = (await this.api.request({
      path: `/api/agencies/${agencyId}/users`,
      body,
      method: "PATCH",
    })) as Response;

    if (response.status !== 200) {
      showToast({
        message: "Failed to change team member status.",
        color: "red",
        timeout: 4000,
      });
      throw new Error("There was an issue changing user's status.");
    }

    showToast({
      message: "User's status has been changed.",
      check: true,
      color: "blue",
      timeout: 4000,
    });
  };

  changeTeamMemberAdminStatus = (email: string, role: AgencyTeamMemberRole) => {
    if (this.currentAgency) {
      this.currentAgency.team = this.currentAgency.team.map((member) =>
        member.email === email
          ? {
              ...member,
              role,
            }
          : member
      );
    }
  };

  resetState = () => {
    // reset the state when switching agencies
    runInAction(() => {
      this.currentAgency = undefined;
      this.settings = { PURPOSE_AND_FUNCTIONS: "", HOMEPAGE_URL: "" };
      this.loadingSettings = true;
    });
  };
}

export default AgencyStore;
