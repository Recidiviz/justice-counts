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
  datapointMatchingMetricFrequency,
  getMetricKeyToFrequencyMap,
} from "@justice-counts/common/components/DataViz/utils";
import BaseDatapointsStore from "@justice-counts/common/stores/BaseDatapointsStore";
import { Datapoint, Metric } from "@justice-counts/common/types";
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

  async getDatapoints(
    agencyId: number,
    agencyMetrics: Metric[]
  ): Promise<void | Error> {
    this.loading = true;
    try {
      const response = (await this.api.request({
        path: `/api/agencies/${agencyId}/datapoints`,
        method: "GET",
      })) as Response;
      if (response.status === 200) {
        const result = await response.json();
        runInAction(() => {
          const metricKeyToFrequency = getMetricKeyToFrequencyMap(
            this.reportStore.agencyMetrics
          );
          this.rawDatapoints = [
            // If we reorder these, the latest duplicate will overwrite
            // Annual Jan 2020 - Dec 2021
            // {
            //   agency_name: null,
            //   dimension_display_name: "Unknown Cases Referred",
            //   disaggregation_display_name: "Referred Case Severity Type",
            //   end_date: "Fri, 01 Jan 2021 00:00:00 GMT",
            //   frequency: "ANNUAL",
            //   id: 212126,
            //   is_published: false,
            //   metric_definition_key: "PROSECUTION_CASES REFERRED",
            //   metric_display_name: "Cases Referred",
            //   old_value: null,
            //   report_id: 22215,
            //   start_date: "Wed, 01 Jan 2020 00:00:00 GMT",
            //   value: null,
            // },
            // {
            //   agency_name: null,
            //   dimension_display_name: "Other Cases Referred",
            //   disaggregation_display_name: "Referred Case Severity Type",
            //   end_date: "Fri, 01 Jan 2021 00:00:00 GMT",
            //   frequency: "ANNUAL",
            //   id: 212125,
            //   is_published: false,
            //   metric_definition_key: "PROSECUTION_CASES REFERRED",
            //   metric_display_name: "Cases Referred",
            //   old_value: null,
            //   report_id: 22215,
            //   start_date: "Wed, 01 Jan 2020 00:00:00 GMT",
            //   value: null,
            // },
            {
              agency_name: null,
              dimension_display_name: "Misdemeanor Cases Referred",
              disaggregation_display_name: "Referred Case Severity Type",
              end_date: "Fri, 01 Jan 2021 00:00:00 GMT",
              frequency: "ANNUAL",
              id: 212124,
              is_published: false,
              metric_definition_key: "PROSECUTION_CASES REFERRED",
              metric_display_name: "Cases Referred",
              old_value: null,
              report_id: 22215,
              start_date: "Wed, 01 Jan 2020 00:00:00 GMT",
              value: null,
            },
            {
              agency_name: null,
              dimension_display_name: "Felony Cases Referred",
              disaggregation_display_name: "Referred Case Severity Type",
              end_date: "Fri, 01 Jan 2021 00:00:00 GMT",
              frequency: "ANNUAL",
              id: 212123,
              is_published: false,
              metric_definition_key: "PROSECUTION_CASES REFERRED",
              metric_display_name: "Cases Referred",
              old_value: null,
              report_id: 22215,
              start_date: "Wed, 01 Jan 2020 00:00:00 GMT",
              value: null,
            },
            // {
            //   agency_name: null,
            //   dimension_display_name: null,
            //   disaggregation_display_name: null,
            //   end_date: "Fri, 01 Jan 2021 00:00:00 GMT",
            //   frequency: "ANNUAL",
            //   id: 212122,
            //   is_published: false,
            //   metric_definition_key: "PROSECUTION_CASES REFERRED",
            //   metric_display_name: "Cases Referred",
            //   old_value: null,
            //   report_id: 22215,
            //   start_date: "Wed, 01 Jan 2020 00:00:00 GMT",
            //   value: null,
            // },

            // Monthly Jan 2020
            // {
            //   agency_name: null,
            //   dimension_display_name: "Unknown Cases Referred",
            //   disaggregation_display_name: "Referred Case Severity Type",
            //   end_date: "Sat, 01 Feb 2020 00:00:00 GMT",
            //   frequency: "MONTHLY",
            //   id: 337406,
            //   is_published: false,
            //   metric_definition_key: "PROSECUTION_CASES REFERRED",
            //   metric_display_name: "Cases Referred",
            //   old_value: null,
            //   report_id: 44530,
            //   start_date: "Wed, 01 Jan 2020 00:00:00 GMT",
            //   value: null,
            // },
            // {
            //   agency_name: null,
            //   dimension_display_name: "Other Cases Referred",
            //   disaggregation_display_name: "Referred Case Severity Type",
            //   end_date: "Sat, 01 Feb 2020 00:00:00 GMT",
            //   frequency: "MONTHLY",
            //   id: 337405,
            //   is_published: false,
            //   metric_definition_key: "PROSECUTION_CASES REFERRED",
            //   metric_display_name: "Cases Referred",
            //   old_value: null,
            //   report_id: 44530,
            //   start_date: "Wed, 01 Jan 2020 00:00:00 GMT",
            //   value: null,
            // },
            {
              agency_name: null,
              dimension_display_name: "Misdemeanor Cases Referred",
              disaggregation_display_name: "Referred Case Severity Type",
              end_date: "Sat, 01 Feb 2020 00:00:00 GMT",
              frequency: "MONTHLY",
              id: 337404,
              is_published: false,
              metric_definition_key: "PROSECUTION_CASES REFERRED",
              metric_display_name: "Cases Referred",
              old_value: null,
              report_id: 44530,
              start_date: "Wed, 01 Jan 2020 00:00:00 GMT",
              value: 114,
            },
            {
              agency_name: null,
              dimension_display_name: "Felony Cases Referred",
              disaggregation_display_name: "Referred Case Severity Type",
              end_date: "Sat, 01 Feb 2020 00:00:00 GMT",
              frequency: "MONTHLY",
              id: 337403,
              is_published: false,
              metric_definition_key: "PROSECUTION_CASES REFERRED",
              metric_display_name: "Cases Referred",
              old_value: null,
              report_id: 44530,
              start_date: "Wed, 01 Jan 2020 00:00:00 GMT",
              value: 50,
            },
            // {
            //   agency_name: null,
            //   dimension_display_name: null,
            //   disaggregation_display_name: null,
            //   end_date: "Sat, 01 Feb 2020 00:00:00 GMT",
            //   frequency: "MONTHLY",
            //   id: 337402,
            //   is_published: false,
            //   metric_definition_key: "PROSECUTION_CASES REFERRED",
            //   metric_display_name: "Cases Referred",
            //   old_value: null,
            //   report_id: 44530,
            //   start_date: "Wed, 01 Jan 2020 00:00:00 GMT",
            //   value: 164,
            // },

            // Annual Jan 2019 - Dec 2019
            // {
            //   agency_name: null,
            //   dimension_display_name: "Unknown Cases Referred",
            //   disaggregation_display_name: "Referred Case Severity Type",
            //   end_date: "Wed, 01 Jan 2020 00:00:00 GMT",
            //   frequency: "ANNUAL",
            //   id: 212277,
            //   is_published: false,
            //   metric_definition_key: "PROSECUTION_CASES REFERRED",
            //   metric_display_name: "Cases Referred",
            //   old_value: null,
            //   report_id: 22216,
            //   start_date: "Tue, 01 Jan 2019 00:00:00 GMT",
            //   value: null,
            // },
            // {
            //   agency_name: null,
            //   dimension_display_name: "Other Cases Referred",
            //   disaggregation_display_name: "Referred Case Severity Type",
            //   end_date: "Wed, 01 Jan 2020 00:00:00 GMT",
            //   frequency: "ANNUAL",
            //   id: 212276,
            //   is_published: false,
            //   metric_definition_key: "PROSECUTION_CASES REFERRED",
            //   metric_display_name: "Cases Referred",
            //   old_value: null,
            //   report_id: 22216,
            //   start_date: "Tue, 01 Jan 2019 00:00:00 GMT",
            //   value: null,
            // },
            {
              agency_name: null,
              dimension_display_name: "Misdemeanor Cases Referred",
              disaggregation_display_name: "Referred Case Severity Type",
              end_date: "Wed, 01 Jan 2020 00:00:00 GMT",
              frequency: "ANNUAL",
              id: 212275,
              is_published: false,
              metric_definition_key: "PROSECUTION_CASES REFERRED",
              metric_display_name: "Cases Referred",
              old_value: null,
              report_id: 22216,
              start_date: "Tue, 01 Jan 2019 00:00:00 GMT",
              value: null,
            },
            {
              agency_name: null,
              dimension_display_name: "Felony Cases Referred",
              disaggregation_display_name: "Referred Case Severity Type",
              end_date: "Wed, 01 Jan 2020 00:00:00 GMT",
              frequency: "ANNUAL",
              id: 212274,
              is_published: false,
              metric_definition_key: "PROSECUTION_CASES REFERRED",
              metric_display_name: "Cases Referred",
              old_value: null,
              report_id: 22216,
              start_date: "Tue, 01 Jan 2019 00:00:00 GMT",
              value: null,
            },
            // {
            //   agency_name: null,
            //   dimension_display_name: null,
            //   disaggregation_display_name: null,
            //   end_date: "Wed, 01 Jan 2020 00:00:00 GMT",
            //   frequency: "ANNUAL",
            //   id: 212273,
            //   is_published: false,
            //   metric_definition_key: "PROSECUTION_CASES REFERRED",
            //   metric_display_name: "Cases Referred",
            //   old_value: null,
            //   report_id: 22216,
            //   start_date: "Tue, 01 Jan 2019 00:00:00 GMT",
            //   value: null,
            // },

            // Monthly Jan 2019
            // {
            //   agency_name: null,
            //   dimension_display_name: "Unknown Cases Referred",
            //   disaggregation_display_name: "Referred Case Severity Type",
            //   end_date: "Fri, 01 Feb 2019 00:00:00 GMT",
            //   frequency: "MONTHLY",
            //   id: 337346,
            //   is_published: false,
            //   metric_definition_key: "PROSECUTION_CASES REFERRED",
            //   metric_display_name: "Cases Referred",
            //   old_value: null,
            //   report_id: 44518,
            //   start_date: "Tue, 01 Jan 2019 00:00:00 GMT",
            //   value: null,
            // },
            // {
            //   agency_name: null,
            //   dimension_display_name: "Other Cases Referred",
            //   disaggregation_display_name: "Referred Case Severity Type",
            //   end_date: "Fri, 01 Feb 2019 00:00:00 GMT",
            //   frequency: "MONTHLY",
            //   id: 337345,
            //   is_published: false,
            //   metric_definition_key: "PROSECUTION_CASES REFERRED",
            //   metric_display_name: "Cases Referred",
            //   old_value: null,
            //   report_id: 44518,
            //   start_date: "Tue, 01 Jan 2019 00:00:00 GMT",
            //   value: null,
            // },
            {
              agency_name: null,
              dimension_display_name: "Misdemeanor Cases Referred",
              disaggregation_display_name: "Referred Case Severity Type",
              end_date: "Fri, 01 Feb 2019 00:00:00 GMT",
              frequency: "MONTHLY",
              id: 337344,
              is_published: false,
              metric_definition_key: "PROSECUTION_CASES REFERRED",
              metric_display_name: "Cases Referred",
              old_value: null,
              report_id: 44518,
              start_date: "Tue, 01 Jan 2019 00:00:00 GMT",
              value: 83,
            },
            {
              agency_name: null,
              dimension_display_name: "Felony Cases Referred",
              disaggregation_display_name: "Referred Case Severity Type",
              end_date: "Fri, 01 Feb 2019 00:00:00 GMT",
              frequency: "MONTHLY",
              id: 337343,
              is_published: false,
              metric_definition_key: "PROSECUTION_CASES REFERRED",
              metric_display_name: "Cases Referred",
              old_value: null,
              report_id: 44518,
              start_date: "Tue, 01 Jan 2019 00:00:00 GMT",
              value: 38,
            },
            // {
            //   agency_name: null,
            //   dimension_display_name: null,
            //   disaggregation_display_name: null,
            //   end_date: "Fri, 01 Feb 2019 00:00:00 GMT",
            //   frequency: "MONTHLY",
            //   id: 337342,
            //   is_published: false,
            //   metric_definition_key: "PROSECUTION_CASES REFERRED",
            //   metric_display_name: "Cases Referred",
            //   old_value: null,
            //   report_id: 44518,
            //   start_date: "Tue, 01 Jan 2019 00:00:00 GMT",
            //   value: 121,
            // },
          ].filter((dp: Datapoint) =>
            datapointMatchingMetricFrequency(dp, metricKeyToFrequency)
          );
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
