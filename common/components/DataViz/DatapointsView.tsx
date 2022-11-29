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

import { ReactComponent as GridIcon } from "@justice-counts/common/assets/grid-icon.svg";
import BarChart from "@justice-counts/common/components/DataViz/BarChart";
import { DatapointsTitle } from "@justice-counts/common/components/DataViz/DatapointsTitle";
import {
  BottomMetricInsightsContainer,
  DatapointsViewContainer,
  DatapointsViewControlsContainer,
  DatapointsViewControlsDropdown,
  DatapointsViewControlsRow,
  DatapointsViewHeaderWrapper,
  ExtendedDropdown,
  ExtendedDropdownMenuItem,
  MetricHeaderWrapper,
  MobileFiltersButton,
  MobileFiltersRow,
  MobileSelectMetricsButton,
  MobileSelectMetricsButtonContainer,
  MobileSelectMetricsModalContainer,
  SelectMetricsButtonContainer,
  SelectMetricsButtonText,
} from "@justice-counts/common/components/DataViz/DatapointsView.styles";
import Legend from "@justice-counts/common/components/DataViz/Legend";
import { MetricInsights } from "@justice-counts/common/components/DataViz/MetricInsights";
import { sortDatapointDimensions } from "@justice-counts/common/components/DataViz/utils";
import {
  DatapointsGroupedByAggregateAndDisaggregations,
  DataVizAggregateName,
  DataVizTimeRangeDisplayName,
  DataVizTimeRangesMap,
  DataVizViewSetting,
  DimensionNamesByDisaggregation,
  ReportFrequency,
} from "@justice-counts/common/types";
import { DropdownMenu, DropdownToggle } from "@recidiviz/design-system";
import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";

import DataVizStore from "../../stores/DataVizStore";

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
}> = ({ onSelect, options }) => (
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
        >
          {value}
        </ExtendedDropdownMenuItem>
      ))}
    </DropdownMenu>
  </ExtendedDropdown>
);

const DatapointsViewUnobserved: React.FC<{
  metricKey: string;
  datapointsGroupedByAggregateAndDisaggregations: DatapointsGroupedByAggregateAndDisaggregations;
  dimensionNamesByDisaggregation: DimensionNamesByDisaggregation;
  dataVizStore: DataVizStore;
  metricName?: string;
  metricFrequency?: ReportFrequency;
  metricNames?: string[];
  onMetricsSelect?: (metric: string) => void;
  showBottomMetricInsights?: boolean;
  resizeHeight?: boolean;
}> = ({
  metricKey,
  datapointsGroupedByAggregateAndDisaggregations,
  dimensionNamesByDisaggregation,
  dataVizStore,
  metricName,
  metricFrequency,
  metricNames,
  onMetricsSelect,
  showBottomMetricInsights = false,
  resizeHeight = false,
}) => {
  const {
    timeRange,
    disaggregation,
    viewSetting,
    getFilteredDatapoints,
    getFilteredAggregateDatapoints,
    setTimeRange,
    setDisaggregation,
    setViewSetting,
  } = dataVizStore;

  const [mobileSelectMetricsVisible, setMobileSelectMetricsVisible] =
    React.useState<boolean>(false);

  const data = getFilteredDatapoints(metricKey);
  const isAnnual = data[0]?.frequency === "ANNUAL";
  const disaggregations = Object.keys(dimensionNamesByDisaggregation);
  const disaggregationOptions = [...disaggregations];
  disaggregationOptions.unshift(noDisaggregationOption);
  const dimensionNames =
    disaggregation !== noDisaggregationOption
      ? (dimensionNamesByDisaggregation[disaggregation] || [])
          .slice() // Must use slice() before sorting a MobX observableArray
          .sort(sortDatapointDimensions)
      : [DataVizAggregateName];

  const selectedTimeRangeValue = DataVizTimeRangesMap[timeRange];

  useEffect(() => {
    if (isAnnual && selectedTimeRangeValue === 6) {
      setTimeRange("All");
    }
    if (!disaggregationOptions.includes(disaggregation)) {
      setDisaggregation(noDisaggregationOption);
      setViewSetting("Count");
    }
    if (disaggregation === noDisaggregationOption) {
      setViewSetting("Count");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datapointsGroupedByAggregateAndDisaggregations]);

  useEffect(() => {
    if (disaggregation === noDisaggregationOption) {
      setViewSetting("Count");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disaggregation]);

  /** Prevent body from scrolling when modal is open */
  useEffect(() => {
    if (mobileSelectMetricsVisible) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileSelectMetricsVisible]);

  const renderChartForMetric = () => {
    return (
      <BarChart
        data={data}
        dimensionNames={dimensionNames}
        percentageView={!!disaggregation && viewSetting === "Percentage"}
        resizeHeight={resizeHeight}
      />
    );
  };

  const renderLegend = () => {
    if (disaggregation !== noDisaggregationOption) {
      return <Legend names={dimensionNames} />;
    }
    return <Legend />;
  };

  const renderDataVizControls = () => {
    return (
      <DatapointsViewControlsContainer>
        <DatapointsViewControlsDropdown
          title="Date Range"
          selectedValue={timeRange}
          options={
            isAnnual
              ? Object.keys(DataVizTimeRangesMap).filter(
                  (key) => key !== "6 Months Ago"
                )
              : Object.keys(DataVizTimeRangesMap)
          }
          onSelect={(key) => {
            setTimeRange(key as DataVizTimeRangeDisplayName);
          }}
        />
        {disaggregationOptions.length > 1 && (
          <DatapointsViewControlsDropdown
            title="Disaggregation"
            selectedValue={disaggregation}
            options={disaggregationOptions}
            onSelect={(key) => {
              setDisaggregation(key);
            }}
          />
        )}
        {disaggregation !== noDisaggregationOption && (
          <DatapointsViewControlsDropdown
            title="View"
            selectedValue={viewSetting}
            options={["Count", "Percentage"]}
            onSelect={(key) => {
              setViewSetting(key as DataVizViewSetting);
            }}
          />
        )}
      </DatapointsViewControlsContainer>
    );
  };

  const filteredAggregateData = getFilteredAggregateDatapoints(metricKey);

  return (
    <DatapointsViewContainer>
      <DatapointsViewHeaderWrapper>
        {metricName && (
          <MetricHeaderWrapper>
            <DatapointsTitle
              metricName={metricName}
              metricFrequency={metricFrequency}
            />
            {data.length > 0 && (
              <MetricInsights datapoints={filteredAggregateData} />
            )}
          </MetricHeaderWrapper>
        )}
      </DatapointsViewHeaderWrapper>
      <DatapointsViewControlsRow>
        {metricNames && onMetricsSelect && (
          <SelectMetricButtonDropdown
            options={metricNames}
            onSelect={onMetricsSelect}
          />
        )}
        {renderDataVizControls()}
      </DatapointsViewControlsRow>
      <MobileFiltersRow>
        <MobileFiltersButton />
      </MobileFiltersRow>
      {renderChartForMetric()}
      {renderLegend()}
      {showBottomMetricInsights && (
        <BottomMetricInsightsContainer>
          <MetricInsights datapoints={filteredAggregateData} />
        </BottomMetricInsightsContainer>
      )}
      <MobileSelectMetricsButtonContainer>
        <MobileSelectMetricsButton
          onClick={() => setMobileSelectMetricsVisible(true)}
        >
          <GridIcon />
          <SelectMetricsButtonText />
        </MobileSelectMetricsButton>
      </MobileSelectMetricsButtonContainer>
      {mobileSelectMetricsVisible && <MobileSelectMetricsModalContainer />}
    </DatapointsViewContainer>
  );
};

export const DatapointsView = observer(DatapointsViewUnobserved);
