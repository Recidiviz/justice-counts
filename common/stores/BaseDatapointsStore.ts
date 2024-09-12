// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2024 Recidiviz, Inc.
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
  DatapointsByMetric,
  DataVizAggregateName,
  DimensionNamesByMetricAndDisaggregation,
  Metric,
  RawDatapoint,
  RawDatapointsByMetric,
  UnitedRaceEthnicityKeys,
} from "@justice-counts/common/types";
import { isPositiveNumber } from "@justice-counts/common/utils";
import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";

abstract class DatapointsStore {
  rawDatapoints: RawDatapoint[];

  dimensionNamesByMetricAndDisaggregation: DimensionNamesByMetricAndDisaggregation;

  loading: boolean;

  constructor() {
    makeObservable(this, {
      rawDatapoints: observable,
      dimensionNamesByMetricAndDisaggregation: observable,
      loading: observable,
      datapointsByMetric: computed,
      getDatapoints: action,
      resetState: action,
    });
    this.rawDatapoints = [];
    this.dimensionNamesByMetricAndDisaggregation = {};
    this.loading = true;
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
    return this.rawDatapoints.reduce((res: DatapointsByMetric, dp) => {
      if (!res[dp.metric_definition_key]) {
        res[dp.metric_definition_key] = {
          aggregate: [],
          disaggregations: {},
        };
      }

      const sanitizedValue =
        dp.value !== null && isPositiveNumber(dp.value)
          ? Number(dp.value)
          : null;

      if (
        dp.disaggregation_display_name === null ||
        dp.dimension_display_name === null
      ) {
        res[dp.metric_definition_key].aggregate.push({
          [DataVizAggregateName]: sanitizedValue,
          start_date: dp.start_date,
          end_date: dp.end_date,
          frequency: dp.frequency,
          dataVizMissingData: 0,
        });
      } else if (dp.value && dp.frequency) {
        if (
          !res[dp.metric_definition_key].disaggregations[
            dp.disaggregation_display_name
          ]
        ) {
          res[dp.metric_definition_key].disaggregations[
            dp.disaggregation_display_name
          ] = {};
        }

        const dimensionName = Object.keys(UnitedRaceEthnicityKeys).includes(
          dp.dimension_display_name
        )
          ? UnitedRaceEthnicityKeys[dp.dimension_display_name]
          : dp.dimension_display_name;

        const hasDimensionName =
          res[dp.metric_definition_key].disaggregations[
            dp.disaggregation_display_name
          ][dp.start_date] &&
          Object.keys(
            res[dp.metric_definition_key].disaggregations[
              dp.disaggregation_display_name
            ][dp.start_date]
          ).includes(dimensionName);

        let dimensionValue: string | number | null;

        if (hasDimensionName) {
          dimensionValue =
            Number(
              res[dp.metric_definition_key].disaggregations[
                dp.disaggregation_display_name
              ][dp.start_date][dimensionName] ?? 0
            ) + (sanitizedValue ?? 0);
        } else {
          dimensionValue = sanitizedValue;
        }

        res[dp.metric_definition_key].disaggregations[
          dp.disaggregation_display_name
        ][dp.start_date] = {
          ...res[dp.metric_definition_key].disaggregations[
            dp.disaggregation_display_name
          ][dp.start_date],
          start_date: dp.start_date,
          end_date: dp.end_date,
          [dimensionName]: dimensionValue,
          frequency: dp.frequency,
          dataVizMissingData: 0,
        };
      }
      return res;
    }, {});
  }

  get rawDatapointsByMetric(): RawDatapointsByMetric {
    return DatapointsStore.keyRawDatapointsByMetric(this.rawDatapoints);
  }

  static keyRawDatapointsByMetric = (rawDatapoints: RawDatapoint[]) => {
    return rawDatapoints.reduce((res: RawDatapointsByMetric, dp) => {
      if (!res[dp.metric_definition_key]) {
        res[dp.metric_definition_key] = [dp];
      } else {
        res[dp.metric_definition_key].push(dp);
      }

      return res;
    }, {});
  };

  abstract getDatapoints(
    agencyId: number,
    agencyMetrics?: Metric[]
  ): Promise<void | Error>;

  resetState() {
    runInAction(() => {
      this.rawDatapoints = [];
      this.loading = true;
    });
  }
}

export default DatapointsStore;
