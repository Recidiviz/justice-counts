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

import { showToast } from "@justice-counts/common/components/Toast";
import {
  AgencySetting,
  AgencySystem,
  AgencyTeamMember,
  AgencyTeamMemberRole,
  UserAgency,
} from "@justice-counts/common/types";
import { makeAutoObservable, runInAction } from "mobx";

import { SYSTEMS_LOWERCASE } from "../components/Global/constants";
import { AgencySettingType } from "../components/Settings";
import API from "./API";
import UserStore from "./UserStore";

type AgencyJurisdictions = {
  included: string[];
  excluded: string[];
};

class AgencyStore {
  userStore: UserStore;

  api: API;

  currentAgencyId: string | undefined;

  jurisdictions: AgencyJurisdictions;

  loadingSettings: boolean;

  constructor(userStore: UserStore, api: API) {
    makeAutoObservable(this);

    this.userStore = userStore;
    this.api = api;
    this.currentAgencyId = undefined;
    this.jurisdictions = { included: [], excluded: [] };
    this.loadingSettings = true;
  }

  get currentAgency(): UserAgency | undefined {
    if (this.currentAgencyId !== undefined) {
      return this.userStore.getAgency(this.currentAgencyId);
    }
    return undefined;
  }

  get currentAgencySystems(): AgencySystem[] | undefined {
    return this.currentAgency?.systems;
  }

  get currentAgencyTeam(): AgencyTeamMember[] | undefined {
    return this.currentAgency?.team;
  }

  get currentAgencySettings(): AgencySetting[] | undefined {
    return this.currentAgency?.settings;
  }

  get isAgencySupervision(): boolean {
    return !!this.currentAgency?.systems.find(
      (system) => system === "SUPERVISION"
    );
  }

  get includedJurisdictionsIds(): string[] {
    return this.jurisdictions.included;
  }

  get excludedJurisdictionsIds(): string[] {
    return this.jurisdictions.excluded;
  }

  initCurrentAgency = (agencyId: string) => {
    runInAction(() => {
      this.currentAgencyId = agencyId;
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

      const responseJson = (await response.json()) as {
        settings: AgencySetting[];
        jurisdictions: {
          included: string[];
          excluded: string[];
        };
      };
      runInAction(() => {
        if (this.currentAgency) {
          this.currentAgency.settings = responseJson.settings;
          this.jurisdictions = responseJson.jurisdictions;
        }
      });
    } catch (error) {
      if (error instanceof Error) return new Error(error.message);
    }
  }

  saveAgencySettings = async (
    settings: { settings: AgencySetting[] },
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
      throw new Error("There was an issue saving agency settings.");
    }

    showToast({
      message: `Settings saved.`,
      check: true,
      color: "blue",
      timeout: 4000,
    });
  };

  saveAgencySystems = async (
    systems: { systems: AgencySystem[] },
    agencyId: string
  ): Promise<void> => {
    const response = (await this.api.request({
      path: `/api/agencies/${agencyId}`,
      body: systems,
      method: "PATCH",
    })) as Response;

    if (response.status !== 200) {
      showToast({
        message: `Failed to save.`,
        color: "red",
        timeout: 4000,
      });
      throw new Error(
        `There was an issue updating the agency ${SYSTEMS_LOWERCASE}.`
      );
    }

    showToast({
      message: `Agency ${SYSTEMS_LOWERCASE} saved.`,
      check: true,
      color: "blue",
      timeout: 4000,
    });
  };

  saveAgencyJurisdictions = async (
    jurisdictions: { jurisdictions: AgencyJurisdictions },
    agencyId: string
  ): Promise<void> => {
    const response = (await this.api.request({
      path: `/api/agencies/${agencyId}`,
      body: jurisdictions,
      method: "PATCH",
    })) as Response;

    if (response.status !== 200) {
      showToast({
        message: `Failed to save.`,
        color: "red",
        timeout: 4000,
      });
      throw new Error("There was an issue updating agency jurisdictions.");
    }

    showToast({
      message: `Agency jurisdictions saved.`,
      check: true,
      color: "blue",
      timeout: 4000,
    });
  };

  updateAgencySettings = (
    type: AgencySettingType,
    text: string,
    sourceId: number
  ): { settings: AgencySetting[] } => {
    const newSettings = this.currentAgencySettings
      ? [...this.currentAgencySettings]
      : [];
    const existingSettingIndex = newSettings.findIndex(
      (setting) => setting.setting_type === type
    );
    const newSetting = {
      setting_type: type,
      value: text,
      source_id: sourceId,
    };
    if (existingSettingIndex > -1) {
      newSettings[existingSettingIndex] = newSetting;
    } else {
      newSettings.push(newSetting);
    }
    if (this.currentAgency) {
      this.currentAgency.settings = newSettings;
    }
    return { settings: newSettings };
  };

  updateAgencySystems = (
    systems: AgencySystem[]
  ): { systems: AgencySystem[] } => {
    if (this.currentAgency) {
      this.currentAgency.systems = systems;
    }
    return {
      systems,
    };
  };

  updateAgencyJurisdictions = (
    jurisdictions: AgencyJurisdictions
  ): { jurisdictions: AgencyJurisdictions } => {
    this.jurisdictions = jurisdictions;

    return { jurisdictions };
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
  ): Promise<void | Error> => {
    const response = (await this.api.request({
      path: `/api/agencies/${agencyId}/users`,
      body,
      method: "POST",
    })) as Response;
    if (response.status !== 200) {
      const result = await response.json();
      if (result.code === "user_reinvited_to_agency") {
        showToast({
          message: result.description,
          color: "red",
          timeout: 4000,
        });
        return new Error(result.description);
      }
      showToast({
        message: "Failed to invite user.",
        color: "red",
        timeout: 4000,
      });
      return new Error("There was an issue inviting a user.");
    }

    showToast({
      message: "User has been invited.",
      check: true,
      color: "blue",
      timeout: 4000,
    });
  };

  inviteTeamMember = (name: string, email: string) => {
    const newTeamMember: AgencyTeamMember = {
      user_account_id: null,
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
      this.currentAgencyId = undefined;
      this.jurisdictions = { included: [], excluded: [] };
      this.loadingSettings = true;
    });
  };
}

export default AgencyStore;
