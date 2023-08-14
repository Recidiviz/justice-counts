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
  ReportFrequency,
  SupervisionSubsystems,
} from "@justice-counts/common/types";
import {
  groupBy,
  monthsByName,
  printReportTitle,
} from "@justice-counts/common/utils";
import { makeAutoObservable, runInAction } from "mobx";

import { REPORT_LOWERCASE } from "../components/Global/constants";
import {
  AnnualRecordMetadata,
  LatestRecordMetadata,
  LatestRecordsAgencyMetrics,
  PublishMetricsTaskCardMetadatas,
  SystemSelectionOptions,
  taskCardLabelsActionLinks,
  TaskCardMetadata,
  TaskCardMetadataValueConfigurationGroup,
} from "../components/Home";
import API from "./API";
import ReportStore from "./ReportStore";
import UserStore from "./UserStore";

class HomeStore {
  userStore: UserStore;

  reportStore: ReportStore;

  api: API;

  agencyMetrics: Metric[];

  latestMonthlyRecordMetadata: LatestRecordMetadata | undefined;

  latestAnnualRecordsMetadata: AnnualRecordMetadata | undefined;

  addDataConfigureMetricsTaskCardMetadatas: TaskCardMetadata[] | undefined;

  publishMetricsTaskCardMetadatas: PublishMetricsTaskCardMetadatas | undefined;

  systemSelectionOptions: SystemSelectionOptions[];

  currentSystemSelection: SystemSelectionOptions | undefined;

  loading: boolean;

  constructor(userStore: UserStore, api: API, reportStore: ReportStore) {
    makeAutoObservable(this, {}, { autoBind: true });

    this.userStore = userStore;
    this.reportStore = reportStore;
    this.api = api;
    this.agencyMetrics = [];
    this.latestMonthlyRecordMetadata = undefined;
    this.latestAnnualRecordsMetadata = undefined;
    this.addDataConfigureMetricsTaskCardMetadatas = undefined;
    this.publishMetricsTaskCardMetadatas = undefined;
    this.systemSelectionOptions = [];
    this.currentSystemSelection = undefined;
    this.loading = true;
  }

  get agencyMetricsByMetricKey(): Record<string, Metric[]> | undefined {
    if (this.agencyMetrics.length === 0) return undefined;
    return groupBy(this.agencyMetrics, (metric) => metric.key);
  }

  get currentSystemMetrics(): Metric[] {
    return this.agencyMetrics.filter(this.metricsBelongToCurrentSystem);
  }

  get enabledCurrentSystemMetrics(): Metric[] {
    return this.currentSystemMetrics.filter(HomeStore.enabledMetrics);
  }

  get unconfiguredCurrentSystemMetrics(): Metric[] {
    return this.currentSystemMetrics.filter(HomeStore.unconfiguredMetrics);
  }

  get enabledMetricsTaskCardMetadata(): TaskCardMetadata[] {
    return this.enabledCurrentSystemMetrics.map((metric) =>
      this.createTaskCardMetadata(metric, "enabled")
    );
  }

  get unconfiguredMetricsTaskCardMetadata(): TaskCardMetadata[] {
    return this.unconfiguredCurrentSystemMetrics.map((metric) =>
      this.createTaskCardMetadata(metric, "unconfigured")
    );
  }

  get hasMultipleSystemsAndAllSystemsFilter(): boolean {
    return (
      this.systemSelectionOptions.length > 1 &&
      this.currentSystemSelection === "ALL"
    );
  }

  get hasCompletedAllTasks(): boolean {
    /**
     * User has completed all tasks if:
     *  1. User has configured all metrics and set them all to "Not Available"
     *  2. User has entered values for all metrics in the latest annual and/or monthly
     *     records and those records are published
     */
    return (
      this.addDataConfigureMetricsTaskCardMetadatas?.length === 0 &&
      this.publishMetricsTaskCardMetadatas?.ANNUAL.length === 0 &&
      this.publishMetricsTaskCardMetadatas?.MONTHLY.length === 0
    );
  }

  getLatestAnnualRecord(
    startingMonth: number | string | undefined
  ): LatestRecordMetadata | undefined {
    if (startingMonth === undefined) return undefined;
    return this.latestAnnualRecordsMetadata?.[startingMonth];
  }

  initAgencySystemSelectionOptions(agencyId: string): void {
    const currentAgency = this.userStore.getAgency(agencyId);
    const currentAgencySystems = currentAgency?.systems || [];
    const filteredAgencySystems = currentAgencySystems.filter((system) =>
      this.supervisionSubsystemsWithEnabledMetrics(system)
    );
    const hasMultipleSystems = currentAgencySystems.length > 1;
    const isSuperagency = currentAgencySystems.includes("SUPERAGENCY");

    runInAction(() => {
      if (isSuperagency) {
        this.systemSelectionOptions = ["SUPERAGENCY"];
      } else {
        this.systemSelectionOptions = hasMultipleSystems
          ? ["ALL", ...filteredAgencySystems]
          : filteredAgencySystems;
      }
      this.updateCurrentSystemSelection(this.systemSelectionOptions[0]);
    });
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
        ? HomeStore.createAnnualRecordsMetadata(annualRecords)
        : undefined;
      const monthlyRecordMetadata = hasMonthlyRecord
        ? HomeStore.createMonthlyRecordMetadata(monthlyRecord)
        : undefined;

      runInAction(() => {
        this.latestMonthlyRecordMetadata = monthlyRecordMetadata;
        this.latestAnnualRecordsMetadata = annualRecordsMetadata;
        this.agencyMetrics = agencyMetrics;
      });
    });
  }

  async fetchLatestReportsAndMetricsAndInitStore(
    currentAgencyId: string
  ): Promise<void | Error | LatestRecordsAgencyMetrics> {
    runInAction(() => {
      this.loading = true;
    });

    try {
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

      /** Load ReportStore with latest records */
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
        /** Hydrate Store */
        this.initLatestRecordsMetadatas(latestRecordsAndMetrics);
        this.initAgencySystemSelectionOptions(currentAgencyId);
        this.hydrateTaskCardMetadatasToRender();
      });
    } catch (error) {
      if (error instanceof Error) return new Error(error.message);
    }
  }

  hydrateTaskCardMetadatasToRender(): void {
    /**
     * For Annual Record Publish Task Cards: keeps track of reportIDs we've already created a publish
     * task card for to avoid creating duplicates.
     */
    const annualRecordIDsProcessed = new Map();
    /**
     * Metrics without values or not yet configured (`addDataConfigureMetricsTaskCardMetadatas`) are
     * straightforwardly rendered - each metric will have its own individual task card.
     *
     * Metrics with values and unpublished (`publishMetricsTaskCardMetadatas`) collapse into one
     * Publish task card for the report the metric belongs to. (e.g. adding data to metrics will remove
     * those metric's individual task cards, and the user will see one task card with the latest report
     * that matches that metric's frequency with a Publish action link.)
     *
     * This reducer consumes the `unconfiguredMetricsTaskCardMetadata` and `enabledMetricsTaskCardMetadata`
     * and organizes them into two buckets:
     *    1. `addDataConfigureMetricsTaskCardMetadatas` for individual metric add data / configure task cards
     *    2. `publishMetricsTaskCardMetadatas` for publish record task cards
     */
    const {
      publishMetricsTaskCardMetadatas,
      addDataConfigureMetricsTaskCardMetadatas,
    } = [
      ...this.unconfiguredMetricsTaskCardMetadata,
      ...this.enabledMetricsTaskCardMetadata,
    ].reduce(
      (acc, taskCardMetadata) => {
        const { metricFrequency } = taskCardMetadata;

        if (!taskCardMetadata.hasMetricValue) {
          acc.addDataConfigureMetricsTaskCardMetadatas.push(taskCardMetadata);
        } else if (metricFrequency && taskCardMetadata.status !== "PUBLISHED") {
          const publishTaskCardMetadata: TaskCardMetadata[] = [];
          if (
            metricFrequency === "MONTHLY" &&
            this.latestMonthlyRecordMetadata
          ) {
            publishTaskCardMetadata.push(
              HomeStore.createPublishTaskCardMetadata(
                this.latestMonthlyRecordMetadata,
                "MONTHLY"
              )
            );
          } else if (
            metricFrequency === "ANNUAL" &&
            this.latestAnnualRecordsMetadata
          ) {
            Object.values(this.latestAnnualRecordsMetadata).forEach(
              (recordMetadata) => {
                if (
                  recordMetadata.id === taskCardMetadata.recordID &&
                  !annualRecordIDsProcessed.get(recordMetadata.id)
                ) {
                  annualRecordIDsProcessed.set(recordMetadata.id, true);
                  publishTaskCardMetadata.push(
                    HomeStore.createPublishTaskCardMetadata(
                      recordMetadata,
                      "ANNUAL"
                    )
                  );
                }
              }
            );
          }
          acc.publishMetricsTaskCardMetadatas[metricFrequency].push(
            ...publishTaskCardMetadata
          );
        }

        return acc;
      },
      {
        publishMetricsTaskCardMetadatas: { MONTHLY: [], ANNUAL: [] },
        addDataConfigureMetricsTaskCardMetadatas: [],
      } as TaskCardMetadataValueConfigurationGroup
    );

    annualRecordIDsProcessed.clear(); // Clean up Map

    runInAction(() => {
      this.publishMetricsTaskCardMetadatas = publishMetricsTaskCardMetadatas;
      this.addDataConfigureMetricsTaskCardMetadatas =
        addDataConfigureMetricsTaskCardMetadatas;
    });
  }

  updateCurrentSystemSelection(system: SystemSelectionOptions): void {
    runInAction(() => {
      this.currentSystemSelection = system;
      this.hydrateTaskCardMetadatasToRender();
    });
  }

  /** Task Card Helpers */

  createTaskCardMetadata(
    metric: Metric,
    type: "enabled" | "unconfigured"
  ): TaskCardMetadata {
    const metricFrequency = metric.custom_frequency || metric.frequency;
    /**
     * If this is a supervision subsystem (with an annual frequency) that does not have a
     * starting month set, use the parent supervision metric's starting month, otherwise
     * use the current metric's starting month.
     */
    const supervisionSubsystemParentMetricStartingMonth =
      metric.disaggregated_by_supervision_subsystems && !metric.starting_month
        ? this.agencyMetricsByMetricKey?.[
            `SUPERVISION_${HomeStore.stripSystemKeyFromMetricKey(
              metric.key,
              metric.system.key
            )}`
          ]?.[0]?.starting_month
        : undefined;
    const startingMonth =
      supervisionSubsystemParentMetricStartingMonth || metric.starting_month;
    const { latestMonthlyRecordMetadata } = this;
    const latestAnnualRecordsMetadata =
      this.getLatestAnnualRecord(startingMonth);
    const createTaskCard =
      type === "enabled"
        ? HomeStore.createDataEntryTaskCardMetadata
        : HomeStore.createConfigurationTaskCardMetadata;

    /** Create Task Card linked to the latest Monthly Record */
    if (metricFrequency === "MONTHLY") {
      return createTaskCard(
        metric,
        latestMonthlyRecordMetadata,
        this.hasMultipleSystemsAndAllSystemsFilter
      );
    }
    /** Create Task Card linked to the latest Annual Record */
    return createTaskCard(
      metric,
      latestAnnualRecordsMetadata,
      this.hasMultipleSystemsAndAllSystemsFilter
    );
  }

  /**
   * Creates latest monthly record metadata object to store information needed
   * from the latest monthly record.
   */
  static createMonthlyRecordMetadata = (
    monthlyRecord: Report
  ): LatestRecordMetadata => {
    return {
      id: monthlyRecord.id,
      recordTitle: HomeStore.createReportTitle(monthlyRecord),
      metrics: groupBy(monthlyRecord.metrics, (metric: Metric) => metric.key),
      status: monthlyRecord.status,
    };
  };

  /**
   * Creates latest annual record(s) metadata object(s) keyed by starting month
   * to store information needed from the latest annual record(s).
   */
  static createAnnualRecordsMetadata = (annualRecords: {
    [key: string]: Report;
  }): AnnualRecordMetadata => {
    const annualRecordsEntries = Object.entries(annualRecords);
    return annualRecordsEntries.reduce((acc, [startingMonth, record]) => {
      // Exclude annual records with no metrics assigned to them
      if (record.metrics.length === 0) return acc;
      const monthName = monthsByName[Number(startingMonth) - 1];

      acc[startingMonth] = {
        id: record.id,
        recordTitle: HomeStore.createReportTitle(record, monthName),
        metrics: groupBy(record.metrics, (metric: Metric) => metric.key),
        status: record.status,
      };

      return acc;
    }, {} as AnnualRecordMetadata);
  };

  /**
   * Creates task card metadata object used to render task cards with metric config action link.
   */
  static createConfigurationTaskCardMetadata(
    currentMetric: Metric,
    recordMetadata?: LatestRecordMetadata,
    hasMultipleSystemsAndAllSystemsFilter?: boolean
  ): TaskCardMetadata {
    return {
      key: currentMetric.key,
      recordID: recordMetadata?.id,
      title: HomeStore.formatTaskCardTitle(
        currentMetric.display_name,
        currentMetric.system.display_name,
        hasMultipleSystemsAndAllSystemsFilter
      ),
      description: currentMetric.description,
      actionLinks: [taskCardLabelsActionLinks.metricAvailability],
      metricSettingsParams: `?system=${currentMetric.system.key.toLowerCase()}&metric=${currentMetric.key.toLowerCase()}`,
      status: recordMetadata?.status,
    };
  }

  /**
   * Creates task card metadata object used to render metric task cards with data entry action links.
   */
  static createDataEntryTaskCardMetadata = (
    currentMetric: Metric,
    recordMetadata?: LatestRecordMetadata,
    hasMultipleSystemsAndAllSystemsFilter?: boolean
  ): TaskCardMetadata => {
    const metricFrequency =
      currentMetric.custom_frequency || currentMetric.frequency;
    const hasMetricValue = Boolean(
      recordMetadata?.metrics?.[currentMetric.key]?.[0]?.value
    );

    return {
      key: currentMetric.key,
      recordID: recordMetadata?.id,
      title: HomeStore.formatTaskCardTitle(
        currentMetric.display_name,
        currentMetric.system.display_name,
        hasMultipleSystemsAndAllSystemsFilter
      ),
      description: currentMetric.description,
      actionLinks: [
        taskCardLabelsActionLinks.uploadData,
        taskCardLabelsActionLinks.manualEntry,
      ],
      metricFrequency,
      hasMetricValue,
      status: recordMetadata?.status,
      metricKey: currentMetric.key,
    };
  };

  /**
   * Creates task card metadata object used to render record task cards with publish action link.
   */
  static createPublishTaskCardMetadata(
    recordMetadata: LatestRecordMetadata,
    frequency: ReportFrequency
  ): TaskCardMetadata {
    return {
      key: recordMetadata.recordTitle,
      recordID: recordMetadata.id,
      title: recordMetadata.recordTitle,
      description: `Publish all the data you have added for ${
        recordMetadata.recordTitle.split("(")[0] // Remove `(<Starting Month>)` from description for annual records
      }`,
      actionLinks: [taskCardLabelsActionLinks.publish],
      metricFrequency: frequency,
    };
  }

  /** Formatting Helpers */

  /**
   * Strips the system name from a given metric key and returns the raw metric key.
   *
   * @example
   * metricKey = "PAROLE_FUNDING"
   * systemKey = "PAROLE"
   * returns "FUNDING"
   */
  static stripSystemKeyFromMetricKey(metricKey: string, systemKey: string) {
    return metricKey.replace(`${systemKey}_`, "");
  }

  /**
   * Formats a task card title to include the system name in parenthesis if the
   * user has multiple systems and they are viewing all of the task cards for all
   * of their systems (under the "All" filter)
   * @returns "Metric" or "Metric (System Name)"
   */
  static formatTaskCardTitle(
    title: string,
    systemName: string,
    hasMultipleSystemsAndAllSystemsFilter?: boolean
  ) {
    if (!hasMultipleSystemsAndAllSystemsFilter) return title;
    return `${title} ${title.includes(systemName) ? `` : `(${systemName})`}`;
  }

  /**
   * Creates Report Title (includes month name in parenthesis to differentiate
   * between annual records of similar time-periods)
   */
  static createReportTitle = (record: Report, monthName?: string) => {
    return monthName
      ? `${printReportTitle(
          record.month,
          record.year,
          record.frequency
        )} (${monthName})`
      : printReportTitle(record.month, record.year, record.frequency);
  };

  /**
   * Replaces spaces and parenthesis with hyphen
   * @returns string - e.g. returns "New-Cases-Parole" if provided "New Cases (Parole)"
   */
  static replaceSpacesAndParenthesesWithHyphen(str: string) {
    const spaceAndParenRegex = /[\s()]+/g;
    const leadingTrailingHyphenRegex = /^-+|-+$/g;
    const replacedString = str.replace(spaceAndParenRegex, "-");
    const finalString = replacedString.replace(leadingTrailingHyphenRegex, "");

    return finalString;
  }

  /** Filters */

  static enabledMetrics({ enabled }: Metric) {
    return enabled;
  }

  static unconfiguredMetrics({ enabled }: Metric) {
    return enabled === null;
  }

  metricsBelongToCurrentSystem(metric: Metric) {
    return (
      this.currentSystemSelection === "ALL" ||
      metric.system.key === this.currentSystemSelection
    );
  }

  /**
   * Filters supervision subsystems with enabled metrics.
   *
   * Note: used to render supervision subsystem filter options
   * in the homepage for supervision subsystems with enabled metrics
   * and subsequently hide the subsystem option for subsystems
   * with no enabled metrics.
   *
   * @example
   * `agencySystems` filter options: ["ALL", "SUPERVISION", "PAROLE", "PROBATION"]
   * If "PAROLE" subsystem has no enabled metrics, then the filtered list would become
   * ["ALL", "SUPERVISION", "PROBATION"]
   */
  supervisionSubsystemsWithEnabledMetrics(system: SystemSelectionOptions) {
    const isSupervisionSubsystem = Boolean(
      SupervisionSubsystems.includes(system.toUpperCase() as AgencySystems)
    );
    if (!isSupervisionSubsystem) return true;

    const enabledSupervisionSubsystemMetrics = this.agencyMetrics
      .filter(HomeStore.enabledMetrics)
      .filter((metric) => {
        const metricSystem = metric.system.key.toLocaleLowerCase();
        return metricSystem === system.toLocaleLowerCase();
      });

    if (enabledSupervisionSubsystemMetrics.length > 0) {
      return true;
    }
    return false;
  }
}

export default HomeStore;
