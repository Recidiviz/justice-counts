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

import BaseDatapointsStore from "@justice-counts/common/stores/BaseDatapointsStore";
import { Datapoint } from "@justice-counts/common/types";
import {
  IReactionDisposer,
  makeObservable,
  observable,
  override,
  runInAction,
} from "mobx";

import API from "./API";
import ReportStore from "./ReportStore";
import UserStore from "./UserStore";

class DatapointsStore extends BaseDatapointsStore {
  userStore: UserStore;

  api: API;

  reportStore: ReportStore;

  disposers: IReactionDisposer[] = [];

  constructor(userStore: UserStore, api: API, reportStore: ReportStore) {
    super();
    makeObservable(this, {
      // inherited
      getDatapoints: override,
      // new
      api: observable,
      userStore: observable,
      reportStore: observable,
    });

    this.api = api;
    this.userStore = userStore;
    this.reportStore = reportStore;
    this.rawDatapoints = [];
    this.dimensionNamesByMetricAndDisaggregation = {};
    this.loading = true;
  }

  deconstructor = () => {
    this.disposers.forEach((disposer) => disposer());
  };

  async getDatapoints(agencyId: number): Promise<void | Error> {
    this.loading = true;
    try {
      const response = (await this.api.request({
        path: `/api/agencies/${agencyId}/datapoints`,
        method: "GET",
      })) as Response;
      if (response.status === 200) {
        const result = await response.json();
        runInAction(() => {
          this.rawDatapoints = result.datapoints.filter((dp: Datapoint) => {
            // Filter out datapoints that do not match the currently set metric frequency
            const hasMatchingFrequency =
              dp.metric_definition_key &&
              dp.frequency ===
                this.reportStore.metricKeyToFrequency[dp.metric_definition_key]
                  .frequency;
            const hasMatchingStartingMonth =
              (hasMatchingFrequency && dp.frequency === "MONTHLY") || // If the frequency is "MONTHLY", there is no starting month - so we can consider this a match
              (dp.metric_definition_key &&
                new Date(dp.start_date).getUTCMonth() + 1 ===
                  this.reportStore.metricKeyToFrequency[
                    dp.metric_definition_key
                  ].starting_month);

            return hasMatchingFrequency && hasMatchingStartingMonth;
          });
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
