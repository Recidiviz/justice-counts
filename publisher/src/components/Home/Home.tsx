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

import { useStore } from "../../stores";
import { ReactComponent as GearIcon } from "../assets/gear-icon.svg";
import { ReactComponent as OpenLinkIcon } from "../assets/open-link-icon.svg";
import { ReactComponent as SettingsIcon } from "../assets/settings-icon.svg";
import { Loading } from "../Loading";
import {
  createAnnualRecordsMetadata,
  createConfigurationTaskCardMetadata,
  createDataEntryTaskCardMetadata,
  createMonthlyRecordMetadata,
  createPublishTaskCardMetadata,
  createTaskCardMetadatas,
  groupMetadatasByValueAndConfiguration,
  LatestAnnualMonthlyRecordMetadata,
  LatestReportsAgencyMetrics,
  metricEnabled,
  metricIsMonthly,
  metricNotConfigured,
  TaskCard,
  TaskCardMetadata,
} from ".";
import * as Styled from "./Home.styled";

export const Home = observer(() => {
  const { userStore, reportStore } = useStore();
  const navigate = useNavigate();
  const { agencyId } = useParams() as { agencyId: string };
  const currentAgency = userStore.getAgency(agencyId);
  const agencySystems =
    currentAgency && currentAgency.systems.length > 1
      ? ["ALL", ...Object.values(currentAgency.systems)]
      : (currentAgency && Object.values(currentAgency.systems)) || [];

  const [loading, setLoading] = useState(true);
  const [currentAgencyMetrics, setAgencyMetrics] = useState<Metric[]>([]);
  const [
    latestMonthlyAnnualRecordsMetadata,
    setLatestMonthlyAnnualsRecordMetadata,
  ] = useState<Partial<LatestAnnualMonthlyRecordMetadata>>();

  const latestMonthlyRecord = latestMonthlyAnnualRecordsMetadata?.monthly;
  const latestAnnualRecord = (startingMonth: number | string) =>
    latestMonthlyAnnualRecordsMetadata?.annual?.[startingMonth];
  /** Does a record that matches this metric's reporting frequency exist? */
  const metricHasUnpublishedRecord = (metric: Metric) => {
    const latestMonthlyRecordUnpublished =
      latestMonthlyRecord?.id && latestMonthlyRecord?.status !== "PUBLISHED";
    const latestAnnualMetricUnpublished =
      metric.starting_month &&
      latestAnnualRecord(metric.starting_month)?.status !== "PUBLISHED";
    return metricIsMonthly(metric)
      ? latestMonthlyRecordUnpublished
      : latestAnnualMetricUnpublished;
  };
  const [currentSystem, setCurrentSystem] = useState(agencySystems[0]);

  const userFirstName = userStore.name?.split(" ")[0];
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
          { latestMonthlyRecord, latestAnnualRecord },
          createDataEntryTaskCardMetadata
        )
      ) || [];
  const unconfiguredMetricsTaskCardMetadata: TaskCardMetadata[] =
    currentAgencyMetrics
      .filter(metricNotConfigured)
      .map((metric) =>
        createTaskCardMetadatas(
          metric,
          { latestMonthlyRecord, latestAnnualRecord },
          createConfigurationTaskCardMetadata
        )
      ) || [];

  /**
   * User has completed all tasks if:
   *  1. User has configured all metrics and set them all to "Not Available"
   *  2. User has entered values for all metrics in the latest annual and/or monthly
   *     records and those records are published
   */
  const hasCompletedAllTasks =
    enabledMetricsTaskCardMetadata.length === 0 &&
    unconfiguredMetricsTaskCardMetadata.length === 0;
  const welcomeDescription = !hasCompletedAllTasks
    ? "See open tasks below"
    : "Dashboards are updated with latest published records";

  /**
   * Metrics without values or not yet configured (`allMetricMetadatasWithoutValuesOrNotConfigured`) are
   * straightforwardly rendered - each metric will have its own individual task card.
   *
   * Metrics with values (`allMetricMetadatasWithValues`) collapse into one Publish task card for the report the
   * metric belongs to. (e.g. adding data to metrics will remove those metric's individual task cards, and
   * the user will see one task card with the latest report that matches that metric's frequency with a
   * Publish action link.)
   */
  const {
    allMetricMetadatasWithValues,
    allMetricMetadatasWithoutValuesOrNotConfigured,
  } = groupMetadatasByValueAndConfiguration([
    ...unconfiguredMetricsTaskCardMetadata,
    ...enabledMetricsTaskCardMetadata,
  ]);

  useEffect(() => {
    const fetchMetricsAndRecords = async () => {
      setLoading(true);
      if (agencySystems) setCurrentSystem(agencySystems[0]);
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

      const annualRecordsMetadata = hasAnnualRecords
        ? createAnnualRecordsMetadata(annualRecords)
        : undefined;
      const monthlyRecordMetadata = hasMonthlyRecord
        ? createMonthlyRecordMetadata(monthlyRecord)
        : undefined;
      setLatestMonthlyAnnualsRecordMetadata({
        monthly: monthlyRecordMetadata,
        annual: annualRecordsMetadata,
      });
      setAgencyMetrics(agencyMetrics);
      setLoading(false);
    };

    fetchMetricsAndRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      {/* {agencySystems.length > 1 && renderSystemSelectorTabs()} */}
      <Styled.ContentContainer>
        <Styled.LeftPanelWrapper />
        {/* All Open Tasks */}
        <Styled.OpenTasksContainer>
          {/* All Tasks Completed Card or Configure Metrics/Add Data/Publish Record Cards */}
          {hasCompletedAllTasks ? (
            <TaskCard metadata={allTasksCompleteTaskCardMetadata} />
          ) : (
            <>
              {allMetricMetadatasWithoutValuesOrNotConfigured.map(
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
              {allMetricMetadatasWithValues.MONTHLY.length > 0 &&
                latestMonthlyRecord &&
                latestMonthlyRecord.status !== "PUBLISHED" && (
                  <TaskCard
                    metadata={createPublishTaskCardMetadata(
                      latestMonthlyRecord.reportTitle,
                      "MONTHLY"
                    )}
                    reportID={latestMonthlyRecord.id}
                  />
                )}

              {/* Publish latest annual record(s) */}
              {allMetricMetadatasWithValues.ANNUAL.length > 0 &&
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
