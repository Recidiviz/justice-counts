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

import { Metric } from "@justice-counts/common/types";
import { makeAutoObservable, runInAction } from "mobx";

import { request } from "../utils/networking";

class AgencyDataStore {
  metrics: Metric[];

  loading: boolean;

  constructor() {
    makeAutoObservable(this);
    this.metrics = [];
    this.loading = true;
  }

  get metricKeyToDisplayName(): { [metricKey: string]: string | null } {
    const mapping: { [metricKey: string]: string | null } = {};
    this.metrics.forEach((metric) => {
      mapping[metric.key] = metric.display_name;
    });
    return mapping;
  }

  get metricDisplayNameToKey(): { [displayName: string]: string | null } {
    const mapping: { [displayName: string]: string | null } = {};
    this.metrics.forEach((metric) => {
      mapping[metric.display_name] = metric.key;
    });
    return mapping;
  }

  async fetchAgencyData(agencyId: number): Promise<void | Error> {
    try {
      const response = (await request({
        path: `/api/agencies/${agencyId}/published_data`,
        method: "GET",
      })) as Response;
      if (response.status === 200) {
        const result = await response.json();
        runInAction(() => {
          this.metrics = result;
        });
      } else {
        const error = await response.json();
        throw new Error(error.description);
      }
      runInAction(() => {
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      throw error;
    }
  }

  resetState() {
    // reset the state
    runInAction(() => {
      this.metrics = [];
      this.loading = true;
    });
  }
}

export default AgencyDataStore;
