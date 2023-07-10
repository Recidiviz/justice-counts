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

import { ReactComponent as GridIcon } from "@justice-counts/common/assets/grid-icon.svg";
import BarChart from "@justice-counts/common/components/DataViz/BarChart";
import { DatapointsTitle } from "@justice-counts/common/components/DataViz/DatapointsTitle";
import {
  BottomMetricInsightsContainer,
  DatapointsViewContainer,
  DatapointsViewControlsContainer,
  DatapointsViewControlsRow,
  DatapointsViewHeaderWrapper,
  ExtendedDropdown,
  ExtendedDropdownMenuItem,
  MetricHeaderWrapper,
  MobileFiltersButton,
  MobileFiltersRow,
  SelectMetricsButtonContainer,
  SelectMetricsButtonText,
} from "@justice-counts/common/components/DataViz/DatapointsView.styles";
import Legend from "@justice-counts/common/components/DataViz/Legend";
import { MetricInsights } from "@justice-counts/common/components/DataViz/MetricInsights";
import {
  sortDatapointDimensions,
  transformDataForBarChart,
  transformDataForMetricInsights,
} from "@justice-counts/common/components/DataViz/utils";
import {
  DatapointsGroupedByAggregateAndDisaggregations,
  DataVizAggregateName,
  DataVizCountOrPercentageView,
  dataVizCountOrPercentageView,
  DataVizTimeRangeDisplayName,
  DataVizTimeRangesMap,
  DimensionNamesByDisaggregation,
  NoDisaggregationOption,
  ReportFrequency,
} from "@justice-counts/common/types";
import { DropdownMenu, DropdownToggle } from "@recidiviz/design-system";
import React, { forwardRef, useEffect } from "react";

import { Dropdown, DropdownOption } from "../Dropdown";
import { MobileFiltersModal } from "./MobileFiltersModal";
import { MobileSelectMetricsModal } from "./MobileSelectMetricsModal";

type DatapointsViewProps = {
  datapointsGroupedByAggregateAndDisaggregations?: DatapointsGroupedByAggregateAndDisaggregations;
  dimensionNamesByDisaggregation?: DimensionNamesByDisaggregation;
  timeRange: DataVizTimeRangeDisplayName;
  disaggregationName: string;
  countOrPercentageView: DataVizCountOrPercentageView;
  setTimeRange: (timeRange: DataVizTimeRangeDisplayName) => void;
  setDisaggregationName: (disaggregation: string) => void;
  setCountOrPercentageView: (viewSetting: DataVizCountOrPercentageView) => void;
  metricName: string;
  metricFrequency?: ReportFrequency;
  metricNamesByCategory?: { [key: string]: string[] };
  agencyName?: string;
  onMetricsSelect?: (metric: string) => void;
  showTitle?: boolean;
  showBottomMetricInsights?: boolean;
  resizeHeight?: boolean;
  maxHeightViewport?: boolean;
};

const noDisaggregationOption = "None";

const SelectMetricButton = () => (
  <SelectMetricsButtonContainer>
    <GridIcon />
    <SelectMetricsButtonText />
  </SelectMetricsButtonContainer>
);

const SelectMetricButtonDropdown: React.FC<{
  onSelect: (metricKey: string) => void;
  options: string[];
  currentMetricName: string;
}> = ({ onSelect, options, currentMetricName }) => (
  <ExtendedDropdown>
    <DropdownToggle>
      <SelectMetricButton />
    </DropdownToggle>
    <DropdownMenu>
      {options.map((value) => (
        <ExtendedDropdownMenuItem
          key={value}
          onClick={() => {
            onSelect(value);
          }}
          highlight={currentMetricName === value}
        >
          {value}
        </ExtendedDropdownMenuItem>
      ))}
    </DropdownMenu>
  </ExtendedDropdown>
);

export const DatapointsView = forwardRef((props: DatapointsViewProps, ref) => {
  const {
    datapointsGroupedByAggregateAndDisaggregations,
    dimensionNamesByDisaggregation,
    timeRange,
    disaggregationName,
    countOrPercentageView,
    setTimeRange,
    setDisaggregationName,
    setCountOrPercentageView,
    metricName,
    metricFrequency,
    metricNamesByCategory,
    agencyName,
    onMetricsSelect,
    showTitle = false,
    showBottomMetricInsights = false,
    resizeHeight = false,
    maxHeightViewport = false,
  } = props;

  const [mobileSelectMetricsVisible, setMobileSelectMetricsVisible] =
    React.useState<boolean>(false);
  const [mobileFiltersVisible, setMobileFiltersVisible] =
    React.useState<boolean>(false);

  const selectedData =
    (disaggregationName !== NoDisaggregationOption &&
      Object.values(
        datapointsGroupedByAggregateAndDisaggregations?.disaggregations[
          disaggregationName
        ] || {}
      )) ||
    datapointsGroupedByAggregateAndDisaggregations?.aggregate ||
    [];

  // all datapoints have annual frequency
  const isAnnualOnly = !selectedData.find((dp) => dp.frequency === "MONTHLY");
  const disaggregations = Object.keys(dimensionNamesByDisaggregation || {});
  const disaggregationOptions = [...disaggregations];
  disaggregationOptions.unshift(noDisaggregationOption);
  const dimensionNames =
    disaggregationName !== noDisaggregationOption
      ? (dimensionNamesByDisaggregation?.[disaggregationName] || [])
          .slice() // Must use slice() before sorting a MobX observableArray
          .sort(sortDatapointDimensions)
      : [DataVizAggregateName];

  const selectedTimeRangeValue = DataVizTimeRangesMap[timeRange];

  useEffect(() => {
    if (isAnnualOnly && selectedTimeRangeValue === 6) {
      setTimeRange("All");
    }
    if (!disaggregationOptions.includes(disaggregationName)) {
      setDisaggregationName(noDisaggregationOption);
      setCountOrPercentageView("Count");
    }
    if (disaggregationName === noDisaggregationOption) {
      setCountOrPercentageView("Count");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datapointsGroupedByAggregateAndDisaggregations]);

  useEffect(() => {
    if (disaggregationName === noDisaggregationOption) {
      setCountOrPercentageView("Count");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disaggregationName]);

  /** Prevent body from scrolling when modal is open */
  useEffect(() => {
    if (mobileSelectMetricsVisible || mobileFiltersVisible) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileSelectMetricsVisible, mobileFiltersVisible]);

  const renderChartForMetric = () => {
    return (
      <BarChart
        data={transformDataForBarChart(
          selectedData,
          selectedTimeRangeValue,
          countOrPercentageView
        )}
        dimensionNames={dimensionNames}
        percentageView={
          !!disaggregationName && countOrPercentageView === "Percentage"
        }
        resizeHeight={resizeHeight}
        ref={ref}
      />
    );
  };

  const renderLegend = () => {
    if (disaggregationName !== noDisaggregationOption) {
      return <Legend names={dimensionNames} />;
    }
    return <Legend />;
  };

  const renderDataVizControls = () => {
    const timeRanges = isAnnualOnly
      ? Object.keys(DataVizTimeRangesMap).filter(
          (key) => key !== "6 Months Ago"
        )
      : Object.keys(DataVizTimeRangesMap);
    const timeRangesDropdownOptions: DropdownOption[] = timeRanges.map(
      (range) => ({
        key: range,
        label: range,
        onClick: () => setTimeRange(range as DataVizTimeRangeDisplayName),
        highlight: range === timeRange,
      })
    );

    const disaggregationDropdownOptions: DropdownOption[] =
      disaggregationOptions.map((option) => ({
        key: option,
        label: option,
        onClick: () => setDisaggregationName(option),
        highlight: disaggregationName === option,
      }));

    const countOrPercentageDropdownOptions: DropdownOption[] =
      dataVizCountOrPercentageView.map((option) => ({
        key: option,
        label: option,
        onClick: () => setCountOrPercentageView(option),
        highlight: countOrPercentageView === option,
      }));
    return (
      <DatapointsViewControlsContainer>
        <Dropdown
          label={timeRange}
          options={timeRangesDropdownOptions}
          size="small"
          caretPosition="right"
        />
        {disaggregationOptions.length > 1 && (
          <Dropdown
            label={disaggregationName}
            options={disaggregationDropdownOptions}
            size="small"
            caretPosition="right"
          />
        )}
        {disaggregationName !== noDisaggregationOption && (
          <Dropdown
            label={countOrPercentageView}
            options={countOrPercentageDropdownOptions}
            size="small"
            caretPosition="right"
          />
        )}
      </DatapointsViewControlsContainer>
    );
  };

  const filteredAggregateData = transformDataForMetricInsights(
    datapointsGroupedByAggregateAndDisaggregations?.aggregate || [],
    selectedTimeRangeValue
  );

  const shouldShowMobileSelectMetricsModal =
    mobileSelectMetricsVisible &&
    agencyName &&
    metricNamesByCategory &&
    metricName &&
    onMetricsSelect;

  const shouldShowMobileFiltersModal = mobileFiltersVisible && metricName;

  return (
    <DatapointsViewContainer maxHeightViewport={maxHeightViewport}>
      <DatapointsViewHeaderWrapper>
        {showTitle && (
          <MetricHeaderWrapper>
            <DatapointsTitle
              metricName={metricName}
              metricFrequency={metricFrequency}
            />
            {selectedData.length > 0 && (
              <MetricInsights
                datapoints={filteredAggregateData}
                enableHideByWidth
              />
            )}
          </MetricHeaderWrapper>
        )}
      </DatapointsViewHeaderWrapper>
      <DatapointsViewControlsRow>
        {metricNamesByCategory && onMetricsSelect && (
          <SelectMetricButtonDropdown
            options={Object.values(metricNamesByCategory).flat()}
            onSelect={onMetricsSelect}
            currentMetricName={metricName}
          />
        )}
        {renderDataVizControls()}
      </DatapointsViewControlsRow>
      <MobileFiltersRow>
        <MobileFiltersButton onClick={() => setMobileFiltersVisible(true)} />
      </MobileFiltersRow>
      {renderChartForMetric()}
      {renderLegend()}
      {showBottomMetricInsights && selectedData.length > 0 && (
        <BottomMetricInsightsContainer>
          <MetricInsights datapoints={filteredAggregateData} />
        </BottomMetricInsightsContainer>
      )}
      {shouldShowMobileSelectMetricsModal && (
        <MobileSelectMetricsModal
          agencyName={agencyName}
          selectedMetricName={metricName}
          metricNamesByCategory={metricNamesByCategory}
          closeModal={() => setMobileSelectMetricsVisible(false)}
          onSelectMetric={onMetricsSelect}
        />
      )}
      {shouldShowMobileFiltersModal && (
        <MobileFiltersModal
          metricName={metricName}
          disaggregationOptions={disaggregationOptions}
          closeModal={() => setMobileFiltersVisible(false)}
          timeRange={timeRange}
          disaggregationName={disaggregationName}
          countOrPercentageView={countOrPercentageView}
          setTimeRange={setTimeRange}
          setDisaggregationName={setDisaggregationName}
          setCountOrPercentageView={setCountOrPercentageView}
        />
      )}
    </DatapointsViewContainer>
  );
});
