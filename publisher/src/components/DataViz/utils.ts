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

import { incrementMonth } from "@justice-counts/common/components/DataViz/utils";
import {
  Datapoint,
  DataVizCountOrPercentageView,
  DataVizTimeRange,
} from "@justice-counts/common/types";
import { mapValues, pickBy } from "lodash";

export const thirtyOneDaysInSeconds = 2678400000;
export const threeHundredSixtySixDaysInSeconds = 31622400000;

export const nextMonthMap = new Map<string, string>([
  ["Jan", "Feb"],
  ["Feb", "Mar"],
  ["Mar", "Apr"],
  ["Apr", "May"],
  ["May", "Jun"],
  ["Jun", "Jul"],
  ["Jul", "Aug"],
  ["Aug", "Sep"],
  ["Sep", "Oct"],
  ["Oct", "Nov"],
  ["Nov", "Dec"],
  ["Dec", "Jan"],
]);

const abbreviatedMonths = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const getDatapointDimensions = (datapoint: Datapoint) =>
  // gets the datapoint object minus the non-dimension keys "start_date", "end_date", "frequency", "dataVizMissingData"
  pickBy(
    datapoint,
    (val, key) =>
      key !== "start_date" &&
      key !== "end_date" &&
      key !== "frequency" &&
      key !== "dataVizMissingData"
  );

export const getSumOfDimensionValues = (datapoint: Datapoint) => {
  let sumOfDimensions = 0;
  const dimensions = getDatapointDimensions(datapoint);
  Object.values(dimensions).forEach((value) => {
    sumOfDimensions += value as number;
  });
  return sumOfDimensions;
};

export const incrementYear = (date: Date) => {
  const clonedDate = new Date(date.getTime());
  clonedDate.setFullYear(clonedDate.getFullYear() + 1);
  return clonedDate;
};

// returns a new Date set to the GMT time zone
// for comparing with Datapoint time strings which are also set to 00:00:00 GMT.
export const createGMTDate = (
  day: number,
  monthIndex: number,
  year: number
) => {
  return new Date(
    `${day} ${abbreviatedMonths[monthIndex]} ${year} 00:00:00 GMT`
  );
};

export const getHighestTotalValue = (data: Datapoint[]) => {
  let highestValue = 0;
  data.forEach((datapoint) => {
    const sumOfDimensions = getSumOfDimensionValues(datapoint);
    if (sumOfDimensions > highestValue) {
      highestValue = sumOfDimensions;
    }
  });
  return highestValue;
};

// functions to transform and filter an array of Datapoints to display in a chart

export const filterByTimeRange = (
  data: Datapoint[],
  monthsAgo: DataVizTimeRange
) => {
  if (monthsAgo === 0) {
    return data;
  }
  const earliestDate = new Date();
  earliestDate.setMonth(earliestDate.getMonth() - monthsAgo);
  earliestDate.setHours(
    earliestDate.getHours() - earliestDate.getTimezoneOffset() / 60
  ); // account for timezone offset since datapoint dates are in UTC+0 time.
  return data.filter((dp) => {
    return new Date(dp.start_date) >= earliestDate;
  });
};

export const transformToRelativePerchanges = (data: Datapoint[]) => {
  return data.map((datapoint) => {
    const dimensions = getDatapointDimensions(datapoint);
    const sumOfDimensions = getSumOfDimensionValues(datapoint);
    const dimensionsPercentage = mapValues(dimensions, (val, key) => {
      if (typeof val === "number" && val !== 0) {
        return val / sumOfDimensions;
      }
      return val;
    });
    return {
      ...datapoint,
      ...dimensionsPercentage,
    };
  });
};

export const filterNullDatapoints = (data: Datapoint[]) => {
  return data.filter((datapoint) => {
    const dimensions = getDatapointDimensions(datapoint);
    let hasReportedValues = false;
    Object.values(dimensions).every((dimValue) => {
      if (dimValue !== null) {
        hasReportedValues = true;
        return false;
      }
      return true;
    });
    return hasReportedValues;
  });
};

/**
 * A gap datapoint represents a time range with no reported data
 * and is formatted by setting all dimension values to 0
 * and setting the value of "dataVizMissingData" to ~1/3 the height of the bar on the chart.
 *
 * This method generates gap datapoints between datapoints up to a certain number of months ago.
 */
export const fillTimeGapsBetweenDatapoints = (
  data: Datapoint[],
  monthsAgo: number
) => {
  if (data.length === 0) {
    return data;
  }

  const isAnnual = data[0].frequency === "ANNUAL";
  const increment = isAnnual ? incrementYear : incrementMonth;
  const defaultBarValue = getHighestTotalValue(data) / 3;
  const dataWithGapDatapoints = [...data];
  // create the map of dimensions with zero values
  const dimensionsMap = mapValues(getDatapointDimensions(data[0]), (_) => 0);

  // loop through all the datapoints
  let totalOffset = 0; // whenever we insert a gap datapoint into `dataWithGapDatapoints`, increment the totalOffset
  let lastDate = new Date();
  if (isAnnual) {
    lastDate.setFullYear(lastDate.getFullYear() - monthsAgo / 12);
  } else {
    lastDate.setMonth(lastDate.getMonth() - monthsAgo);
  }
  lastDate = createGMTDate(
    1,
    isAnnual ? 0 : lastDate.getMonth(),
    lastDate.getFullYear()
  );
  for (let i = 0; i < data.length; i += 1) {
    const currentDate = new Date(data[i].start_date);
    const timeInterval =
      data[0].frequency === "MONTHLY"
        ? thirtyOneDaysInSeconds
        : threeHundredSixtySixDaysInSeconds;
    // this while loop can insert multiple gap datapoints between datapoints
    // so must increment this offset to maintain correct insert order
    let offset = 0;
    while (currentDate.getTime() - lastDate.getTime() > timeInterval) {
      lastDate = increment(lastDate);
      dataWithGapDatapoints.splice(i + offset + totalOffset, 0, {
        start_date: lastDate.toUTCString(),
        end_date: increment(lastDate).toUTCString(),
        dataVizMissingData: defaultBarValue,
        frequency: data[0].frequency,
        ...dimensionsMap,
      });
      offset += 1;
    }
    totalOffset += offset;
    lastDate = currentDate;
  }

  return dataWithGapDatapoints;
};

export const transformData = (
  d: Datapoint[],
  monthsAgo: DataVizTimeRange,
  dataVizViewSetting: DataVizCountOrPercentageView
) => {
  let transformedData = [...d];

  if (transformedData.length === 0) {
    return transformedData;
  }

  // filter by time range
  transformedData = filterByTimeRange(transformedData, monthsAgo);

  transformedData = filterNullDatapoints(transformedData);

  // format data into percentages for percentage view
  if (dataVizViewSetting === "Percentage") {
    transformedData = transformToRelativePerchanges(transformedData);
  }

  return fillTimeGapsBetweenDatapoints(transformedData, monthsAgo);
};