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

import { Metric, ReportFrequency } from "@justice-counts/common/types";
import { monthsByName } from "@justice-counts/common/utils";
import { observer } from "mobx-react-lite";
import {
  allPass,
  always,
  and,
  equals,
  filter,
  groupBy,
  ifElse,
  map,
  not,
  or,
  path,
  pipe,
  prop,
  when,
} from "ramda";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useStore } from "../../stores";
import { printReportTitle } from "../../utils";
import { ReactComponent as GearIcon } from "../assets/gear-icon.svg";
import { ReactComponent as OpenLinkIcon } from "../assets/open-link-icon.svg";
import { ReactComponent as SettingsIcon } from "../assets/settings-icon.svg";
import { Loading } from "../Loading";
import {
  AnnualRecordMetadata,
  LatestAnnualMonthlyRecordMetadata,
  LatestReportsAgencyMetrics,
  TaskCard,
  taskCardLabelsActionLinks,
  TaskCardMetadata,
} from ".";
import * as Styled from "./Home.styled";

export const Home = observer(() => {
  const { userStore, reportStore } = useStore();
  const navigate = useNavigate();
  const { agencyId } = useParams();

  const [loading, setLoading] = useState(true);
  const [currentAgencyMetrics, setAgencyMetrics] = useState<Metric[]>();
  const [
    latestMonthlyAnnualRecordsMetadata,
    setLatestMonthlyAnnualsRecordMetadata,
  ] = useState<LatestAnnualMonthlyRecordMetadata>();

  const metricEnabled = ({ enabled }: Metric) => enabled;
  const metricIsMonthly = (metric: Metric) =>
    equals(or(metric.custom_frequency, metric.frequency), "MONTHLY");
  const metricIsAnnual = (metric: Metric) =>
    equals(or(metric.custom_frequency, metric.frequency), "ANNUAL");
  const metricStartingMonth = ({ starting_month }: Metric) => starting_month;
  const latestAnnualRecordStatus = (getStartingMonth) => {
    const startingMonth = getStartingMonth();

    latestMonthlyAnnualRecordsMetadata?.annual[startingMonth] &&
      latestMonthlyAnnualRecordsMetadata?.annual[startingMonth].status;
  };
  /** Does a record that matches this metric's reporting frequency exist and is that record unpublished? */
  const hasUnpublishedLatestRecord = ifElse(
    metricIsMonthly,
    always(
      and(
        latestMonthlyAnnualRecordsMetadata?.monthly?.id,
        not(
          equals(
            latestMonthlyAnnualRecordsMetadata?.monthly?.status,
            "PUBLISHED"
          )
        )
      )
    ),
    always(
      and(
        metricStartingMonth,
        and(
          latestAnnualRecordStatus,
          equals(
            latestAnnualRecordStatus(() => metricStartingMonth),
            "PUBLISHED"
          )
        )
      )
    )
  );

  const userFirstName = userStore.name?.split(" ")[0];

  /** Task Card Metadatas */
  const allTasksCompleteTaskCardMetadata: TaskCardMetadata = {
    title: "All tasks complete",
    description: "Your data is updated and published.",
  };
  const enabledMetricsTaskCardMetadata: TaskCardMetadata[] =
    currentAgencyMetrics
      ?.filter(metricEnabled)
      .filter(hasUnpublishedLatestRecord)
      // ?.filter((metric) => {
      //   const metricFrequency = or(metric.custom_frequency, metric.frequency);
      //   const startingMonth = metric.starting_month;
      //   hasUnpublishedLatestRecord(startingMonth);

      //   /** Does a record that matches this metric's reporting frequency exist and is that record unpublished? */

      //   /** Monthly Metric */
      //   // if (metricFrequency === "MONTHLY") {
      //   //   const hasUnpublishedRecord = Boolean(
      //   //     latestMonthlyAnnualRecordsMetadata?.monthly.status !== "PUBLISHED"
      //   //   );
      //   //   return metric.enabled && hasUnpublishedRecord;
      //   // }

      //   // /** Annual Metric */
      //   // const hasUnpublishedRecord =
      //   //   startingMonth &&
      //   //   Boolean(
      //   //     latestMonthlyAnnualRecordsMetadata?.annual[startingMonth].status !==
      //   //       "PUBLISHED"
      //   //   );
      //   return metric.enabled && hasUnpublishedLatestRecord(startingMonth);
      // })
      .map((metric) => {
        // const metricFrequency = metric.custom_frequency || metric.frequency;
        // const startingMonth = metric.starting_month;
        const metricFrequency = or(metric.custom_frequency, metric.frequency);
        const startingMonth = prop("starting_month", metric);
        /** Create Task Card linked to the latest Monthly Record */
        if (metricFrequency === "MONTHLY") {
          const latestMonthlyMetricValue =
            latestMonthlyAnnualRecordsMetadata?.monthly?.metrics?.find(
              (latestMonthlyMetric) => latestMonthlyMetric.key === metric.key
            )?.value;
          const reportID = latestMonthlyAnnualRecordsMetadata?.monthly?.id;

          return {
            reportID,
            title: metric.display_name,
            description: metric.description,
            actionLinks: latestMonthlyMetricValue
              ? [taskCardLabelsActionLinks.publish]
              : [
                  taskCardLabelsActionLinks.uploadData,
                  taskCardLabelsActionLinks.manualEntry,
                ],
            metricFrequency,
            hasMetricValue: Boolean(latestMonthlyMetricValue),
          };
        }

        /** Create Task Card linked to the latest Annual Record */
        const latestAnnualMetricValue =
          startingMonth &&
          latestMonthlyAnnualRecordsMetadata?.annual[
            startingMonth
          ]?.metrics?.find(
            (latestAnnualMetric) => latestAnnualMetric.key === metric.key
          )?.value;
        const reportID =
          startingMonth &&
          latestMonthlyAnnualRecordsMetadata?.annual[startingMonth]?.id;

        return {
          reportID,
          title: metric.display_name,
          description: metric.description,
          actionLinks: latestAnnualMetricValue
            ? [taskCardLabelsActionLinks.publish]
            : [
                taskCardLabelsActionLinks.uploadData,
                taskCardLabelsActionLinks.manualEntry,
              ],
          metricFrequency,
          hasMetricValue: Boolean(latestAnnualMetricValue),
        };
      }) || [];
  const unconfiguredMetricsTaskCardMetadata: TaskCardMetadata[] =
    currentAgencyMetrics
      ?.filter((metric) => metric.enabled === null)
      .map((metric) => {
        const metricFrequency = metric.custom_frequency || metric.frequency;
        const startingMonth = metric.starting_month;

        /** Create Task Card linked to the latest Monthly Record */
        if (metricFrequency === "MONTHLY") {
          const reportID = latestMonthlyAnnualRecordsMetadata?.monthly.id;
          return {
            reportID,
            title: metric.display_name,
            description: metric.description,
            actionLinks: [taskCardLabelsActionLinks.metricAvailability],
            metricSettingsParams: `?system=${metric.system.key.toLowerCase()}&metric=${metric.key.toLowerCase()}`,
          };
        }

        /** Create Task Card linked to the latest Annual Record */
        const reportID =
          startingMonth &&
          latestMonthlyAnnualRecordsMetadata?.annual[startingMonth].id;

        return {
          reportID,
          title: metric.display_name,
          description: metric.description,
          actionLinks: [taskCardLabelsActionLinks.metricAvailability],
          metricSettingsParams: `?system=${metric.system.key.toLowerCase()}&metric=${metric.key.toLowerCase()}`,
        };
      }) || [];
  /**
   * Metrics without values or not yet configured (`allMetricsWithoutValuesOrNotConfigured`) are straightforwardly rendered.
   * Metrics with values (`allMetricsWithValues`) collapse into one Publish task card for the report the
   * metric belongs to.
   */
  const { allMetricsWithValues, allMetricsWithoutValuesOrNotConfigured } = [
    ...unconfiguredMetricsTaskCardMetadata,
    ...enabledMetricsTaskCardMetadata,
  ].reduce(
    (acc, metric) => {
      if (metric.hasMetricValue) {
        acc.allMetricsWithValues.push(metric);
      } else {
        acc.allMetricsWithoutValuesOrNotConfigured.push(metric);
      }
      return acc;
    },
    {
      allMetricsWithValues: [],
      allMetricsWithoutValuesOrNotConfigured: [],
    } as {
      [key: string]: TaskCardMetadata[];
    }
  );
  /** Determining whether or not all tasks have been completed */

  /** Case: User has configured all metrics and set them all to "Not Available" */
  const hasNoEnabledOrUnconfiguredMetricsTaskCardMetadata =
    enabledMetricsTaskCardMetadata.length === 0 &&
    unconfiguredMetricsTaskCardMetadata.length === 0;
  /** Case: User has published the latest monthly and annual record */
  const hasPublishedLatestAnnualRecords =
    latestMonthlyAnnualRecordsMetadata &&
    Object.values(latestMonthlyAnnualRecordsMetadata.annual).filter(
      (metadata) => metadata.status !== "PUBLISHED"
    ).length === 0;
  const hasPublishedLatestMonthlyRecord =
    latestMonthlyAnnualRecordsMetadata?.monthly.status === "PUBLISHED";
  /**
   * User has completed all tasks if:
   *  1. User has configured all metrics and set them all to "Not Available"
   *  2. User has entered values for all metrics in the latest annual and/or monthly
   *     records and those records are published
   */
  const hasCompletedAllTasks =
    hasNoEnabledOrUnconfiguredMetricsTaskCardMetadata ||
    (hasPublishedLatestAnnualRecords &&
      hasPublishedLatestMonthlyRecord &&
      allMetricsWithoutValuesOrNotConfigured.length === 0);
  const welcomeDescription = !hasCompletedAllTasks
    ? "See open tasks below"
    : "";

  /** TODO(#716): Support multi-system agencies */
  // const renderSystemSelectorTabs = (
  //   tabs: {
  //     label: string;
  //     selected: boolean;
  //   }[]
  // ) => {
  //   return (
  //     <Styled.ContentContainer>
  //       <div />
  //       <Styled.SystemSelectorTabWrapper>
  //         {tabs.map((tab) => (
  //           <Styled.SystemSelectorTab selected={tab.selected} key={tab.label}>
  //             {tab.label}
  //           </Styled.SystemSelectorTab>
  //         ))}
  //       </Styled.SystemSelectorTabWrapper>
  //       <div />
  //     </Styled.ContentContainer>
  //   );
  // };

  /** Creates Publish task card metadata object for monthly and annual records */
  const createPublishRecordTaskCardMetadata = (
    reportTitle: string,
    frequency: ReportFrequency
  ) => {
    return {
      title: reportTitle,
      description: `Publish all the data you have added for ${
        reportTitle.split("(")[0] // Remove `([Starting Month])` from description for annual records
      }`,
      actionLinks: [taskCardLabelsActionLinks.publish],
      metricFrequency: frequency,
    };
  };

  useEffect(() => {
    const fetchMetricsAndRecords = async () => {
      setLoading(true);
      const {
        agency_metrics: agencyMetrics,
        annual_reports: annualRecords,
        monthly_report: monthlyRecord,
      } = (await reportStore.getLatestReportsAndMetrics(
        agencyId as string
      )) as LatestReportsAgencyMetrics;

      if (
        Object.values(monthlyRecord).length === 0 &&
        Object.values(annualRecords).length === 0
      ) {
        setAgencyMetrics([]);
        setLoading(false);
        return;
      }

      /**
       * Create annual records metadata objects in the same structure as the response JSON:
       * { [key: starting month]: AnnualRecordMetadata }
       */
      const annualRecordsMetadata = Object.entries(annualRecords).reduce(
        (acc, [startingMonth, record]) => {
          // Exclude annual records with no metrics assigned to them
          if (record.metrics.length === 0) return acc;

          // Add starting month to report title to differentiate same year annual record titles
          const annualRecordReportTitle = `${printReportTitle(
            record.month,
            record.year,
            record.frequency
          )} (${monthsByName[Number(startingMonth) - 1]})`;
          acc[startingMonth] = {
            id: record?.id,
            reportTitle: annualRecordReportTitle,
            metrics: record?.metrics,
            status: record?.status,
          };
          return acc;
        },
        {} as AnnualRecordMetadata
      );

      const monthlyRecordReportTitle =
        monthlyRecord.month &&
        printReportTitle(
          monthlyRecord.month,
          monthlyRecord.year,
          monthlyRecord.frequency
        );
      const monthlyRecordMetadata =
        Object.values(monthlyRecord).length > 0
          ? {
              id: monthlyRecord?.id,
              reportTitle: monthlyRecordReportTitle || "",
              metrics: monthlyRecord?.metrics,
              status: monthlyRecord?.status,
            }
          : {};
      console.log("::::::", monthlyRecord);
      setAgencyMetrics(agencyMetrics);
      setLatestMonthlyAnnualsRecordMetadata({
        monthly: monthlyRecordMetadata,
        annual: annualRecordsMetadata,
      });
      setLoading(false);
    };

    fetchMetricsAndRecords();
  }, [agencyId, reportStore]);

  if (!currentAgencyMetrics || loading) {
    return <Loading />;
  }

  return (
    <Styled.HomeContainer>
      <Styled.WelcomeUser>Welcome, {userFirstName}</Styled.WelcomeUser>
      <Styled.WelcomeDescription>
        {welcomeDescription}
      </Styled.WelcomeDescription>

      <Styled.ContentContainer>
        <Styled.LeftPanelWrapper />
        {/* All Open Tasks */}
        <Styled.OpenTasksContainer>
          {/* All Tasks Completed Card or Configure Metrics/Add Data Cards */}
          {hasCompletedAllTasks ? (
            <TaskCard metadata={allTasksCompleteTaskCardMetadata} />
          ) : (
            <>
              {allMetricsWithoutValuesOrNotConfigured.map(
                (taskCardMetadata) => (
                  <TaskCard
                    key={taskCardMetadata.title}
                    metadata={taskCardMetadata}
                    reportID={taskCardMetadata.reportID}
                  />
                )
              )}

              {/* Publish-Ready Cards (for Monthly & Annual Records) */}

              {/* Publish latest monthly record */}
              {allMetricsWithValues.find(
                (metric) => metric.metricFrequency === "MONTHLY"
              ) &&
                latestMonthlyAnnualRecordsMetadata &&
                latestMonthlyAnnualRecordsMetadata.monthly.status !==
                  "PUBLISHED" && (
                  <TaskCard
                    metadata={createPublishRecordTaskCardMetadata(
                      latestMonthlyAnnualRecordsMetadata.monthly.reportTitle,
                      "MONTHLY"
                    )}
                    reportID={latestMonthlyAnnualRecordsMetadata.monthly.id}
                  />
                )}

              {/* Publish latest annual record(s) */}
              {allMetricsWithValues.find(
                (metric) => metric.metricFrequency === "ANNUAL"
              ) &&
                latestMonthlyAnnualRecordsMetadata?.annual &&
                Object.values(latestMonthlyAnnualRecordsMetadata.annual).map(
                  (metadata) => {
                    if (metadata.status === "PUBLISHED") return null;
                    return (
                      <TaskCard
                        key={metadata.id}
                        metadata={createPublishRecordTaskCardMetadata(
                          metadata.reportTitle,
                          "ANNUAL"
                        )}
                        reportID={metadata.id}
                      />
                    );
                  }
                )}
            </>
          )}
        </Styled.OpenTasksContainer>
        {/* Submenu */}
        <Styled.Submenu>
          <Styled.SubmenuItem
            onClick={() => navigate("./settings/agency-settings")}
          >
            <GearIcon />
            Agency Settings
          </Styled.SubmenuItem>
          <Styled.SubmenuItem onClick={() => navigate("./metric-config")}>
            <SettingsIcon />
            Metric Settings
          </Styled.SubmenuItem>
          <Styled.SubmenuItem
            href="https://justicecounts.csgjusticecenter.org/"
            rel="noreferrer noopener"
            target="_blank"
          >
            <OpenLinkIcon />
            Justice Counts Website
          </Styled.SubmenuItem>
        </Styled.Submenu>
      </Styled.ContentContainer>
    </Styled.HomeContainer>
  );
});
