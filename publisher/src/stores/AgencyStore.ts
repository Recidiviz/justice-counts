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
import { AgencySystems, UserAgency } from "@justice-counts/common/types";
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
      showToast(`Failed to save.`, true, "red", 4000);
      throw new Error("There was an issue updating purpose and functions.");
    }

    showToast(`Settings saved.`, true, "grey", 4000);
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
