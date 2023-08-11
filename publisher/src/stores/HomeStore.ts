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

import { Metric } from "@justice-counts/common/types";
import { groupBy } from "@justice-counts/common/utils";
import { makeAutoObservable, runInAction } from "mobx";

import { REPORT_LOWERCASE } from "../components/Global/constants";
import {
  AnnualRecordMetadata,
  createAnnualRecordsMetadata,
  createMonthlyRecordMetadata,
  LatestRecordMetadata,
  LatestRecordsAgencyMetrics,
  SystemSelectionOptions,
} from "../components/Home";
import API from "./API";
import ReportStore from "./ReportStore";
import UserStore from "./UserStore";

class HomeStore {
  userStore: UserStore;

  reportStore: ReportStore;

  api: API;

  loading: boolean;

  systemSelectionOptions: SystemSelectionOptions[];

  currentSystemSelection: SystemSelectionOptions | undefined;

  latestMonthlyRecordMetadata: LatestRecordMetadata | undefined;

  latestAnnualRecordsMetadata: AnnualRecordMetadata | undefined;

  agencyMetrics: Metric[];

  constructor(userStore: UserStore, api: API, reportStore: ReportStore) {
    makeAutoObservable(this, {}, { autoBind: true });

    this.userStore = userStore;
    this.reportStore = reportStore;
    this.api = api;
    this.loading = true;
    this.systemSelectionOptions = [];
    this.currentSystemSelection = undefined;
    this.latestMonthlyRecordMetadata = undefined;
    this.latestAnnualRecordsMetadata = undefined;
    this.agencyMetrics = [];
  }

  get agencyMetricsByMetricKey(): Record<string, Metric[]> | undefined {
    if (this.agencyMetrics.length === 0) return undefined;
    return groupBy(this.agencyMetrics, (metric) => metric.key);
  }

  get filteredCurrentSystemMetrics(): Metric[] {
    return this.agencyMetrics.filter(this.currentSystemMetrics);
  }

  get enabledCurrentSystemMetrics(): Metric[] {
    return this.filteredCurrentSystemMetrics.filter(HomeStore.enabledMetrics);
  }

  get unconfiguredCurrentSystemMetrics(): Metric[] {
    return this.filteredCurrentSystemMetrics.filter(
      HomeStore.unconfiguredMetrics
    );
  }

  getLatestAnnualRecord(
    startingMonth: number | string
  ): LatestRecordMetadata | undefined {
    return this.latestAnnualRecordsMetadata?.[startingMonth];
  }

  initAgencySystemSelectionOptions(agencyId: string): void {
    const currentAgency = this.userStore.getAgency(agencyId);
    const currentAgencySystems = currentAgency?.systems || [];
    const hasMultipleSystems = currentAgencySystems.length > 1;
    const isSuperagency = currentAgencySystems.includes("SUPERAGENCY");

    runInAction(() => {
      if (isSuperagency) {
        this.systemSelectionOptions = ["SUPERAGENCY"];
      } else {
        this.systemSelectionOptions = hasMultipleSystems
          ? ["ALL", ...currentAgencySystems]
          : currentAgencySystems;
      }
      this.updateCurrentSystemSelection(this.systemSelectionOptions[0]);
    });
  }

  async getLatestReportsAndMetrics(
    currentAgencyId: string
  ): Promise<void | Error | LatestRecordsAgencyMetrics> {
    try {
      runInAction(() => {
        this.loading = true;
      });

      const response = (await this.api.request({
        path: `/api/home/${currentAgencyId}`,
        method: "GET",
      })) as Response;

      if (response.status !== 200) {
        throw new Error(
          `There was an issue getting this ${REPORT_LOWERCASE} .`
        );
      }

      const latestRecordsAndMetrics =
        (await response.json()) as LatestRecordsAgencyMetrics;

      const annualRecords = Object.values(
        latestRecordsAndMetrics.annual_reports
      );
      const hasAnnualRecords = annualRecords.length > 0;
      const hasMonthlyRecord = Boolean(
        latestRecordsAndMetrics.monthly_report.id
      );
      const allRecords = [];

      if (hasMonthlyRecord)
        allRecords.push(latestRecordsAndMetrics.monthly_report);
      if (hasAnnualRecords) allRecords.push(...annualRecords);
      if (allRecords.length > 0) {
        allRecords.forEach((record) =>
          this.reportStore.storeMetricDetails(record.id, record.metrics, record)
        );
      }

      runInAction(() => {
        this.loading = false;
        this.initLatestRecordsMetadatas(latestRecordsAndMetrics);
      });
    } catch (error) {
      if (error instanceof Error) return new Error(error.message);
    }
  }

  initLatestRecordsMetadatas(
    latestRecordsAndMetrics: LatestRecordsAgencyMetrics
  ): void {
    runInAction(() => {
      const {
        agency_metrics: agencyMetrics,
        annual_reports: annualRecords,
        monthly_report: monthlyRecord,
      } = latestRecordsAndMetrics;
      const hasMonthlyRecord = Object.values(monthlyRecord).length > 0;
      const hasAnnualRecords = Object.values(annualRecords).length > 0;
      const annualRecordsMetadata = hasAnnualRecords
        ? createAnnualRecordsMetadata(annualRecords)
        : undefined;
      const monthlyRecordMetadata = hasMonthlyRecord
        ? createMonthlyRecordMetadata(monthlyRecord)
        : undefined;

      runInAction(() => {
        this.latestMonthlyRecordMetadata = monthlyRecordMetadata;
        this.latestAnnualRecordsMetadata = annualRecordsMetadata;
        this.agencyMetrics = agencyMetrics;
      });
    });
  }

  updateCurrentSystemSelection(system: SystemSelectionOptions): void {
    runInAction(() => {
      this.currentSystemSelection = system;
    });
  }

  /** Filters */
  static enabledMetrics({ enabled }: Metric) {
    return enabled;
  }

  static unconfiguredMetrics({ enabled }: Metric) {
    return enabled === null;
  }

  currentSystemMetrics(metric: Metric) {
    return (
      this.currentSystemSelection === "ALL" ||
      metric.system.key === this.currentSystemSelection
    );
  }
}

export default HomeStore;
