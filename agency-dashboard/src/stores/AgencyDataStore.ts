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

import {
  AgencySetting,
  DatapointsByMetric,
  DataVizAggregateName,
  Metric,
  UserAgency,
} from "@justice-counts/common/types";
import { isPositiveNumber } from "@justice-counts/common/utils";
import { makeAutoObservable, runInAction } from "mobx";

import { AgenciesList } from "../Home";
import { request } from "../utils/networking";

class AgencyDataStore {
  agency: UserAgency | undefined;

  metrics: Metric[];

  loading: boolean;

  constructor() {
    makeAutoObservable(this);
    this.metrics = [];
    this.loading = true;
  }

  get metricsByKey(): { [metricKey: string]: Metric } {
    const mapping: { [metricKey: string]: Metric } = {};
    this.metrics.forEach((metric) => {
      mapping[metric.key] = metric;
    });
    return mapping;
  }

  get metricsByCategory(): { [metricKey: string]: Metric[] } {
    const mapping: { [metricKey: string]: Metric[] } = {};
    this.metrics.forEach((metric) => {
      if (!mapping[metric.category]) {
        mapping[metric.category] = [];
        mapping[metric.category].push(metric);
      } else {
        mapping[metric.category].push(metric);
      }
    });
    return mapping;
  }

  get metricDisplayNameToKey(): { [displayName: string]: string } {
    const mapping: { [displayName: string]: string } = {};
    this.metrics.forEach((metric) => {
      mapping[metric.display_name] = metric.key;
    });
    return mapping;
  }

  get agencySettingsBySettingType(): {
    [settingType: string]: AgencySetting;
  } {
    const mapping: { [settingType: string]: AgencySetting } = {};
    if (this.agency) {
      this.agency.settings.forEach((setting: AgencySetting) => {
        mapping[setting.setting_type] = setting;
      });
    }
    return mapping;
  }

  /**
   * Transforms raw data from the server into Datapoints keyed by metric,
   * grouped by aggregate values and disaggregations.
   * Aggregate is an array of objects each containing start_date, end_date, and the aggregate value.
   * Disaggregations are keyed by disaggregation name and each value is an object
   * with the key being the start_date and the value being an object
   * containing start_date, end_date and key value pairs for each dimension and their values.
   * See the DatapointsByMetric type for details.
   */
  get datapointsByMetric(): DatapointsByMetric {
    const result: DatapointsByMetric = {};
    this.metrics.forEach((metric) => {
      result[metric.key] = {
        aggregate: [],
        disaggregations: {},
      };
      metric.datapoints?.forEach((dp) => {
        const sanitizedValue =
          dp.value !== null && isPositiveNumber(dp.value)
            ? Number(dp.value)
            : null;
        result[dp.metric_definition_key].aggregate.push({
          [DataVizAggregateName]: sanitizedValue,
          start_date: dp.start_date,
          end_date: dp.end_date,
          frequency: dp.frequency,
          dataVizMissingData: 0,
        });
      });
      metric.disaggregations.forEach((disaggregation) => {
        result[metric.key].disaggregations[disaggregation.display_name] = {};
        disaggregation.dimensions.forEach((dimension) => {
          dimension.datapoints?.forEach((dp) => {
            if (dp.dimension_display_name) {
              const sanitizedValue =
                dp.value !== null && isPositiveNumber(dp.value)
                  ? Number(dp.value)
                  : null;
              result[metric.key].disaggregations[disaggregation.display_name][
                dp.start_date
              ] = {
                ...result[metric.key].disaggregations[
                  disaggregation.display_name
                ][dp.start_date],
                start_date: dp.start_date,
                end_date: dp.end_date,
                [dp.dimension_display_name]: sanitizedValue,
                frequency: dp.frequency,
                dataVizMissingData: 0,
              };
            }
          });
        });
      });
    });
    return result;
  }

  get dimensionNamesByMetricAndDisaggregation(): {
    [metricKey: string]: { [disaggregationName: string]: string[] };
  } {
    const result: {
      [metricKey: string]: { [disaggregationName: string]: string[] };
    } = {};
    this.metrics.forEach((metric) => {
      result[metric.key] = {};
      metric.disaggregations.forEach((disaggregation) => {
        result[metric.key][disaggregation.display_name] =
          disaggregation.dimensions.map((dimension) => dimension.label);
      });
    });
    return result;
  }

  async fetchAgencyData(agencyId: number): Promise<void | Error> {
    try {
      runInAction(() => {
        this.loading = true;
      });
      const response = (await request({
        path: `/api/agencies/${agencyId}/published_data`,
        method: "GET",
      })) as Response;
      if (response.status === 200) {
        const result = await response.json();
        runInAction(() => {
          this.agency = result.agency;
          this.metrics = result.metrics;
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

  async fetchAllAgencies(): Promise<AgenciesList> {
    try {
      const response = (await request({
        path: `/api/agencies`,
        method: "GET",
      })) as Response;

      runInAction(() => {
        this.loading = false;
      });

      if (response.status === 200) {
        const result = await response.json();
        return result;
      }
      const error = await response.json();
      throw new Error(error.description);
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
