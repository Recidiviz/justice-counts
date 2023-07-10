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

import {
  AgencySystems,
  Metric,
  Report,
  ReportOverview,
  ReportStatus,
  UpdatedMetricsValues,
} from "@justice-counts/common/types";
import { IReactionDisposer, makeAutoObservable, runInAction } from "mobx";

import { UploadedFileStatus } from "../components/DataUpload";
import { DataUploadResponseBody } from "../components/DataUpload/types";
import {
  REPORT_LOWERCASE,
  REPORTS_LOWERCASE,
} from "../components/Global/constants";
import { MetricSettings } from "../components/MetricsConfiguration";
import {
  PublishReviewMetricErrors,
  PublishReviewPropsFromDatapoints,
} from "../components/ReviewMetrics";
import { groupBy } from "../utils";
import API from "./API";
import DatapointsStore from "./DatapointsStore";
import UserStore from "./UserStore";
import { DataUploadResponseBody } from "../components/DataUpload/types";

class ReportStore {
  userStore: UserStore;

  api: API;

  reportOverviews: { [reportID: string]: ReportOverview }; // key by report ID

  reportMetrics: { [reportID: string]: Metric[] }; // key by report ID

  reportMetricsBySystem: { [reportID: string]: { [system: string]: Metric[] } }; // key by report ID, then by system

  metricsBySystem: { [system: string]: Metric[] }; // key by system

  spreadsheetReviewData: { [spreadsheetId: string]: DataUploadResponseBody };

  loadingOverview: boolean;

  loadingReportData: boolean;

  loadingSpreadsheetReviewData: boolean;

  disposers: IReactionDisposer[] = [];

  constructor(userStore: UserStore, api: API) {
    makeAutoObservable(this);

    this.api = api;
    this.userStore = userStore;
    this.reportOverviews = {};
    this.reportMetrics = {};
    this.reportMetricsBySystem = {};
    this.metricsBySystem = {};
    this.spreadsheetReviewData = {};
    this.loadingOverview = true;
    this.loadingReportData = true;
    this.loadingSpreadsheetReviewData = true;
  }

  deconstructor = () => {
    this.disposers.forEach((disposer) => disposer());
  };

  get reportOverviewList(): ReportOverview[] {
    return Object.values(this.reportOverviews).sort((a, b) => {
      const dateA = new Date(a.year, a.month - 1).getTime();
      const dateB = new Date(b.year, b.month - 1).getTime();
      if (a.year === b.year) {
        // Annual reports should always be sorted before Monthly reports,
        // regardless of their month
        if (a.frequency === "ANNUAL") {
          return -1;
        }
        if (b.frequency === "ANNUAL") {
          return 1;
        }
      }
      return dateB - dateA;
    });
  }

  get agencyMetrics(): Metric[] {
    return Object.values(this.metricsBySystem).flatMap((metric) => metric);
  }

  storeMetricDetails(
    reportID: number,
    metrics: Metric[],
    overview?: ReportOverview
  ): void {
    runInAction(() => {
      if (overview) this.reportOverviews[reportID] = overview;
      const metricsBySystem = groupBy(metrics, (metric) => metric.system.key);
      this.reportMetricsBySystem[reportID] = metricsBySystem;
      // ensure that the order of the metrics in reportMetricsBySystem
      // matches the order of the metrics in reportMetrics
      this.reportMetrics[reportID] = Object.values(metricsBySystem).flat();
    });
  }

  async getReportOverviews(agencyId: string): Promise<void | Error> {
    try {
      const response = (await this.api.request({
        path: `/api/agencies/${agencyId}/reports`,
        method: "GET",
      })) as Response;
      if (response.status === 200) {
        const allReports = await response.json();

        runInAction(() => {
          allReports.forEach((report: ReportOverview) => {
            this.reportOverviews[report.id] = report;
          });
        });
      } else {
        const error = await response.json();
        throw new Error(error.description);
      }
    } catch (error) {
      if (error instanceof Error) return new Error(error.message);
    } finally {
      runInAction(() => {
        this.loadingOverview = false;
      });
    }
  }

  async getReport(reportID: number): Promise<void | Error> {
    try {
      const response = (await this.api.request({
        path: `/api/reports/${reportID}`,
        method: "GET",
      })) as Response;

      if (response.status !== 200) {
        throw new Error(
          `There was an issue getting this ${REPORT_LOWERCASE} .`
        );
      }

      const report = (await response.json()) as Report;
      const { metrics, ...overview } = report;
      this.storeMetricDetails(reportID, metrics, overview);
    } catch (error) {
      if (error instanceof Error) return new Error(error.message);
    } finally {
      runInAction(() => {
        this.loadingReportData = false;
      });
    }
  }

  async getMultipleReportsWithDatapoints(
    reportIDs: number[],
    currentAgencyId: string
  ): Promise<Report[] | Error | void> {
    try {
      const response = (await this.api.request({
        path: `/api/reports?agency_id=${parseInt(
          currentAgencyId
        )}&report_ids=${reportIDs.join(",")}`,
        method: "GET",
      })) as Response;

      if (response.status !== 200) {
        throw new Error(
          `There was an issue retrieving these ${REPORTS_LOWERCASE}.`
        );
      }

      const reports = (await response.json()) as Report[];

      return reports;
    } catch (error) {
      if (error instanceof Error) return new Error(error.message);
    } finally {
      runInAction(() => {
        this.loadingReportData = false;
      });
    }
  }

  // api call for spreadsheet data
  async getSpreadsheetReviewData(
    spreadsheetId: string
  ): Promise<DataUploadResponseBody | Error | void> {
    this.loadingSpreadsheetReviewData = true;

    try {
      const response = (await this.api.request({
        path: `/api/${spreadsheetId}/bulk-upload-json`,
        method: "GET",
      })) as Response;

      if (response.status !== 200) {
        throw new Error(
          `There was an issue retrieving these spreadsheet with id ${spreadsheetId}.`
        );
      }

      const data = (await response.json()) as DataUploadResponseBody;
      runInAction(() => {
        this.spreadsheetReviewData[spreadsheetId] = data;
      });
    } catch (error) {
      if (error instanceof Error) return new Error(error.message);
    } finally {
      runInAction(() => {
        this.loadingSpreadsheetReviewData = false;
      });
    }
  }

  /** Fetches Reports w/ datapoints and returns necessary props to render the Publish Review pages */
  async getPublishReviewPropsFromDatapoints(
    reportIDs: number[],
    currentAgencyId: string
  ): Promise<PublishReviewPropsFromDatapoints | Error | undefined> {
    try {
      const reportsWithDatapoints =
        (await this.getMultipleReportsWithDatapoints(
          reportIDs,
          currentAgencyId
        )) as Report[] | Error;

      if (reportsWithDatapoints instanceof Error) {
        throw new Error(
          `There was an issue retrieving these ${REPORTS_LOWERCASE}.`
        );
      }

      const combinedFilteredDatapointsFromAllReports = reportsWithDatapoints
        ?.map((report) => report.datapoints)
        .flat();

      /**
       * Find metric errors from datapoints (non-numeric characters and breakdowns with values but no value for the top-level metric)
       *
       * IMPORTANT: this validation logic is similar to the validation run on an individual report (the main difference is that this
       * is validating errors on datapoint objects vs. report objects). If you plan to adjust the logic here, please update the `validate`
       * function's logic as well in `FormStore.ts`
       */

      const metricErrors = combinedFilteredDatapointsFromAllReports
        /**  First, sort the datapoints so breakdowns come before top level metrics */
        .sort((a, _) => (a.dimension_display_name ? -1 : 1))
        .reduce((acc, val) => {
          const metricDefinitionReportIDKey =
            val.metric_definition_key + val.report_id;
          /** Add non-numeric characters */
          if (Number.isNaN(Number(val.value))) {
            acc[metricDefinitionReportIDKey] = true;
            return acc;
          }
          /**
           * If there is a value in the breakdowns and it's the first time we've come across this breakdown,
           * add it to our map and mark it as false until we come across the top level metric
           */
          if (
            val.dimension_display_name &&
            acc[metricDefinitionReportIDKey] === undefined &&
            val.value !== null
          ) {
            acc[metricDefinitionReportIDKey] = false;
          }
          /**
           * After going through all of the breakdowns values, check to see if the top level metric has a null value.
           * If so, we've encountered an error with breakdowns having a value and the top level metric having no value.
           */
          if (
            !val.dimension_display_name &&
            acc[metricDefinitionReportIDKey] === false &&
            val.value === null
          ) {
            acc[metricDefinitionReportIDKey] = true;
          }
          return acc;
        }, {} as PublishReviewMetricErrors);

      const filteredDatapoints =
        combinedFilteredDatapointsFromAllReports.filter(
          (dp) => dp.value !== null
        );

      const datapointsByMetric =
        DatapointsStore.keyRawDatapointsByMetric(filteredDatapoints);
      const datapointsEntries = Object.entries(datapointsByMetric);

      const metricsToDisplay = datapointsEntries.map(
        ([metricKey, metricDatapoints]) => {
          return {
            key: metricKey,
            displayName: metricDatapoints[0].metric_display_name as string,
          };
        }
      );

      return {
        records: reportsWithDatapoints,
        datapointsByMetric,
        metricsToDisplay,
        metricErrors,
      };
    } catch (error) {
      if (error instanceof Error) return new Error(error.message);
    }
  }

  async createReport(
    body: Record<string, unknown>,
    agencyId: number
  ): Promise<Response | Error | undefined> {
    try {
      const response = (await this.api.request({
        path: "/api/reports",
        method: "POST",
        body: { agency_id: agencyId, ...body },
      })) as Response;

      return response;
    } catch (error) {
      if (error instanceof Error) return new Error(error.message);
    }
  }

  async updateReport(
    reportID: number,
    updatedMetrics: UpdatedMetricsValues[],
    status: ReportStatus
  ): Promise<Response | Error | undefined> {
    try {
      const response = (await this.api.request({
        path: `/api/reports/${reportID}`,
        body: {
          status,
          metrics: updatedMetrics,
        },
        method: "PATCH",
      })) as Response;

      if (response.status === 200) {
        /** Update the editor details (editors & last modified details) in real time within the report after autosave. */
        const report = (await response.json()) as Report;
        this.reportOverviews[report.id] = report;
      }

      return response;
    } catch (error) {
      if (error instanceof Error) return new Error(error.message);
    }
  }

  async updateMultipleReportStatuses(
    reportIDs: number[],
    currentAgencyId: string,
    status: ReportStatus
  ): Promise<Response | Error | undefined> {
    try {
      const response = (await this.api.request({
        path: `/api/reports`,
        body: {
          report_ids: reportIDs,
          status,
          agency_id: parseInt(currentAgencyId),
        },
        method: "PATCH",
      })) as Response;

      return response;
    } catch (error) {
      if (error instanceof Error) return new Error(error.message);
    }
  }

  async deleteReports(
    reportIDs: number[],
    currentAgencyId: string
  ): Promise<Response | Error | undefined> {
    try {
      const response = (await this.api.request({
        path: `/api/reports`,
        body: { report_ids: reportIDs, agency_id: parseInt(currentAgencyId) },
        method: "DELETE",
      })) as Response;

      if (response.status !== 200) {
        throw new Error(
          `There was an issue deleting these ${REPORTS_LOWERCASE}.`
        );
      }

      runInAction(() => {
        this.resetState();
        this.getReportOverviews(currentAgencyId);
      });

      return response;
    } catch (error) {
      if (error instanceof Error) return new Error(error.message);
    }
  }

  initializeReportSettings = async (
    agencyId: string
  ): Promise<{ [system: string]: Metric[] } | Error> => {
    const response = (await this.api.request({
      path: `/api/agencies/${agencyId}/metrics`,
      method: "GET",
    })) as Response;

    if (response.status !== 200) {
      throw new Error(
        `There was an issue retrieving the ${REPORT_LOWERCASE} settings.`
      );
    }

    const metrics = (await response.json()) as Metric[];
    const metricsBySystem = metrics.reduce((acc, metric) => {
      const systemKey = metric.system.key;
      if (!acc[systemKey]) {
        acc[systemKey] = [];
        acc[systemKey].push(metric);
      } else {
        acc[systemKey].push(metric);
      }
      return acc;
    }, {} as { [system: string]: Metric[] });

    runInAction(() => {
      this.metricsBySystem = metricsBySystem;
    });

    return metricsBySystem;
  };

  getMetricsBySystem = (system: AgencySystems | undefined) => {
    if (system) {
      return this.metricsBySystem[system];
    }
  };

  async updateReportSettings(
    updatedMetricSettings: MetricSettings[],
    agencyId: string
  ): Promise<Response | Error | undefined> {
    try {
      const response = (await this.api.request({
        path: `/api/agencies/${agencyId}/metrics`,
        body: { metrics: updatedMetricSettings },
        method: "PUT",
      })) as Response;

      if (response.status !== 200) {
        throw new Error(
          `There was an issue updating the ${REPORT_LOWERCASE} settings.`
        );
      }

      return response;
    } catch (error) {
      if (error instanceof Error) return new Error(error.message);
    }
  }

  async getUploadedFilesList(
    agencyId: string
  ): Promise<Response | Error | undefined> {
    const response = (await this.api.request({
      path: `/api/agencies/${agencyId}/spreadsheets`,
      method: "GET",
    })) as Response;

    if (response.status !== 200) {
      return new Error("There was an issue retrieving the list of files.");
    }

    return response;
  }

  async fetchSpreadsheetBlob(
    spreadsheetID: number
  ): Promise<Response | Error | undefined> {
    try {
      const response = (await this.api.request({
        path: `/api/spreadsheets/${spreadsheetID}`,
        method: "GET",
      })) as Response;

      if (response.status !== 200) {
        throw new Error("There was an issue downloading the spreadsheet.");
      }

      return response;
    } catch (error) {
      if (error instanceof Error) return new Error(error.message);
    }
  }

  async uploadExcelSpreadsheet(
    formData: FormData
  ): Promise<Response | Error | undefined> {
    try {
      const response = (await this.api.request({
        path: `/api/spreadsheets`,
        body: formData,
        method: "POST",
      })) as Response;

      if (response.status !== 200) {
        throw new Error("There was an issue uploading the file.");
      }

      return response;
    } catch (error) {
      if (error instanceof Error) return new Error(error.message);
    }
  }

  async deleteUploadedSpreadsheet(
    spreadsheetID: number
  ): Promise<Response | Error | undefined> {
    const response = (await this.api.request({
      path: `/api/spreadsheets/${spreadsheetID}`,
      method: "DELETE",
    })) as Response;

    if (response.status !== 200) {
      return new Error("There was an issue deleting the file.");
    }

    return response;
  }

  async updateFileStatus(
    spreadsheetID: number,
    status: UploadedFileStatus
  ): Promise<Response | Error | undefined> {
    try {
      const response = (await this.api.request({
        path: `/api/spreadsheets/${spreadsheetID}`,
        body: { status },
        method: "PATCH",
      })) as Response;

      if (response.status !== 200) {
        throw new Error("There was an issue updating the file status.");
      }

      return response;
    } catch (error) {
      if (error instanceof Error) return new Error(error.message);
    }
  }

  resetState() {
    // reset the state when switching agencies
    runInAction(() => {
      this.reportOverviews = {};
      this.reportMetrics = {};
      this.reportMetricsBySystem = {};
      this.metricsBySystem = {};
      this.loadingOverview = true;
      this.loadingReportData = true;
    });
  }
}

export default ReportStore;
