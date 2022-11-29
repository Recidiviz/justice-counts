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

import BaseDatapointsStore from "@justice-counts/common/stores/BaseDatapointsStore";
import {
  DimensionNamesByMetricAndDisaggregation,
  RawDatapoint,
} from "@justice-counts/common/types";
import {
  IReactionDisposer,
  makeObservable,
  observable,
  override,
  runInAction,
} from "mobx";

import API from "./API";
import UserStore from "./UserStore";

class DatapointsStore extends BaseDatapointsStore {
  userStore: UserStore;

  api: API;

  rawDatapoints: RawDatapoint[];

  dimensionNamesByMetricAndDisaggregation: DimensionNamesByMetricAndDisaggregation;

  loading: boolean;

  disposers: IReactionDisposer[] = [];

  constructor(userStore: UserStore, api: API) {
    super();
    makeObservable(this, {
      // inherited
      getDatapoints: override,
      // new
      api: observable,
      userStore: observable,
    });

    this.api = api;
    this.userStore = userStore;
    this.rawDatapoints = [];
    this.dimensionNamesByMetricAndDisaggregation = {};
    this.loading = true;
  }

  deconstructor = () => {
    this.disposers.forEach((disposer) => disposer());
  };

  async getDatapoints(agencyId: string | undefined): Promise<void | Error> {
    try {
      const currentAgency = this.userStore.getCurrentAgency(agencyId);
      if (currentAgency === undefined) {
        // If user is not attached to an agency,
        // no need to bother trying to load this data.
        runInAction(() => {
          this.loading = false;
        });
        return;
      }
      const response = (await this.api.request({
        path: `/api/agencies/${currentAgency.id}/datapoints`,
        method: "GET",
      })) as Response;
      if (response.status === 200) {
        const result = await response.json();
        runInAction(() => {
          this.rawDatapoints = result.datapoints;
          this.dimensionNamesByMetricAndDisaggregation =
            result.dimension_names_by_metric_and_disaggregation;
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
      if (error instanceof Error) return new Error(error.message);
    }
  }
}

export default DatapointsStore;
