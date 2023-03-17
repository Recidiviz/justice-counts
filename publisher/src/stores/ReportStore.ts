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
import {
  REPORT_LOWERCASE,
  REPORTS_LOWERCASE,
} from "../components/Global/constants";
import { MetricSettings } from "../components/MetricConfiguration";
import { groupBy } from "../utils";
import API from "./API";
import UserStore from "./UserStore";

class ReportStore {
  userStore: UserStore;

  api: API;

  reportOverviews: { [reportID: string]: ReportOverview }; // key by report ID

  reportMetrics: { [reportID: string]: Metric[] }; // key by report ID

  reportMetricsBySystem: { [reportID: string]: { [system: string]: Metric[] } }; // key by report ID, then by system

  metricsBySystem: { [system: string]: Metric[] }; // key by system

  loadingOverview: boolean;

  loadingReportData: boolean;

  disposers: IReactionDisposer[] = [];

  constructor(userStore: UserStore, api: API) {
    makeAutoObservable(this);

    this.api = api;
    this.userStore = userStore;
    this.reportOverviews = {};
    this.reportMetrics = {};
    this.reportMetricsBySystem = {};
    this.metricsBySystem = {};
    this.loadingOverview = true;
    this.loadingReportData = true;
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

      runInAction(() => {
        this.reportOverviews[reportID] = overview;
        const metricsBySystem = groupBy(metrics, (metric) => metric.system.key);
        this.reportMetricsBySystem[reportID] = metricsBySystem;
        // ensure that the order of the metrics in reportMetricsBySystem
        // matches the order of the metrics in reportMetrics
        this.reportMetrics[reportID] = Object.values(metricsBySystem).flat();
      });
    } catch (error) {
      if (error instanceof Error) return new Error(error.message);
    } finally {
      runInAction(() => {
        this.loadingReportData = false;
      });
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
          time_loaded:
            this.reportOverviews[reportID].last_modified_at_timestamp,
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

      if (response.status === 200) {
        /** Update the editor details (editors & last modified details) in real time within the report after autosave. */
        const reportsList = (await response.json()) as Report[];

        runInAction(() => {
          reportsList.forEach((report) => {
            this.reportOverviews[report.id] = report;
          });
        });
      }

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
