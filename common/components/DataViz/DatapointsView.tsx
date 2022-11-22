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
import React, { useEffect, useRef } from "react";

import { DatapointsTitle } from "./DatapointsTitle";
import {
  DatapointsViewContainer,
  DatapointsViewControlsContainer,
  DatapointsViewControlsDropdown,
  DatapointsViewHeaderWrapper,
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
  const [insightsWidth, setInsightsWidth] = React.useState(0);
  const insightsRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    if (selectedDisaggregation === noDisaggregationOption) {
      setDatapointsViewSetting("Count");
    }
  }, [selectedDisaggregation]);

  useEffect(() => {
    if (insightsRef.current) setInsightsWidth(insightsRef.current.offsetWidth);
  }, [metricName]);

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

  // insights data
  const dataSelectedInTimeRange = filterNullDatapoints(
    filterByTimeRange(
      datapointsGroupedByAggregateAndDisaggregations?.aggregate || [],
      selectedTimeRangeValue
    )
  );
  const percentChange = getPercentChangeOverTime(dataSelectedInTimeRange);
  const avgValue = getAverageTotalValue(dataSelectedInTimeRange, isAnnual);
  const mostRecentValue = getLatestDateFormatted(
    dataSelectedInTimeRange,
    isAnnual
  );

  const chartViewInsightsInfo = `Year-to-Year: ${percentChange},\nAvg. Total Value: ${avgValue},\nMost Recent: ${mostRecentValue}`;

  const renderMetricInsightsRow = () => {
    return (
      <MetricInsightsRow ref={insightsRef} selfWidth={insightsWidth}>
        <MetricInsight title="Year-to-Year" value={percentChange} />
        <MetricInsight title="Avg. Total Value" value={avgValue} />
        <MetricInsight title="Most Recent" value={mostRecentValue} />
      </MetricInsightsRow>
    );
  };

  return (
    <DatapointsViewContainer>
      <DatapointsViewHeaderWrapper>
        {metricName && (
          <MetricHeaderWrapper>
            <DatapointsTitle
              metricName={metricName}
              metricFrequency={metricFrequency}
              insights={chartViewInsightsInfo}
            />
            {data.length > 0 && renderMetricInsightsRow()}
          </MetricHeaderWrapper>
        )}
        {renderDataVizControls()}
      </DatapointsViewHeaderWrapper>
      {renderChartForMetric()}
      {renderLegend()}
    </DatapointsViewContainer>
  );
};
