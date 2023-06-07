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

import React, { useCallback, useState } from "react";

import {
  DataVizAggregateName,
  RawDatapoint,
  ReportFrequency,
} from "../../types";
import {
  DatapointsMetricNameCell,
  DatapointsMetricNameCellTooltip,
  DatapointsTableBottomBorder,
  DatapointsTableContainer,
  DatapointsTableDetailsCell,
  DatapointsTableDetailsContainer,
  DatapointsTableDetailsContainerOverlay,
  DatapointsTableDetailsContainerOverlayRightGradient,
  DatapointsTableDetailScrollContainer,
  DatapointsTableDetailsDivider,
  DatapointsTableDetailsRow,
  DatapointsTableDetailsRowBody,
  DatapointsTableDetailsRowHead,
  DatapointsTableDetailsRowHeader,
  DatapointsTableDetailsTable,
  DatapointsTableNamesCell,
  DatapointsTableNamesContainer,
  DatapointsTableNamesDivider,
  DatapointsTableNamesRow,
  DatapointsTableNamesTable,
  DatapointsTableNamesTableBody,
  DatapointsTableViewTitleWrapper,
  OrangeText,
  StrikethroughText,
} from "./DatapointsTableView.styles";
import { DatapointsTitle } from "./DatapointsTitle";
import { formatDateShortMonthYear, sortDatapointDimensions } from "./utils";

type AggregationRowData = (RawDatapoint | undefined)[];

type DisaggregationRowData = {
  [disaggregation: string]: {
    [dimension: string]: (RawDatapoint | undefined)[];
  };
};

type DatapointValueCellProps = {
  key: React.Key;
  value: string | number | null;
  oldValue: string | number | null;
  isRowHovered: boolean;
  isColHovered: boolean;
  isTotalRow?: boolean;
  onMouseEnterSetHoveredCol: () => void;
  onMouseLeaveUnsetHoveredCol: () => void;
};

export const DatapointsTableView: React.FC<{
  datapoints: RawDatapoint[];
  useDataPageStyles?: boolean;
  useMultiAgencyStyles?: boolean;
  metricName: string;
  metricFrequency?: ReportFrequency;
}> = ({
  datapoints,
  useDataPageStyles,
  metricName,
  metricFrequency,
  useMultiAgencyStyles,
}) => {
  const [hoveredRowKey, setHoveredRowKey] = useState<string | null>(null);
  const [hoveredColKey, setHoveredColKey] = useState<number | null>(null);

  const setHoveredColumn = useCallback(
    (colKey: number) => setHoveredColKey(colKey),
    []
  );
  const unsetHoveredColumn = useCallback(() => setHoveredColKey(null), []);

  if (!datapoints) return null;

  const startDates = Array.from(
    new Set(datapoints.map((dp) => dp.start_date))
  ).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  // Create array of aggregate values, each value indexed with their corresponding date column
  const aggregateRowData: AggregationRowData = new Array(
    startDates.length
  ).fill(undefined);

  // Create map of disaggregations and dimensions, each dimension containing array of values,
  // each value indexed with their corresponding date column
  const disaggregationRowData: DisaggregationRowData = {};

  // create a mapping from start date to the column index the start date is located in for fast lookup
  const startDatesIndexLookup = startDates.reduce((map, current, idx) => {
    map[current] = idx; /* eslint-disable-line no-param-reassign */
    return map;
  }, {} as { [key: string]: number });

  datapoints.forEach((dp) => {
    if (dp.disaggregation_display_name && dp.dimension_display_name) {
      if (!disaggregationRowData[dp.disaggregation_display_name]) {
        disaggregationRowData[dp.disaggregation_display_name] = {};
      }
      if (
        !disaggregationRowData[dp.disaggregation_display_name][
          dp.dimension_display_name
        ]
      ) {
        disaggregationRowData[dp.disaggregation_display_name][
          dp.dimension_display_name
        ] = new Array(startDates.length).fill(undefined);
      }
      if (
        !disaggregationRowData[dp.disaggregation_display_name][
          dp.dimension_display_name
        ][startDatesIndexLookup[dp.start_date]]
      ) {
        disaggregationRowData[dp.disaggregation_display_name][
          dp.dimension_display_name
        ][startDatesIndexLookup[dp.start_date]] = dp;
      }
    } else if (!aggregateRowData[startDatesIndexLookup[dp.start_date]]) {
      aggregateRowData[startDatesIndexLookup[dp.start_date]] = dp;
    }
  });

  return (
    <>
      {useDataPageStyles && (
        <DatapointsTableViewTitleWrapper>
          <DatapointsTitle
            metricName={metricName}
            metricFrequency={metricFrequency}
          />
        </DatapointsTableViewTitleWrapper>
      )}
      <DatapointsTableContainer useDataPageStyles={useDataPageStyles}>
        <DatapointsTableNamesContainer useDataPageStyles={useDataPageStyles}>
          <DatapointsTableNamesTable>
            <DatapointsTableNamesTableBody>
              {!useDataPageStyles && (
                <DatapointsTableNamesRow>
                  <DatapointsMetricNameCell
                    title={metricName}
                    useMultiAgencyStyles={useMultiAgencyStyles}
                  >
                    {metricName}
                    <DatapointsMetricNameCellTooltip>
                      {metricName}
                    </DatapointsMetricNameCellTooltip>
                  </DatapointsMetricNameCell>
                </DatapointsTableNamesRow>
              )}
              <DatapointsTableNamesRow>
                <DatapointsTableNamesCell
                  isTotalRow
                  useDataPageStyles={useDataPageStyles}
                  onMouseEnter={() => setHoveredRowKey("Total")}
                  onMouseLeave={() => setHoveredRowKey(null)}
                >
                  {DataVizAggregateName}
                </DatapointsTableNamesCell>
              </DatapointsTableNamesRow>
              {Object.entries(disaggregationRowData).map(
                ([disaggregation, dimension], index, array) => (
                  <React.Fragment key={disaggregation}>
                    <DatapointsTableNamesRow>
                      <DatapointsTableNamesDivider>
                        {disaggregation}
                      </DatapointsTableNamesDivider>
                    </DatapointsTableNamesRow>
                    {Object.keys(dimension)
                      .sort(sortDatapointDimensions)
                      .map((dimensionName) => (
                        <DatapointsTableNamesRow key={dimensionName}>
                          <DatapointsTableNamesCell
                            title={dimensionName}
                            onMouseEnter={() => setHoveredRowKey(dimensionName)}
                            onMouseLeave={() => setHoveredRowKey(null)}
                          >
                            {dimensionName}
                          </DatapointsTableNamesCell>
                        </DatapointsTableNamesRow>
                      ))}
                    {index + 1 < array.length && (
                      <DatapointsTableBottomBorder />
                    )}
                  </React.Fragment>
                )
              )}
            </DatapointsTableNamesTableBody>
          </DatapointsTableNamesTable>
        </DatapointsTableNamesContainer>
        <DatapointsTableDetailsContainer useDataPageStyles={useDataPageStyles}>
          <DatapointsTableDetailScrollContainer>
            <DatapointsTableDetailsTable cellPadding="16px">
              <DatapointsTableDetailsRowHead>
                <DatapointsTableDetailsRow>
                  {startDates.map((date, index) => (
                    <DatapointsTableDetailsRowHeader
                      key={date}
                      useDataPageStyles={useDataPageStyles}
                      onMouseEnter={() => setHoveredColKey(index)}
                      onMouseLeave={() => setHoveredColKey(null)}
                      isColHovered={index === hoveredColKey}
                    >
                      <span>{formatDateShortMonthYear(date)}</span>
                    </DatapointsTableDetailsRowHeader>
                  ))}
                </DatapointsTableDetailsRow>
              </DatapointsTableDetailsRowHead>
              <DatapointsTableDetailsRowBody>
                <DatapointsTableDetailsRow>
                  {aggregateRowData.map((dp, index) =>
                    // row data could be null, so no distinct key given in that case
                    dp === undefined
                      ? renderDatapointsValue({
                          key: index,
                          value: null,
                          oldValue: null,
                          isRowHovered: hoveredRowKey === "Total",
                          isColHovered: index === hoveredColKey,
                          isTotalRow: true,
                          onMouseEnterSetHoveredCol: () =>
                            setHoveredColumn(index),
                          onMouseLeaveUnsetHoveredCol: unsetHoveredColumn,
                        })
                      : renderDatapointsValue({
                          key: index,
                          value: dp.value,
                          oldValue: dp.old_value,
                          isRowHovered: hoveredRowKey === "Total",
                          isColHovered: index === hoveredColKey,
                          isTotalRow: true,
                          onMouseEnterSetHoveredCol: () =>
                            setHoveredColumn(index),
                          onMouseLeaveUnsetHoveredCol: unsetHoveredColumn,
                        })
                  )}
                </DatapointsTableDetailsRow>
                {Object.entries(disaggregationRowData).map(
                  ([disaggregation, dimension], outerIndex, array) => (
                    <React.Fragment key={disaggregation}>
                      <DatapointsTableDetailsDivider />
                      {Object.entries(dimension)
                        .sort(([a], [b]) => sortDatapointDimensions(a, b))
                        .map(([key, dps]) => (
                          <DatapointsTableDetailsRow key={key}>
                            {dps.map((dp, index) =>
                              dp === undefined
                                ? renderDatapointsValue({
                                    key: index,
                                    value: null,
                                    oldValue: null,
                                    isRowHovered: key === hoveredRowKey,
                                    isColHovered: index === hoveredColKey,
                                    onMouseEnterSetHoveredCol: () =>
                                      setHoveredColumn(index),
                                    onMouseLeaveUnsetHoveredCol:
                                      unsetHoveredColumn,
                                  })
                                : renderDatapointsValue({
                                    key: index,
                                    value: dp.value,
                                    oldValue: dp.old_value,
                                    isRowHovered: key === hoveredRowKey,
                                    isColHovered: index === hoveredColKey,
                                    onMouseEnterSetHoveredCol: () =>
                                      setHoveredColumn(index),
                                    onMouseLeaveUnsetHoveredCol:
                                      unsetHoveredColumn,
                                  })
                            )}
                          </DatapointsTableDetailsRow>
                        ))}
                      {outerIndex + 1 < array.length && (
                        <DatapointsTableBottomBorder />
                      )}
                    </React.Fragment>
                  )
                )}
              </DatapointsTableDetailsRowBody>
            </DatapointsTableDetailsTable>
          </DatapointsTableDetailScrollContainer>
          <DatapointsTableDetailsContainerOverlay>
            <DatapointsTableDetailsContainerOverlayRightGradient />
          </DatapointsTableDetailsContainerOverlay>
        </DatapointsTableDetailsContainer>
      </DatapointsTableContainer>
    </>
  );
};

const renderDatapointsValue = (props: DatapointValueCellProps) => {
  const {
    key,
    value,
    oldValue,
    isColHovered,
    isRowHovered,
    isTotalRow,
    onMouseEnterSetHoveredCol,
    onMouseLeaveUnsetHoveredCol,
  } = props;
  // Uncomment this for special treatment when a datapoint is newly added
  // as opposed to returning the same value
  // if (oldValue === null && value !== null) {
  //   return (
  //     <DatapointsTableDetailsCell key={key}>
  //       {value} NEW
  //     </DatapointsTableDetailsCell>
  //   );
  // }
  if (oldValue !== null && oldValue !== value) {
    return (
      <DatapointsTableDetailsCell
        key={key}
        isColumnHovered={isColHovered}
        isRowHovered={isRowHovered}
        isTotalRow={isTotalRow}
        onMouseEnter={onMouseEnterSetHoveredCol}
        onMouseLeave={onMouseLeaveUnsetHoveredCol}
      >
        <StrikethroughText>{oldValue}</StrikethroughText>
        {` ➞ `}
        {value?.toLocaleString("en-US") || "-"}
        <OrangeText>*</OrangeText>
      </DatapointsTableDetailsCell>
    );
  }
  return (
    <DatapointsTableDetailsCell
      key={key}
      isColumnHovered={isColHovered}
      isRowHovered={isRowHovered}
      isTotalRow={isTotalRow}
      onMouseEnter={onMouseEnterSetHoveredCol}
      onMouseLeave={onMouseLeaveUnsetHoveredCol}
    >
      {value?.toLocaleString("en-US") || "-"}
    </DatapointsTableDetailsCell>
  );
};
