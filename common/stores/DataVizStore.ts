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
  DataVizCountOrPercentageView,
  DataVizTimeRangeDisplayName,
  NoDisaggregationOption,
} from "@justice-counts/common/types";
import { makeAutoObservable } from "mobx";

class DataVizStore {
  timeRange: DataVizTimeRangeDisplayName;

  disaggregationName: string;

  countOrPercentageView: DataVizCountOrPercentageView;

  constructor() {
    makeAutoObservable(this);
    this.timeRange = "All";
    this.disaggregationName = NoDisaggregationOption;
    this.countOrPercentageView = "Count";
  }

  setTimeRange = (timeRange: DataVizTimeRangeDisplayName) => {
    const url = new URL(window.location.href);
    url.searchParams.set("time_range", timeRange);
    window.history.pushState(null, "", url.toString());
    this.timeRange = timeRange;
  };

  setDisaggregationName = (disaggregation: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set("disaggregation", disaggregation);
    window.history.pushState(null, "", url.toString());
    this.disaggregationName = disaggregation;
  };

  setCountOrPercentageView = (viewSetting: DataVizCountOrPercentageView) => {
    const url = new URL(window.location.href);
    url.searchParams.set("view", viewSetting);
    window.history.pushState(null, "", url.toString());
    this.countOrPercentageView = viewSetting;
  };

  setInitialStateFromSearchParams = () => {
    const query = new URLSearchParams(window.location.search);
    const timeRangeParam = query.get(
      "time_range"
    ) as DataVizTimeRangeDisplayName | null;
    const disaggregationParam = query.get("disaggregation");
    const viewParam = query.get("view") as DataVizCountOrPercentageView | null;
    this.setTimeRange(timeRangeParam ?? this.timeRange);
    this.setDisaggregationName(disaggregationParam ?? this.disaggregationName);
    this.setCountOrPercentageView(viewParam ?? this.countOrPercentageView);
  };

  resetState = () => {
    this.timeRange = "All";
    this.disaggregationName = NoDisaggregationOption;
    this.countOrPercentageView = "Count";
  };
}

export default DataVizStore;
