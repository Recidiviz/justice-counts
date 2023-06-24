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
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  createAnnualRecordsMetadata,
  createConfigurationTaskCardMetadata,
  createDataEntryTaskCardMetadata,
  createMonthlyRecordMetadata,
  createPublishTaskCardMetadata,
  createTaskCardMetadatas,
  LatestAnnualMonthlyRecordMetadata,
  LatestReportsAgencyMetrics,
  metricEnabled,
  metricIsMonthly,
  metricNotConfigured,
  TaskCard,
  TaskCardMetadata,
} from ".";
import { useStore } from "../../stores";
import { ReactComponent as GearIcon } from "../assets/gear-icon.svg";
import { ReactComponent as OpenLinkIcon } from "../assets/open-link-icon.svg";
import { ReactComponent as SettingsIcon } from "../assets/settings-icon.svg";
import { Loading } from "../Loading";
import * as Styled from "./Home.styled";

export const Home = observer(() => {
  const { userStore, reportStore } = useStore();
  const navigate = useNavigate();
  const { agencyId } = useParams();
  const userFirstName = userStore.name?.split(" ")[0];

  const [loading, setLoading] = useState(true);
  const [currentAgencyMetrics, setAgencyMetrics] = useState<Metric[]>([]);
  const [
    latestMonthlyAnnualRecordsMetadata,
    setLatestMonthlyAnnualsRecordMetadata,
  ] = useState<LatestAnnualMonthlyRecordMetadata>();

  const latestMonthlyRecord = () => latestMonthlyAnnualRecordsMetadata?.monthly;
  const latestAnnualRecord = (startingMonth: number | string) =>
    latestMonthlyAnnualRecordsMetadata?.annual[startingMonth];
  const metricHasUnpublishedRecord = (metric: Metric) => {
    const latestMonthlyRecordUnpublished =
      latestMonthlyRecord()?.id &&
      latestMonthlyRecord()?.status !== "PUBLISHED";
    const latestAnnualMetricUnpublished =
      metric.starting_month &&
      latestAnnualRecord(metric.starting_month)?.status !== "PUBLISHED";
    return metricIsMonthly(metric)
      ? latestMonthlyRecordUnpublished
      : latestAnnualMetricUnpublished;
  };

  /** Task Card Metadatas */
  const allTasksCompleteTaskCardMetadata: TaskCardMetadata = {
    title: "All tasks complete",
    description: "Your data is updated and published.",
  };
  const enabledMetricsTaskCardMetadata: TaskCardMetadata[] =
    currentAgencyMetrics
      .filter(metricEnabled)
      .filter(metricHasUnpublishedRecord)
      .map((metric) =>
        createTaskCardMetadatas(
          metric,
          [latestMonthlyRecord, latestAnnualRecord],
          createDataEntryTaskCardMetadata
        )
      ) || [];
  const unconfiguredMetricsTaskCardMetadata: TaskCardMetadata[] =
    currentAgencyMetrics
      ?.filter(metricNotConfigured)
      .map((metric) =>
        createTaskCardMetadatas(
          metric,
          [latestMonthlyRecord, latestAnnualRecord],
          createConfigurationTaskCardMetadata
        )
      ) || [];

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

  /**
   * User has completed all tasks if:
   *  1. User has configured all metrics and set them all to "Not Available"
   *  2. User has entered values for all metrics in the latest annual and/or monthly
   *     records and those records are published
   */
  const hasCompletedAllTasks = () => {
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

    return (
      hasNoEnabledOrUnconfiguredMetricsTaskCardMetadata ||
      (hasPublishedLatestAnnualRecords &&
        hasPublishedLatestMonthlyRecord &&
        allMetricsWithoutValuesOrNotConfigured.length === 0)
    );
  };
  const welcomeDescription = !hasCompletedAllTasks()
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

      /** Temporary solution for case where user has no records */
      const hasMonthlyRecord = Object.values(monthlyRecord).length > 0;
      const hasAnnualRecords = Object.values(annualRecords).length > 0;
      const hasRecords = hasMonthlyRecord || hasAnnualRecords;
      if (!hasRecords) {
        setAgencyMetrics([]);
        setLoading(false);
        return;
      }

      const annualRecordsMetadata =
        hasAnnualRecords && createAnnualRecordsMetadata(annualRecords);
      const monthlyRecordMetadata =
        hasMonthlyRecord && createMonthlyRecordMetadata(monthlyRecord);
      setLatestMonthlyAnnualsRecordMetadata({
        monthly: monthlyRecordMetadata,
        annual: annualRecordsMetadata,
      });
      setAgencyMetrics(agencyMetrics);
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
          {hasCompletedAllTasks() ? (
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
                    metadata={createPublishTaskCardMetadata(
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
                  (record) => {
                    if (record.status === "PUBLISHED") return null;
                    return (
                      <TaskCard
                        key={record.id}
                        metadata={createPublishTaskCardMetadata(
                          record.reportTitle,
                          "ANNUAL"
                        )}
                        reportID={record.id}
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
