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

import { DatapointsTableView } from "@justice-counts/common/components/DataViz/DatapointsTableView";
import { DatapointsView } from "@justice-counts/common/components/DataViz/DatapointsView";
import { MIN_DESKTOP_WIDTH } from "@justice-counts/common/components/GlobalStyles";
import { useWindowWidth } from "@justice-counts/common/hooks";
import {
  ReportFrequency,
  UnitedRaceEthnicityKeys,
} from "@justice-counts/common/types";
import { observer } from "mobx-react-lite";
import React, { forwardRef, useEffect } from "react";

import { useStore } from "../../stores";
import { ChartView } from "./types";

type ConnectedDatapointsViewProps = {
  metric: string;
  metricName: string;
  metricFrequency?: ReportFrequency;
  metricStartingMonth?: number;
  dataView: ChartView;
};

const ConnectedDatapointsView = forwardRef<never, ConnectedDatapointsViewProps>(
  (
    { metric, metricName, metricFrequency, metricStartingMonth, dataView },
    ref
  ) => {
    const { datapointsStore, dataVizStore } = useStore();
    const windowWidth = useWindowWidth();

    const datapointsForMetric = datapointsStore.datapointsByMetric[metric];
    const rawDatapointsForMetric =
      datapointsStore.rawDatapointsByMetric[metric];

    const {
      timeRange,
      disaggregationName,
      countOrPercentageView,
      setTimeRange,
      setDisaggregationName,
      setCountOrPercentageView,
      resetState,
    } = dataVizStore;

    useEffect(() => {
      return () => {
        resetState();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    let dimensionNamesByDisaggregation =
      datapointsStore.dimensionNamesByMetricAndDisaggregation[metric];

    if (
      dimensionNamesByDisaggregation &&
      Object.keys(
        datapointsStore.dimensionNamesByMetricAndDisaggregation[metric]
      ).includes("Race / Ethnicity")
    ) {
      const raceEthnicityDimensionNames = Array.from(
        new Set(Object.values(UnitedRaceEthnicityKeys))
      );
      dimensionNamesByDisaggregation = {
        ...datapointsStore.dimensionNamesByMetricAndDisaggregation[metric],
        "Race / Ethnicity": raceEthnicityDimensionNames,
      };
    }

    return (
      <>
        {dataView === ChartView.Chart && (
          <DatapointsView
            datapointsGroupedByAggregateAndDisaggregations={datapointsForMetric}
            dimensionNamesByDisaggregation={dimensionNamesByDisaggregation}
            timeRange={timeRange}
            disaggregationName={disaggregationName}
            countOrPercentageView={countOrPercentageView}
            setTimeRange={setTimeRange}
            setDisaggregationName={setDisaggregationName}
            setCountOrPercentageView={setCountOrPercentageView}
            metricName={metricName}
            metricFrequency={metricFrequency}
            metricStartingMonth={metricStartingMonth}
            resizeHeight
            showTitle
            showBottomMetricInsights={windowWidth <= MIN_DESKTOP_WIDTH}
            maxHeightViewport
            ref={ref}
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
  }
);

export default observer(ConnectedDatapointsView);
