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
  const allTasksCompleteTaskCardMetadata: TaskCardMetadata = {
    title: "All tasks complete",
    description: "Your data is updated and published.",
  };
  const enabledMetrics: TaskCardMetadata[] =
    currentAgencyMetrics
      ?.filter((metric) => metric.enabled)
      .map((metric) => {
        const metricFrequency = metric.custom_frequency || metric.frequency;
        const hasMetricValue = Boolean(
          latestMonthlyAnnualRecordMetadata?.[
            metricFrequency === "MONTHLY" ? "monthly" : "annual"
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
  const untouchedMetrics: TaskCardMetadata[] =
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
  const monthlyPublishRecordTaskCardMetadata = {
    title: latestMonthlyAnnualRecordMetadata?.monthly?.reportTitle || "",
    description: `Publish all the data you have added for ${latestMonthlyAnnualRecordMetadata?.monthly?.reportTitle}`,
    actionLinks: [taskCardLabelsActionLinks.publish],
    metricFrequency: "MONTHLY" as ReportFrequency,
  };
  const annualPublishRecordTaskCard = {
    title: latestMonthlyAnnualRecordMetadata?.annual?.reportTitle || "",
    description: `Publish all the data you have added for ${latestMonthlyAnnualRecordMetadata?.annual?.reportTitle}`,
    actionLinks: [taskCardLabelsActionLinks.publish],
    metricFrequency: "ANNUAL" as ReportFrequency,
  };
  const { allMetricsWithValues, allMetricsWithoutValues } = [
    ...untouchedMetrics,
    ...enabledMetrics,
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
  const hasNoEnabledOrUntouchedMetrics =
    enabledMetrics.length === 0 && untouchedMetrics.length === 0;
  const hasCompletedAllTasks =
    hasNoEnabledOrUntouchedMetrics ||
    (latestMonthlyAnnualRecordMetadata?.annual.status === "PUBLISHED" &&
      latestMonthlyAnnualRecordMetadata?.monthly.status === "PUBLISHED" &&
      allMetricsWithoutValues.length === 0);
  const welcomeDescription = hasCompletedAllTasks
    ? "All tasks are completed"
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
        annual_report: annualRecord,
        monthly_report: monthlyRecord,
      } = (await reportStore.getLatestReports(
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
      const annualRecordReportTitle =
        "month" in annualRecord
          ? printReportTitle(
              annualRecord.month,
              annualRecord.year,
              annualRecord.frequency
            )
          : "";

      setAgencyMetrics(agencyMetrics);
      setLatestMonthlyAnnualRecordMetadata({
        monthly: {
          id: monthlyRecord?.id,
          reportTitle: monthlyRecordReportTitle,
          metrics: monthlyRecord?.metrics,
          status: monthlyRecord?.status,
        },
        annual: {
          id: annualRecord?.id,
          reportTitle: annualRecordReportTitle,
          metrics: annualRecord?.metrics,
          status: annualRecord?.status,
        },
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
            latestMonthlyAnnualRecordMetadata?.monthly.status !==
              "PUBLISHED" && (
              <TaskCard
                metadata={monthlyPublishRecordTaskCardMetadata}
                latestMonthlyAnnualRecordMetadata={
                  latestMonthlyAnnualRecordMetadata
                }
              />
            )}
          {allMetricsWithValues.find(
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
            )}
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
