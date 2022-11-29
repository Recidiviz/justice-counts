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
  DataVizTimeRangeDisplayName,
  DataVizViewSetting,
  NoDisaggregationOption,
} from "@justice-counts/common/types";
import { makeAutoObservable, runInAction } from "mobx";

class DataVizStore {
  timeRange: DataVizTimeRangeDisplayName;

  disaggregation: string;

  viewSetting: DataVizViewSetting;

  constructor() {
    makeAutoObservable(this);
    this.timeRange = "All";
    this.disaggregation = NoDisaggregationOption;
    this.viewSetting = "Count";
  }

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
