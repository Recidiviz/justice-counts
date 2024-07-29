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
  DataVizCountOrPercentageView,
  dataVizCountOrPercentageView,
  DataVizFrequencyView,
  DataVizTimeRangeDisplayName,
  dataVizTimeRangeDisplayName,
  NoDisaggregationOption,
} from "@justice-counts/common/types";
import { makeAutoObservable } from "mobx";

class DataVizStore {
  timeRange: DataVizTimeRangeDisplayName;

  disaggregationName: string;

  countOrPercentageView: DataVizCountOrPercentageView;

  frequencyView: DataVizFrequencyView;

  constructor() {
    makeAutoObservable(this);
    this.timeRange = "All Time";
    this.disaggregationName = NoDisaggregationOption;
    this.countOrPercentageView = "Breakdown by Count";
    this.frequencyView = "MONTHLY";
  }

  setTimeRange = (timeRange: DataVizTimeRangeDisplayName) => {
    const url = new URL(window.location.href);
    url.searchParams.set("time_range", timeRange);
    window.history.pushState(null, "", url.toString());
    this.timeRange = timeRange;
  };

  setFrequencyView = (frequencyView: DataVizFrequencyView) => {
    this.setTimeRange("All Time");
    const url = new URL(window.location.href);
    url.searchParams.set("frequency", frequencyView);
    window.history.pushState(null, "", url.toString());
    this.frequencyView = frequencyView;
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
    const frequencyParam = query.get(
      "frequency"
    ) as DataVizFrequencyView | null;
    this.setFrequencyView(frequencyParam ?? this.frequencyView);
    if (
      timeRangeParam &&
      dataVizTimeRangeDisplayName.includes(timeRangeParam)
    ) {
      this.setTimeRange(timeRangeParam);
    } else {
      this.setTimeRange(this.timeRange);
    }
    this.setDisaggregationName(disaggregationParam ?? this.disaggregationName);
    if (viewParam && dataVizCountOrPercentageView.includes(viewParam)) {
      this.setCountOrPercentageView(viewParam);
    } else {
      this.setCountOrPercentageView(this.countOrPercentageView);
    }
  };

  resetState = () => {
    this.timeRange = "All Time";
    this.disaggregationName = NoDisaggregationOption;
    this.countOrPercentageView = "Breakdown by Count";
    this.frequencyView = "MONTHLY";
  };
}

export default DataVizStore;
