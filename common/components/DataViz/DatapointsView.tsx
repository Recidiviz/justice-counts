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
  ChartNote,
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
  datapointFilterByFrequency,
  sortDatapointDimensions,
  transformDataForBarChart,
  transformDataForMetricInsights,
} from "@justice-counts/common/components/DataViz/utils";
import {
  Datapoint,
  DatapointsGroupedByAggregateAndDisaggregations,
  DataVizAggregateName,
  DataVizCountOrPercentageView,
  dataVizCountOrPercentageView,
  DataVizFrequencyViewDisplayName,
  dataVizFrequencyViewDisplayName,
  DataVizTimeRangeDisplayName,
  DataVizTimeRangesMap,
  DimensionNamesByDisaggregation,
  NoDisaggregationOption,
  ReportFrequency,
} from "@justice-counts/common/types";
import { DropdownMenu, DropdownToggle } from "@recidiviz/design-system";
import React, { forwardRef, useEffect } from "react";

import { useWindowWidth } from "../../hooks";
import { Dropdown, DropdownOption } from "../Dropdown";
import { MIN_DESKTOP_WIDTH } from "../GlobalStyles";
import { MobileFiltersModal } from "./MobileFiltersModal";
import { MobileSelectMetricsModal } from "./MobileSelectMetricsModal";

type DatapointsViewProps = {
  datapointsGroupedByAggregateAndDisaggregations?: DatapointsGroupedByAggregateAndDisaggregations;
  dimensionNamesByDisaggregation?: DimensionNamesByDisaggregation;
  timeRange: DataVizTimeRangeDisplayName;
  disaggregationName: string;
  countOrPercentageView: DataVizCountOrPercentageView;
  frequencyView: DataVizFrequencyViewDisplayName;
  setTimeRange: (timeRange: DataVizTimeRangeDisplayName) => void;
  setDisaggregationName: (disaggregation: string) => void;
  setCountOrPercentageView: (viewSetting: DataVizCountOrPercentageView) => void;
  setFrequencyView: (frequencyView: DataVizFrequencyViewDisplayName) => void;
  metricName: string;
  metricFrequency?: ReportFrequency;
  metricStartingMonth?: number;
  metricNamesByCategory?: { [key: string]: string[] };
  agencyName?: string;
  onMetricsSelect?: (metric: string) => void;
  showTitle?: boolean;
  resizeHeight?: boolean;
  maxHeightViewport?: boolean;
};

const noDisaggregationOption = NoDisaggregationOption;

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

export const DatapointsView = forwardRef<never, DatapointsViewProps>(
  (props, ref) => {
    const {
      datapointsGroupedByAggregateAndDisaggregations,
      dimensionNamesByDisaggregation,
      timeRange,
      disaggregationName,
      countOrPercentageView,
      frequencyView,
      setTimeRange,
      setDisaggregationName,
      setCountOrPercentageView,
      setFrequencyView,
      metricName,
      metricFrequency,
      metricStartingMonth,
      metricNamesByCategory,
      agencyName,
      onMetricsSelect,
      showTitle = false,
      resizeHeight = false,
      maxHeightViewport = false,
    } = props;

    const windowWidth = useWindowWidth();

    const [mobileSelectMetricsVisible, setMobileSelectMetricsVisible] =
      React.useState<boolean>(false);
    const [mobileFiltersVisible, setMobileFiltersVisible] =
      React.useState<boolean>(false);

    const aggregatedData =
      (disaggregationName !== NoDisaggregationOption &&
        Object.values(
          datapointsGroupedByAggregateAndDisaggregations?.disaggregations[
            disaggregationName
          ] || {}
        )) ||
      datapointsGroupedByAggregateAndDisaggregations?.aggregate ||
      [];

    // all datapoints have annual frequency
    const isAnnualOnly = !aggregatedData.find(
      (dp) => dp.frequency === "MONTHLY"
    );
    // all datapoints have monthly frequency
    const isMonthlyOnly = !aggregatedData.find(
      (dp) => dp.frequency === "ANNUAL"
    );
    const hasFiskalYearFrequency = aggregatedData.some((dp) =>
      datapointFilterByFrequency(dp, "Fiscal Year")
    );
    const hasCalendarYearFrequency = aggregatedData.some((dp) =>
      datapointFilterByFrequency(dp, "Calendar Year")
    );
    const hasCustomYearFrequency = aggregatedData.some((dp) =>
      datapointFilterByFrequency(dp, "Annual: Other")
    );

    const selectedData = aggregatedData.filter((dp: Datapoint) =>
      datapointFilterByFrequency(dp, frequencyView)
    );

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
        setTimeRange("All Time");
      }
      if (!disaggregationOptions.includes(disaggregationName)) {
        setDisaggregationName(noDisaggregationOption);
        setCountOrPercentageView("Breakdown by Count");
      }
      if (disaggregationName === noDisaggregationOption) {
        setCountOrPercentageView("Breakdown by Count");
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [datapointsGroupedByAggregateAndDisaggregations]);

    useEffect(() => {
      if (disaggregationName === noDisaggregationOption) {
        setCountOrPercentageView("Breakdown by Count");
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
      // For annual metrics, get the starting month from the metric object (not zero-indexed) and subtract one to adapt to our zero-indexed months.
      const startingMonth = metricStartingMonth && metricStartingMonth - 1;
      return (
        <BarChart
          data={transformDataForBarChart(
            selectedData,
            selectedTimeRangeValue,
            countOrPercentageView,
            metricFrequency,
            startingMonth
          )}
          dimensionNames={dimensionNames}
          percentageView={
            !!disaggregationName &&
            countOrPercentageView === "Breakdown by Percentage"
          }
          resizeHeight={resizeHeight}
          ref={ref}
          metric={metricName}
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

      const frequencyOptions = dataVizFrequencyViewDisplayName.filter(
        (displayName) => {
          if (displayName === "Monthly" && !isAnnualOnly) {
            return true;
          }
          if (displayName === "Calendar Year" && hasCalendarYearFrequency) {
            return true;
          }
          if (displayName === "Fiscal Year" && hasFiskalYearFrequency) {
            return true;
          }
          if (displayName === "Annual: Other" && hasCustomYearFrequency) {
            return true;
          }

          return false;
        }
      );
      const frequencyDropdownOptions: DropdownOption[] = frequencyOptions.map(
        (option) => {
          if (isAnnualOnly) setFrequencyView(frequencyOptions[0]);

          return {
            key: option,
            label: `${option} Reporting Frequency`,
            onClick: () => setFrequencyView(option),
            highlight: frequencyView === option,
          };
        }
      );
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
          {!isMonthlyOnly && (
            <Dropdown
              label={`${frequencyView} Reporting Frequency`}
              options={frequencyDropdownOptions}
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
            <MetricHeaderWrapper isColumn={windowWidth <= MIN_DESKTOP_WIDTH}>
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
        <ChartNote>
          This graph is only showing data uploaded for the chosen reporting
          frequency. If data is missing, try changing reporting frequency.
        </ChartNote>
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
  }
);
