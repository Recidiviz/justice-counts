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

import BarChart from "@justice-counts/common/components/DataViz/BarChart";
import Legend from "@justice-counts/common/components/DataViz/Legend";
import {
  DatapointsGroupedByAggregateAndDisaggregations,
  DatapointsViewSetting,
  DataVizAggregateName,
  DataVizTimeRangesMap,
  DimensionNamesByDisaggregation,
  ReportFrequency,
} from "@justice-counts/common/types";
import React, { useEffect } from "react";

import { DatapointsTableTitle } from "./DatapointsTableTitle";
import {
  DatapointsViewContainer,
  DatapointsViewControlsContainer,
  DatapointsViewControlsDropdown,
  MetricHeaderWrapper,
  MetricInsight,
  MetricInsightsRow,
} from "./DatapointsView.styles";
import {
  filterByTimeRange,
  filterNullDatapoints,
  getAverageTotalValue,
  getLatestDateFormatted,
  getPercentChangeOverTime,
  sortDatapointDimensions,
  transformData,
} from "./utils";

const noDisaggregationOption = "None";

export const DatapointsView: React.FC<{
  datapointsGroupedByAggregateAndDisaggregations: DatapointsGroupedByAggregateAndDisaggregations;
  dimensionNamesByDisaggregation: DimensionNamesByDisaggregation;
  metricName?: string;
  metricFrequency?: ReportFrequency;
}> = ({
  datapointsGroupedByAggregateAndDisaggregations,
  dimensionNamesByDisaggregation,
  metricName,
  metricFrequency,
}) => {
  const [selectedTimeRange, setSelectedTimeRange] =
    React.useState<string>("All");
  const [selectedDisaggregation, setSelectedDisaggregation] =
    React.useState<string>(noDisaggregationOption);
  const [datapointsViewSetting, setDatapointsViewSetting] =
    React.useState<DatapointsViewSetting>("Count");

  const data =
    (selectedDisaggregation !== noDisaggregationOption &&
      Object.values(
        datapointsGroupedByAggregateAndDisaggregations.disaggregations[
          selectedDisaggregation
        ] || {}
      )) ||
    datapointsGroupedByAggregateAndDisaggregations?.aggregate ||
    [];
  const isAnnual = data[0]?.frequency === "ANNUAL";
  const disaggregations = Object.keys(dimensionNamesByDisaggregation);
  const disaggregationOptions = [...disaggregations];
  disaggregationOptions.unshift(noDisaggregationOption);
  const dimensionNames =
    selectedDisaggregation !== noDisaggregationOption
      ? (dimensionNamesByDisaggregation[selectedDisaggregation] || [])
          .slice() // Must use slice() before sorting a MobX observableArray
          .sort(sortDatapointDimensions)
      : [DataVizAggregateName];

  const selectedTimeRangeValue = DataVizTimeRangesMap[selectedTimeRange];

  useEffect(() => {
    if (isAnnual && selectedTimeRangeValue === 6) {
      setSelectedTimeRange("All");
    }
    if (!disaggregationOptions.includes(selectedDisaggregation)) {
      setSelectedDisaggregation(noDisaggregationOption);
      setDatapointsViewSetting("Count");
    }
    if (selectedDisaggregation === noDisaggregationOption) {
      setDatapointsViewSetting("Count");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datapointsGroupedByAggregateAndDisaggregations]);

  const renderChartForMetric = () => {
    return (
      <BarChart
        data={transformData(
          data,
          selectedTimeRangeValue,
          datapointsViewSetting
        )}
        dimensionNames={dimensionNames}
        percentageView={
          !!selectedDisaggregation && datapointsViewSetting === "Percentage"
        }
      />
    );
  };

  const renderLegend = () => {
    if (selectedDisaggregation !== noDisaggregationOption) {
      return <Legend names={dimensionNames} />;
    }
    return <Legend />;
  };

  const renderDataVizControls = () => {
    return (
      <DatapointsViewControlsContainer>
        <DatapointsViewControlsDropdown
          title="Date Range"
          selectedValue={selectedTimeRange}
          options={
            isAnnual
              ? Object.keys(DataVizTimeRangesMap).filter(
                  (key) => key !== "6 Months Ago"
                )
              : Object.keys(DataVizTimeRangesMap)
          }
          onSelect={(key) => {
            setSelectedTimeRange(key);
          }}
        />
        {disaggregationOptions.length > 1 && (
          <DatapointsViewControlsDropdown
            title="Disaggregation"
            selectedValue={selectedDisaggregation}
            options={disaggregationOptions}
            onSelect={(key) => {
              setSelectedDisaggregation(key);
            }}
          />
        )}
        {selectedDisaggregation !== noDisaggregationOption && (
          <DatapointsViewControlsDropdown
            title="View"
            selectedValue={datapointsViewSetting}
            options={["Count", "Percentage"]}
            onSelect={(key) => {
              setDatapointsViewSetting(key as DatapointsViewSetting);
            }}
          />
        )}
      </DatapointsViewControlsContainer>
    );
  };

  const renderMetricInsightsRow = () => {
    const dataSelectedInTimeRange = filterNullDatapoints(
      filterByTimeRange(
        datapointsGroupedByAggregateAndDisaggregations?.aggregate || [],
        selectedTimeRangeValue
      )
    );
    const percentChange = getPercentChangeOverTime(dataSelectedInTimeRange);
    const avgValue = getAverageTotalValue(dataSelectedInTimeRange, isAnnual);

    return (
      <MetricInsightsRow>
        <MetricInsight title="Year-to-Year" value={percentChange} />
        <MetricInsight title="Avg. Total Value" value={avgValue} />
        <MetricInsight
          title="Most Recent"
          value={getLatestDateFormatted(dataSelectedInTimeRange, isAnnual)}
        />
      </MetricInsightsRow>
    );
  };

  return (
    <DatapointsViewContainer>
      {metricName && (
        <MetricHeaderWrapper>
          <DatapointsTableTitle
            metricName={metricName}
            metricFrequency={metricFrequency}
          />
          {renderMetricInsightsRow()}
        </MetricHeaderWrapper>
      )}
      {renderDataVizControls()}
      {renderChartForMetric()}
      {renderLegend()}
    </DatapointsViewContainer>
  );
};
