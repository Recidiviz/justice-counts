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
  LatestReportsAgencyMetrics,
  Metric,
  ReportFrequency,
} from "@justice-counts/common/types";
import { observer } from "mobx-react-lite";
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
    latestMonthlyAnnualRecordMetadata,
    setLatestMonthlyAnnualRecordMetadata,
  ] = useState<LatestAnnualMonthlyRecordMetadata>();

  const userFirstName = userStore.name?.split(" ")[0];

  /** Task Card Metadatas */
  const allTasksCompleteTaskCardMetadata: TaskCardMetadata = {
    title: "All tasks complete",
    description: "Your data is updated and published.",
  };
  const enabledMetricsTaskCardMetadata: TaskCardMetadata[] =
    currentAgencyMetrics
      ?.filter((metric) => metric.enabled)
      .map((metric) => {
        const metricFrequency = metric.custom_frequency || metric.frequency;
        const startingMonth = metric.starting_month;
        const hasMetricValue =
          metricFrequency === "MONTHLY"
            ? Boolean(
                latestMonthlyAnnualRecordMetadata?.monthly?.metrics?.find(
                  (m) => m.key === metric.key
                )?.value
              )
            : Boolean(
                startingMonth &&
                  latestMonthlyAnnualRecordMetadata?.annual[
                    startingMonth
                  ]?.metrics?.find((m) => m.key === metric.key)?.value
              );

        return {
          title: metric.display_name,
          description: metric.description,
          actionLinks: hasMetricValue
            ? [taskCardLabelsActionLinks.publish]
            : [
                taskCardLabelsActionLinks.uploadData,
                taskCardLabelsActionLinks.manualEntry,
              ],
          metricFrequency,
          hasMetricValue,
        };
      }) || [];
  const untouchedMetricsTaskCardMetadata: TaskCardMetadata[] =
    currentAgencyMetrics
      ?.filter((metric) => metric.enabled === null)
      .map((metric) => {
        return {
          title: metric.display_name,
          description: metric.description,
          actionLinks: [taskCardLabelsActionLinks.metricAvailability],
          metricSettingsParams: `?system=${metric.system.key.toLowerCase()}&metric=${metric.key.toLowerCase()}`,
        };
      }) || [];

  /** Creates Publish Record task card metadata for monthly and annual records */
  const createPublishRecordTaskCardMetadata = (
    reportTitle: string,
    frequency: ReportFrequency
  ) => {
    return {
      title: reportTitle,
      description: `Publish all the data you have added for ${reportTitle}`,
      actionLinks: [taskCardLabelsActionLinks.publish],
      metricFrequency: frequency,
    };
  };

  const { allMetricsWithValues, allMetricsWithoutValues } = [
    ...untouchedMetricsTaskCardMetadata,
    ...enabledMetricsTaskCardMetadata,
  ].reduce(
    (acc, metric) => {
      if (metric.hasMetricValue) {
        acc.allMetricsWithValues.push(metric);
      } else {
        acc.allMetricsWithoutValues.push(metric);
      }
      return acc;
    },
    { allMetricsWithValues: [], allMetricsWithoutValues: [] } as {
      [key: string]: TaskCardMetadata[];
    }
  );
  const hasNoEnabledOrUntouchedMetricsTaskCardMetadata =
    enabledMetricsTaskCardMetadata.length === 0 &&
    untouchedMetricsTaskCardMetadata.length === 0;
  const hasCompletedAllTasks =
    hasNoEnabledOrUntouchedMetricsTaskCardMetadata ||
    (latestMonthlyAnnualRecordMetadata &&
      Object.values(latestMonthlyAnnualRecordMetadata.annual).find(
        (metadata) => metadata.status === "PUBLISHED"
      ) &&
      latestMonthlyAnnualRecordMetadata?.monthly.status === "PUBLISHED" &&
      allMetricsWithoutValues.length === 0);
  const welcomeDescription = !hasCompletedAllTasks
    ? ""
    : "See open tasks below";

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

  useEffect(() => {
    const fetchMetricsAndRecords = async () => {
      setLoading(true);

      const {
        agency_metrics: agencyMetrics,
        annual_reports: annualRecord,
        monthly_report: monthlyRecord,
      } = (await reportStore.getLatestReportsAndMetrics(
        agencyId as string
      )) as LatestReportsAgencyMetrics;
      const monthlyRecordReportTitle =
        "month" in monthlyRecord
          ? printReportTitle(
              monthlyRecord.month,
              monthlyRecord.year,
              monthlyRecord.frequency
            )
          : "";

      const annualRecordsMetadata = Object.entries(annualRecord).reduce(
        (acc, [startingMonth, record]) => {
          const annualRecordReportTitle = printReportTitle(
            record.month,
            record.year,
            record.frequency
          );

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

      setAgencyMetrics(agencyMetrics);
      setLatestMonthlyAnnualRecordMetadata({
        monthly: {
          id: monthlyRecord?.id,
          reportTitle: monthlyRecordReportTitle,
          metrics: monthlyRecord?.metrics,
          status: monthlyRecord?.status,
        },
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

        <Styled.OpenTasksContainer>
          {hasCompletedAllTasks ? (
            <TaskCard
              metadata={allTasksCompleteTaskCardMetadata}
              latestMonthlyAnnualRecordMetadata={
                latestMonthlyAnnualRecordMetadata
              }
            />
          ) : (
            allMetricsWithoutValues.map((taskCardMetadata) => (
              <TaskCard
                metadata={taskCardMetadata}
                latestMonthlyAnnualRecordMetadata={
                  latestMonthlyAnnualRecordMetadata
                }
              />
            ))
          )}
          {/*  */}
          {allMetricsWithValues.find(
            (metric) => metric.metricFrequency === "MONTHLY"
          ) &&
            latestMonthlyAnnualRecordMetadata &&
            latestMonthlyAnnualRecordMetadata.monthly.status !==
              "PUBLISHED" && (
              <TaskCard
                metadata={createPublishRecordTaskCardMetadata(
                  latestMonthlyAnnualRecordMetadata.monthly.reportTitle || "",
                  "MONTHLY"
                )}
                latestMonthlyAnnualRecordMetadata={
                  latestMonthlyAnnualRecordMetadata
                }
              />
            )}
          {/* {allMetricsWithValues.find(
            (metric) => metric.metricFrequency === "ANNUAL"
          ) &&
            latestMonthlyAnnualRecordMetadata?.annual.status !==
              "PUBLISHED" && (
              <TaskCard
                metadata={annualPublishRecordTaskCard}
                latestMonthlyAnnualRecordMetadata={
                  latestMonthlyAnnualRecordMetadata
                }
              />
            )} */}
        </Styled.OpenTasksContainer>

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
