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

import {
  Datapoint,
  DataVizTimeRangeDisplayName,
  DataVizTimeRangesMap,
  DataVizViewSetting,
  NoDisaggregationOption,
} from "@justice-counts/common/types";
import { makeAutoObservable, runInAction } from "mobx";

import {
  filterByTimeRange,
  filterNullDatapoints,
  transformToRelativePerchanges,
} from "../components/DataViz/utils";
import BaseDatapointsStore from "./BaseDatapointsStore";

class DataVizStore {
  datapointsStore: BaseDatapointsStore;

  timeRange: DataVizTimeRangeDisplayName;

  disaggregation: string;

  viewSetting: DataVizViewSetting;

  constructor(datapointsStore: BaseDatapointsStore) {
    makeAutoObservable(this);
    this.datapointsStore = datapointsStore;
    this.timeRange = "All";
    this.disaggregation = NoDisaggregationOption;
    this.viewSetting = "Count";
  }

  getFilteredDatapoints = (metricKey: string): Datapoint[] => {
    const dataForMetric = this.datapointsStore.datapointsByMetric[metricKey];

    let filteredData =
      (this.disaggregation !== NoDisaggregationOption &&
        Object.values(
          dataForMetric.disaggregations[this.disaggregation] || {}
        )) ||
      dataForMetric?.aggregate ||
      [];

    filteredData = filterByTimeRange(
      filteredData,
      DataVizTimeRangesMap[this.timeRange]
    );

    // format data into percentages for percentage view
    if (this.viewSetting === "Percentage") {
      filteredData = transformToRelativePerchanges(filteredData);
    }

    return filterNullDatapoints(filteredData);
  };

  getFilteredAggregateDatapoints = (metricKey: string): Datapoint[] => {
    const data = this.datapointsStore.datapointsByMetric[metricKey];

    const dataFilteredByTimeRange = filterByTimeRange(
      data?.aggregate || [],
      DataVizTimeRangesMap[this.timeRange]
    );

    return filterNullDatapoints(dataFilteredByTimeRange);
  };

  setTimeRange = (timeRange: DataVizTimeRangeDisplayName) => {
    runInAction(() => {
      this.timeRange = timeRange;
    });
  };

  setDisaggregation = (disaggregation: string) => {
    runInAction(() => {
      this.disaggregation = disaggregation;
    });
  };

  setViewSetting = (viewSetting: DataVizViewSetting) => {
    runInAction(() => {
      this.viewSetting = viewSetting;
    });
  };
}

export default DataVizStore;
