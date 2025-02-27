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

import React, { useCallback, useState } from "react";
import { useInView } from "react-intersection-observer";

import {
  DataVizAggregateName,
  RawDatapoint,
  ReportFrequency,
} from "../../types";
import { replaceSymbolsWithDash } from "../../utils";
import { Badge, reportFrequencyBadgeColors } from "../Badge";
import {
  DatapointsMetricNameCell,
  DatapointsTableBottomBorder,
  DatapointsTableContainer,
  DatapointsTableDetailsCell,
  DatapointsTableDetailsContainer,
  DatapointsTableDetailsContainerOverlay,
  DatapointsTableDetailsContainerOverlayLeftGradient,
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
  Legend,
  OrangeText,
  StrikethroughText,
} from "./DatapointsTableView.styles";
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

const getFrequencyIndicator = (date: string, frequency: ReportFrequency) => {
  const month = new Date(date).getUTCMonth() + 1;

  if (frequency === "MONTHLY") {
    return "M";
  }

  switch (month) {
    case 1:
      return "CY";
    case 7:
      return "FY";
    default:
      return "CMY";
  }
};

export const FrequencyIndicatorsLegend: React.FC = () => (
  <Legend>
    Recording Frequency Indicators:
    <Badge color="GREEN" noMargin>
      M
    </Badge>
    - Monthly,
    <Badge color="ORANGE" noMargin>
      CY
    </Badge>
    - Calendar Year,
    <Badge color="ORANGE" noMargin>
      FY
    </Badge>
    - Fiscal Year,
    <Badge color="ORANGE" noMargin>
      CMY
    </Badge>
    - Custom Year
  </Legend>
);

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
  const leftShadow = useInView();
  const rightShadow = useInView();
  const [hoveredRowKey, setHoveredRowKey] = useState<string | null>(null);
  const [hoveredColKey, setHoveredColKey] = useState<number | null>(null);

  const setHoveredColumn = useCallback(
    (colKey: number) => setHoveredColKey(colKey),
    []
  );
  const unsetHoveredColumn = useCallback(() => setHoveredColKey(null), []);

  if (!datapoints) return null;

  // Start dates with respected frequency for each datapoint (grouped date-frequency keys)
  const startDatesWithFrequency = Array.from(
    new Set(datapoints.map((dp) => `${dp.start_date}_${dp.frequency}`))
  ).sort((a, b) => {
    const [dateA, freqA] = a.split("_");
    const [dateB, freqB] = b.split("_");
    return (
      new Date(dateA).getTime() - new Date(dateB).getTime() ||
      freqA.localeCompare(freqB)
    );
  });

  // Create array of aggregate values, each value indexed with their corresponding date-frequency column
  const aggregateRowData: AggregationRowData = new Array(
    startDatesWithFrequency.length
  ).fill(undefined);

  // Create map of disaggregations and dimensions, each dimension containing array of values,
  // each value indexed with their corresponding date-frequency column
  const disaggregationRowData: DisaggregationRowData = {};

  // create a mapping from date-frequency to the column index the date-frequency is located in for fast lookup
  const startDatesIndexLookup = startDatesWithFrequency.reduce(
    (map, current, idx) => {
      map[current] = idx; /* eslint-disable-line no-param-reassign */
      return map;
    },
    {} as { [key: string]: number }
  );

  datapoints.forEach((dp) => {
    const dateFrequencyKey = `${dp.start_date}_${dp.frequency}`;

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
        ] = new Array(startDatesWithFrequency.length).fill(undefined);
      }
      if (
        !disaggregationRowData[dp.disaggregation_display_name][
          dp.dimension_display_name
        ][startDatesIndexLookup[dateFrequencyKey]]
      ) {
        disaggregationRowData[dp.disaggregation_display_name][
          dp.dimension_display_name
        ][startDatesIndexLookup[dateFrequencyKey]] = dp;
      }
    } else if (!aggregateRowData[startDatesIndexLookup[dateFrequencyKey]]) {
      aggregateRowData[startDatesIndexLookup[dateFrequencyKey]] = dp;
    }
  });

  return (
    <>
      {useDataPageStyles && <FrequencyIndicatorsLegend />}
      <DatapointsTableContainer useDataPageStyles={useDataPageStyles}>
        <DatapointsTableNamesContainer useDataPageStyles={useDataPageStyles}>
          <DatapointsTableNamesTable>
            <DatapointsTableNamesTableBody>
              {!useDataPageStyles && (
                <DatapointsTableNamesRow>
                  <DatapointsMetricNameCell
                    id={replaceSymbolsWithDash(metricName)}
                    title={metricName}
                    useMultiAgencyStyles={useMultiAgencyStyles}
                  >
                    {metricName}
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
                            id={replaceSymbolsWithDash(dimensionName)}
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
                  {startDatesWithFrequency.map((dateFrequencyKey, index) => {
                    const [date, frequency] = dateFrequencyKey.split("_") as [
                      string,
                      ReportFrequency
                    ];

                    return (
                      <DatapointsTableDetailsRowHeader
                        key={dateFrequencyKey}
                        useDataPageStyles={useDataPageStyles}
                        onMouseEnter={() => setHoveredColKey(index)}
                        onMouseLeave={() => setHoveredColKey(null)}
                        isColHovered={index === hoveredColKey}
                      >
                        {/* Shadow's anchors */}
                        {index === 0 && <div ref={leftShadow.ref} />}
                        {index === startDatesWithFrequency.length - 1 && (
                          <div ref={rightShadow.ref} />
                        )}

                        <span>
                          {formatDateShortMonthYear(date)}
                          <Badge color={reportFrequencyBadgeColors[frequency]}>
                            {getFrequencyIndicator(date, frequency)}
                          </Badge>
                        </span>
                      </DatapointsTableDetailsRowHeader>
                    );
                  })}
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
            <DatapointsTableDetailsContainerOverlayLeftGradient
              isShowing={!leftShadow.inView}
            />
            <DatapointsTableDetailsContainerOverlayRightGradient
              isShowing={!rightShadow.inView}
            />
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
