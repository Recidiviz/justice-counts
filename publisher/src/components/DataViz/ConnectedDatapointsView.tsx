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

import { DatapointsTableView } from "@justice-counts/common/components/DataViz/DatapointsTableView";
import { DatapointsView } from "@justice-counts/common/components/DataViz/DatapointsView";
import {
  DatapointsGroupedByAggregateAndDisaggregations,
  RawDatapoint,
  ReportFrequency,
} from "@justice-counts/common/types";
import { observer } from "mobx-react-lite";
import React from "react";

import { useStore } from "../../stores";
import { ChartView } from "../MetricConfiguration";

const ConnectedDatapointsView: React.FC<{
  metric: string;
  metricName: string;
  metricFrequency?: ReportFrequency;
  dataView: ChartView;
}> = ({ metric, metricName, metricFrequency, dataView }) => {
  const { datapointsStore } = useStore();
  const datapointsForMetric =
    datapointsStore.datapointsByMetric[metric] ||
    ({} as DatapointsGroupedByAggregateAndDisaggregations);
  const rawDatapointsForMetric =
    datapointsStore.rawDatapointsByMetric[metric] || ([] as RawDatapoint[]);

  return (
    <>
      {dataView === ChartView.Chart && (
        <DatapointsView
          datapointsGroupedByAggregateAndDisaggregations={datapointsForMetric}
          dimensionNamesByDisaggregation={
            datapointsStore.dimensionNamesByMetricAndDisaggregation[metric] ||
            {}
          }
          metricName={metricName}
          metricFrequency={metricFrequency}
        />
      )}
      {dataView === ChartView.Table && (
        <DatapointsTableView
          datapoints={rawDatapointsForMetric}
          useDataPageStyles
          metricName={metricName}
          metricFrequency={metricFrequency}
        />
      )}
    </>
  );
};

export default observer(ConnectedDatapointsView);
