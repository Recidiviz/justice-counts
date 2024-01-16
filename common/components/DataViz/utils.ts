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

import { mapValues, pickBy } from "lodash";

import {
  Datapoint,
  DataVizAggregateName,
  DataVizCountOrPercentageView,
  DataVizTimeRange,
  DataVizTimeRangesMap,
  Metric,
  ReportFrequency,
} from "../../types";
import { formatNumberInput, printDateAsShortMonthYear } from "../../utils";

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

export const abbreviatedMonths = [
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

const abbreviatedMonthsNumber: { [key: string]: string } = {
  Jan: "01",
  Feb: "02",
  Mar: "03",
  Apr: "04",
  May: "05",
  Jun: "06",
  Jul: "07",
  Aug: "08",
  Sep: "09",
  Oct: "10",
  Nov: "11",
  Dec: "12",
};

export const splitUtcString = (utcString: string) => {
  const [dayOfWeek, day, month, year, time, timezone] = utcString.split(" ");
  return {
    dayOfWeek,
    day,
    month,
    year,
    time,
    timezone,
  };
};

export const getMonthYearBasedOnMonth = ({
  monthStr,
  yearStr,
}: {
  monthStr: string;
  yearStr: string;
  monthIndex?: number;
}) => {
  const monthIndex = abbreviatedMonths.indexOf(monthStr);
  const prevMonth = abbreviatedMonths[monthIndex - 1];
  const nextMonth = abbreviatedMonths[monthIndex + 1];
  const finalMonth = monthStr !== "Jan" ? prevMonth : monthStr;

  const year = Number(yearStr);
  const incrementedYear = year + 1;
  const finalYear =
    finalMonth !== abbreviatedMonths[0] ? incrementedYear : year;

  const startDate =
    monthStr !== "Jan" ? `${nextMonth} ${year - 1}` : `${monthStr} ${yearStr}`;

  return {
    month: finalMonth,
    year: finalYear,
    startDate,
    displayDate: `${finalMonth} ${finalYear}`,
  };
};

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

export const sortDatapointDimensions = (dimA: string, dimB: string) => {
  // sort alphabetically, except put "Other" and "Unknown" at the end.
  if (dimA.startsWith("Hispanic or Latino")) {
    return -1;
  }
  if (dimB.startsWith("Hispanic or Latino")) {
    return 1;
  }
  if (dimA.startsWith("Other") && dimB.startsWith("Unknown")) {
    return -1;
  }
  if (dimB.startsWith("Other") && dimA.startsWith("Unknown")) {
    return 1;
  }
  if (dimA.startsWith("Other") || dimA.startsWith("Unknown")) {
    return 1;
  }
  if (dimB.startsWith("Other") || dimB.startsWith("Unknown")) {
    return -1;
  }
  return dimA.localeCompare(dimB);
};

export const getSumOfDimensionValues = (datapoint: Datapoint) => {
  let sumOfDimensions = 0;
  const dimensions = getDatapointDimensions(datapoint);
  Object.values(dimensions).forEach((value) => {
    sumOfDimensions += value as number;
  });
  return sumOfDimensions;
};

// write my own month incrementer since Date.setMonth doesn't keep the date the same...
export const incrementMonth = (date: Date) => {
  const { day, month, year, time, timezone } = splitUtcString(
    date.toUTCString()
  );
  return new Date(
    `${day} ${nextMonthMap.get(month)} ${
      month === "Dec" ? Number(year) + 1 : year
    } ${time} ${timezone}`
  );
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
    const dimensionsPercentage = mapValues(dimensions, (val) => {
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
  monthsAgo: number,
  metricFrequency?: ReportFrequency,
  startingMonth?: number // For annual metrics, represents the starting month of the recording period
) => {
  if (data.length === 0) {
    return data;
  }

  const frequency = metricFrequency || data[0].frequency;
  const isAnnual = frequency === "ANNUAL";
  const isNonCalendarYearMetric = startingMonth !== 0;

  // Represents how high the empty gap bars go - 1/3 of the highest value
  const defaultBarValue = getHighestTotalValue(data) / 3;
  // Create the map of dimensions with zero values
  const dimensionsMap = mapValues(getDatapointDimensions(data[0]), (_) => 0);
  // Sort datapoints in ascending order by start date
  const dataSortedByStartDate = data.sort(
    (a, b) => +new Date(a.start_date) - +new Date(b.start_date)
  );
  // Get references for the current date
  const currentDate = new Date();
  const currentMonth = currentDate.getUTCMonth();
  const currentYear = currentDate.getUTCFullYear();
  // Get references for the earliest and latest datapoints
  const firstDatapointDate = new Date(dataSortedByStartDate[0].start_date);
  const firstDatapointStartMonth = firstDatapointDate.getUTCMonth();
  const firstDatapointStartYear = firstDatapointDate.getUTCFullYear();

  /**
   * The `timeRangeStart___` references helps us determine the beginning of the filtered time window if `monthsAgo`
   * is provided (not 0). If `monthsAgo` is 0, we will show the user all of the datapoints and no
   * longer depend on these reference points. If the `monthsAgo` is a non-zero number (for example, 60 months),
   * then we set the reference point to 5 years ago from the current date.
   */
  const timeRangeStartMonth = currentMonth - monthsAgo;
  const timeRangeStartYear = currentYear - monthsAgo / 12;

  /**
   * Create a new reference point date object and set it to the previously calculated reference month/year
   * depending on the metric's frequency.
   */
  const timeRangeStartDate = new Date();
  if (isAnnual) {
    timeRangeStartDate.setUTCFullYear(timeRangeStartYear);
  } else {
    timeRangeStartDate.setUTCMonth(timeRangeStartMonth);
  }

  // If `monthsAgo` is 0, user intends to see all datapoints, the length of the array will be the years inbetween the first datapoint year and the current year
  // If `monthsAgo` is non-zero, user intends to see a specific time-range, the length of the array will be the years inbetween the current year and the year a # of `monthsAgo`
  const annualTimeRangeLength =
    monthsAgo === 0 ? currentYear - firstDatapointStartYear : monthsAgo / 12;

  // If `monthsAgo` is 0, user intends to see all datapoints, the length of the array will be the months inbetween the first datapoint date and the current date
  // If `monthsAgo` is non-zero, user intends to see a specific time-range, the length of the array will be the months inbetween the current date and the # of `monthsAgo`
  const monthlyTimeRangeFromCurrentDate =
    currentMonth -
    firstDatapointStartMonth +
    12 * (currentYear - firstDatapointStartYear);
  const monthlyTimeRangeLength =
    monthsAgo === 0 ? monthlyTimeRangeFromCurrentDate : monthsAgo;

  /**
   * Create an array of dates that represent our viewing time-frame (i.e. the range of time the user filtered to - e.g. 5 years ago)
   * If `monthsAgo` is 60 months and the metric frequency is annual, the array will look like this: [<Current Date (2023)>, <2022 Date>, <2021 Date>, <2020 Date>, <2019 Date>]
   * If `monthsAgo` is 0 months and the metric frequency is annual, the array will look like this: [<Current Date>, ...<Dates (years) inbetween> ,<First Datapoint Date>]
   * If `monthsAgo` is 12 months and the metric frequency is monthly, the array will look like this: [<Current Date>, ...<Dates (months) inbetween> , <Date 12 months ago>]
   * If `monthsAgo` is 0 months and the metric frequency is monthly, the array will look like this: [<Current Date>, ...<Dates (months) inbetween> ,<First Datapoint Date>]
   */
  const timeFrameArray = Array.from(
    {
      length: isAnnual ? annualTimeRangeLength : monthlyTimeRangeLength,
    },
    (_, i) => {
      // For monthly metrics, decrement the date so we start with the current date and subtract months on each loop.
      const decrementedDate = new Date(
        new Date().getUTCFullYear(),
        new Date().getUTCMonth(),
        1
      );
      decrementedDate.setUTCMonth(decrementedDate.getUTCMonth() - i);

      const date = createGMTDate(
        1,
        isAnnual ? startingMonth || 0 : decrementedDate.getUTCMonth(),
        // Since non-calendar year (e.g. fiscal year) datapoints will be displayed by end year (start year + 1)
        // instead of start year, we need to go back an extra year to counter balance the +1 forward shift, otherwise
        // a current year (2024) will be displayed as 2025 and there will be a missing year between the earliest
        // datapoint and the earliest gap datapoint.
        isAnnual
          ? isNonCalendarYearMetric
            ? currentYear - i - 1
            : currentYear - i
          : decrementedDate.getUTCFullYear()
      );

      return date;
    }
  );

  const filteredDatapoints = data.filter((dp) => {
    // If `monthsAgo` is 0, we show all datapoints
    if (monthsAgo === 0) return true;
    // If `monthsAgo` is non-zero, we filter out datapoints outside of the time-frame window
    const datapointStartDate = new Date(dp.start_date);
    if (
      datapointStartDate.getUTCMonth() < timeRangeStartDate.getUTCMonth() &&
      datapointStartDate.getUTCFullYear() < timeRangeStartDate.getUTCFullYear()
    ) {
      return false;
    }
    return true;
  });

  /**
   * Create an array of gap datapoint timeframes by computing the difference between two sets, the
   * current viewing window timeframes' set and the datapoint timeframes' set. Then, create gap datapoint
   * objects for each of the remaining timeframes.
   */
  const timeFrameSet = new Set(timeFrameArray);
  const filteredDatapointTimeFrameSet = new Set(
    filteredDatapoints.map((dp) => {
      const datapointStartDate = new Date(dp.start_date);
      return isAnnual
        ? datapointStartDate.getUTCMonth() !== 0
          ? datapointStartDate.getUTCFullYear() + 1
          : datapointStartDate.getUTCFullYear()
        : `${datapointStartDate.getUTCMonth()} ${datapointStartDate.getUTCFullYear()}`;
    })
  );

  const gapDatapointTimeFrames = Array.from(
    new Set(
      Array.from(timeFrameSet).filter(
        (timeFrame) =>
          !filteredDatapointTimeFrameSet.has(
            isAnnual
              ? isNonCalendarYearMetric
                ? timeFrame.getUTCFullYear() + 1
                : timeFrame.getUTCFullYear()
              : `${timeFrame.getUTCMonth()} ${timeFrame.getUTCFullYear()}`
          )
      )
    )
  );

  const gapDatapoints = gapDatapointTimeFrames.map((date) => {
    const endYearOrIncrementedEndYear =
      date.getUTCMonth() === 11
        ? date.getUTCFullYear() + 1 // Increment the year if the month is December
        : date.getUTCFullYear();
    return {
      start_date: new Date(
        createGMTDate(1, date.getUTCMonth(), date.getUTCFullYear())
      ).toUTCString(),
      end_date: new Date(
        createGMTDate(
          1,
          isAnnual ? date.getUTCMonth() : (date.getUTCMonth() + 1) % 12,
          isAnnual ? date.getUTCFullYear() + 1 : endYearOrIncrementedEndYear
        )
      ).toUTCString(),
      dataVizMissingData: defaultBarValue,
      frequency,
      ...dimensionsMap,
    };
  });

  // Merge `filteredDatapoints` and `gapDatapoints` and sort them in ascending order by start date
  const dataWithGapDatapoints = [...filteredDatapoints, ...gapDatapoints].sort(
    (a, b) => +new Date(a.start_date) - +new Date(b.start_date)
  );

  return dataWithGapDatapoints;
};

// transforms data into the right display format for the data viz chart
export const transformDataForBarChart = (
  datapoints: Datapoint[],
  monthsAgo: DataVizTimeRange,
  dataVizViewSetting: DataVizCountOrPercentageView,
  metricFrequency?: ReportFrequency,
  startingMonth?: number // For annual metrics, represents the starting month of the recording period
) => {
  if (datapoints.length === 0) {
    return datapoints;
  }

  // filter by time range
  let transformedData = transformDataForMetricInsights(datapoints, monthsAgo);

  // format data into percentages for percentage view
  if (dataVizViewSetting === "Percentage") {
    transformedData = transformToRelativePerchanges(transformedData);
  }

  return fillTimeGapsBetweenDatapoints(
    transformedData,
    monthsAgo,
    metricFrequency,
    startingMonth
  );
};

export const transformDataForMetricInsights = (
  datapoints: Datapoint[],
  monthsAgo: DataVizTimeRange
) => {
  if (datapoints.length === 0) {
    return datapoints;
  }
  return filterNullDatapoints(filterByTimeRange(datapoints, monthsAgo));
};

// get insights from transformed data

export const getPercentChangeOverTime = (data: Datapoint[]) => {
  if (data.length > 0) {
    const start = data[0][DataVizAggregateName] as number | undefined;
    const end = data[data.length - 1][DataVizAggregateName] as
      | number
      | undefined;
    if (start !== undefined && end !== undefined) {
      const formattedPercentChange = formatNumberInput(
        Math.round(((end - start) / start) * 100).toString()
      );
      if (formattedPercentChange) {
        return `${formattedPercentChange}%`;
      }
    }
  }
  return "N/A";
};

export const getAverageTotalValue = (data: Datapoint[], isAnnual: boolean) => {
  if (data.length > 0) {
    let totalValueFound = false;
    const avgTotalValue =
      data.reduce((res, dp) => {
        if (dp[DataVizAggregateName] !== undefined) {
          totalValueFound = true;
          return res + (dp[DataVizAggregateName] as number);
        }
        return res;
      }, 0) / data.length;
    if (totalValueFound && avgTotalValue !== undefined) {
      const formattedAvgTotalValue = formatNumberInput(
        Math.round(avgTotalValue).toString()
      );
      if (formattedAvgTotalValue !== undefined) {
        return `${formattedAvgTotalValue}/${isAnnual ? "yr" : "mo"}`;
      }
    }
  }
  return "N/A";
};

export const getLatestDateFormatted = (
  data: Datapoint[],
  isAnnual: boolean
) => {
  const mostRecentDate = data[data.length - 1]?.start_date;
  if (mostRecentDate) {
    const { month, year } = splitUtcString(mostRecentDate);
    return `${!isAnnual ? `${month} ` : ""}${year}`;
  }
  return "N/A";
};

export const formatDateShort = (dateStr: string) => {
  const { month, year } = splitUtcString(dateStr);
  return `${abbreviatedMonths.indexOf(month) + 1}/${year}`;
};

export const formatDateShortMonthYear = (dateStr: string) => {
  const { month, year } = splitUtcString(dateStr);
  return `${abbreviatedMonthsNumber[month]}/${year.slice(2)}`;
};

export const formatExternalLink = (url: string) => {
  return url.match(/^http[s]?:\/\//) ? url : `http://${url}`;
};

export const getDatapointBarLabel = (datapoint: Datapoint) => {
  const { month, year } = splitUtcString(datapoint.start_date);
  if (abbreviatedMonths.findIndex((m) => m === month) === -1) {
    // something went wrong with finding the previous month, return an error string
    return `invalid date for start date: ${datapoint.start_date}`;
  }
  if (datapoint.frequency === "ANNUAL") {
    const previousMonth =
      abbreviatedMonths[
        (abbreviatedMonths.findIndex((m) => m === month) + 11) % 12
      ];
    if (previousMonth === "Dec") {
      return `${month} ${year} - ${previousMonth} ${parseInt(year)}`;
    }
    return `${month} ${year} - ${previousMonth} ${parseInt(year) + 1}`;
  }
  return `${month} ${year}`;
};
export const getDatapointBarLabelMini = (datapoint: Datapoint) => {
  const { month, year } = splitUtcString(datapoint.start_date);
  if (datapoint.frequency === "ANNUAL") {
    const { year: adjustedYear } = getMonthYearBasedOnMonth({
      monthStr: month,
      yearStr: year,
    });

    return `${adjustedYear}`;
  }
  return `${month} ${year}`;
};

export function generateSavingFileName(
  systemParam?: string,
  metricParam?: string,
  disaggregation?: string
) {
  if (!systemParam) return "metric.png";
  if (!metricParam) return "metric.png";

  const metricName = metricParam
    .toLowerCase()
    .replace(`${systemParam.toLowerCase()}_`, "");

  const disaggregationName =
    !disaggregation || disaggregation.toLowerCase() === "none"
      ? ""
      : `_by_${disaggregation.toLowerCase().replaceAll(" ", "_")}`;

  return `${metricName}${disaggregationName}.png`;
}

export const abbreviateNumber = (num: number) => {
  // abbreviates numbers into 1k, 2.5m, 5.5t, etc
  const numLength = num.toString().length;
  if (numLength >= 13) {
    return `${parseFloat((num / 1000000000000).toFixed(1))}t`;
  }
  if (numLength >= 10) {
    return `${parseFloat((num / 1000000000).toFixed(1))}b`;
  }
  if (numLength >= 7) {
    return `${parseFloat((num / 1000000).toFixed(1))}m`;
  }
  if (numLength >= 4) {
    return `${parseFloat((num / 1000).toFixed(1))}k`;
  }
  return num.toString();
};

export const generateDummyDataForChart = () => {
  let dummyData: {
    date: string;
    value: number;
  }[] = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 12; i++) {
    const month = new Date().getMonth() - i;
    const year = new Date().getUTCFullYear();
    const dummyValue = {
      date: printDateAsShortMonthYear(month, year),
      value: 0,
    };
    dummyData = [dummyValue, ...dummyData];
  }
  return dummyData;
};

export const isAnnualMetric = (metric: Metric) => {
  return metric.custom_frequency
    ? metric.custom_frequency === "ANNUAL"
    : metric.frequency === "ANNUAL";
};

export const getAnnualOrMonthlyDataVizTimeRange = (metric: Metric) => {
  return isAnnualMetric(metric)
    ? DataVizTimeRangesMap["5 Years Ago"]
    : DataVizTimeRangesMap["1 Year Ago"];
};

export const getDataVizTimeRangeByFilterByMetricFrequency =
  (dataRangeFilter: string) => (metric: Metric) => {
    if (dataRangeFilter === "recent") {
      return getAnnualOrMonthlyDataVizTimeRange(metric);
    }
    return DataVizTimeRangesMap.All;
  };
