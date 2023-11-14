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
import { groupBy } from "@justice-counts/common/utils";
import { makeAutoObservable, runInAction } from "mobx";

import {
  Agency,
  AgencyResponse,
  SearchableEntity,
  SearchableListBoxAction,
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

      runInAction(() => {
        this.users = data.users.map((user) => ({
          ...user,
          agencies: AdminPanelStore.sortAgenciesByName(user.agencies),
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

      runInAction(() => {
        this.agencies = AdminPanelStore.sortAgenciesByName(data.agencies);
        this.systems = data.systems;
        this.loading = false;
      });
    } catch (error) {
      if (error instanceof Error) return new Error(error.message);
    }
  }

  /** Helpers  */

  /** Sorts a list of agencies in ascending/descending alphabetical order (defaults to ascending order) */
  static sortAgenciesByName(
    agencies: Agency[],
    order: "ascending" | "descending" = "ascending"
  ) {
    if (order === "descending") {
      return agencies.sort((a, b) => b.name.localeCompare(a.name));
    }
    return agencies.sort((a, b) => a.name.localeCompare(b.name));
  }

  /** Standardizes a list of agencies, users, or team members for use with the SearchableListBox component */
  static convertListToSearchableList(
    list: Agency[] | User[] | AgencyTeamMember[],
    action?: SearchableListBoxAction
  ) {
    return list.map((listItem) => ({
      id: "auth0_user_id" in listItem ? listItem.auth0_user_id : listItem.id,
      name: listItem.name,
      email: "email" in listItem ? listItem.email : undefined,
      action,
      role: "role" in listItem ? listItem.role : undefined,
    }));
  }

  /**
   * Returns a filtered list based on the search value `val` and the `searchByKeys` (a list of object keys to check the value against)
   */
  static searchList<T extends SearchableEntity>(
    val: string,
    list: T[],
    searchByKeys: (keyof T)[]
  ) {
    const regex = new RegExp(`${val}`, `i`);
    return list.filter((listItem) =>
      searchByKeys.some(
        (key) => listItem[key] && regex.test(listItem[key] as string)
      )
    );
  }
}

export default AdminPanelStore;
