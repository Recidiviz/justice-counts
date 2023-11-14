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

import { AgencySystems } from "@justice-counts/common/types";
import { groupBy } from "@justice-counts/common/utils";
import { makeAutoObservable, runInAction } from "mobx";

import {
  Agency,
  AgencyResponse,
  User,
  UserResponse,
} from "../components/AdminPanel";
import API from "./API";

class AdminPanelStore {
  api: API;

  loading: boolean;

  users: User[];

  agencies: Agency[];

  systems: AgencySystems[];

  constructor(api: API) {
    makeAutoObservable(this, {}, { autoBind: true });
    this.api = api;
    this.loading = true;
    this.users = [];
    this.agencies = [];
    this.systems = [];
  }

  get usersByID() {
    return groupBy(this.users, (user) => user.id);
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

      /** Hydrate store with a list of sorted users (and a sorted list of their agencies) from response  */
      runInAction(() => {
        this.users = AdminPanelStore.sortListByName(data.users).map((user) => ({
          ...user,
          agencies: AdminPanelStore.sortListByName(user.agencies),
        }));
        this.loading = false;
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

      /** Hydrate store with a list of systems and a list of sorted agencies from response  */
      runInAction(() => {
        this.agencies = AdminPanelStore.sortListByName(data.agencies);
        this.systems = data.systems;
        this.loading = false;
      });
    } catch (error) {
      if (error instanceof Error) return new Error(error.message);
    }
  }

  /** Helpers  */

  /**
   * Sorts a list of agencies/users in ascending/descending alphabetical order.
   * @param list - The array of agency/user objects.
   * @param order - The sorting order - either "ascending" or "descending". Defaults to ascending order.
   * @returns A sorted array of agency objects.
   */
  static sortListByName<T extends Agency | User>(
    list: T[],
    order: "ascending" | "descending" = "ascending"
  ): T[] {
    return list.sort((a, b) => {
      if (order === "descending") {
        return b.name.localeCompare(a.name);
      }
      return a.name.localeCompare(b.name);
    });
  }
}

export default AdminPanelStore;
