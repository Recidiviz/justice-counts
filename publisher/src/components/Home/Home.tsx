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
  TaskCardActionLinksMetadataList,
  TaskCardMetadata,
} from ".";
import * as Styled from "./Home.styled";

export const Home = observer(() => {
  const { userStore, metricConfigStore, reportStore } = useStore();
  const navigate = useNavigate();
  const { agencyId } = useParams();

  const [tempMetrics, setTempMetrics] = useState<Metric[]>();
  const [
    latestMonthlyAnnualRecordMetadata,
    setLatestMonthlyAnnualRecordMetadata,
  ] = useState<LatestAnnualMonthlyRecordMetadata>();

  const userFirstName = userStore.name?.split(" ")[0];
  const taskCardLabelsActionLinks: TaskCardActionLinksMetadataList = {
    publish: { label: "Publish", path: "records/" },
    uploadData: { label: "Upload Data", path: "upload" },
    manualEntry: { label: "Manual Entry", path: "records/" },
    metricAvailability: {
      label: "Set Metric Availability",
      path: "metric-config",
    },
  };
  const allTasksCompleteTaskCardMetadata: TaskCardMetadata = {
    title: "All tasks complete",
    description: "Your data is updated and published.",
  };
  const enabledMetrics: TaskCardMetadata[] =
    tempMetrics
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
    tempMetrics
      ?.filter((metric) => metric.enabled === null)
      .map((metric) => {
        return {
          title: metric.display_name,
          description: metric.description,
          actionLinks: [taskCardLabelsActionLinks.metricAvailability],
          metricSettingsParams: `?system=${metric.system.key.toLowerCase()}&metric=${metric.key.toLowerCase()}`,
        };
      }) || [];
  const monthlyPublishRecordTaskCard = {
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
  const welcomeDescription = hasNoEnabledOrUntouchedMetrics
    ? "All tasks are completed"
    : "See open tasks below";

  const renderTaskCard = ({
    title,
    description,
    actionLinks,
    metricFrequency,
    metricSettingsParams,
  }: TaskCardMetadata): JSX.Element => {
    return (
      <Styled.TaskCard key={title}>
        <Styled.TaskCardTitle>{title}</Styled.TaskCardTitle>
        <Styled.TaskCardDescription>{description}</Styled.TaskCardDescription>
        {actionLinks && (
          <Styled.TaskCardActionLinksWrapper>
            {actionLinks.map((action) => (
              <Styled.TaskCardActionLink
                key={action.label}
                onClick={() => {
                  const isSetMetricAvailabilityAction =
                    action.label ===
                    taskCardLabelsActionLinks.metricAvailability.label;
                  const isManualEntryAction =
                    action.label ===
                    taskCardLabelsActionLinks.manualEntry.label;
                  const isPublishAction =
                    action.label === taskCardLabelsActionLinks.publish.label;
                  const reportID =
                    metricFrequency && metricFrequency === "MONTHLY"
                      ? latestMonthlyAnnualRecordMetadata?.monthly.id
                      : latestMonthlyAnnualRecordMetadata?.annual.id;
                  const reviewPagePath =
                    action.label === "Publish" ? "/review" : "";

                  if (isSetMetricAvailabilityAction) {
                    return navigate(`./${action.path + metricSettingsParams}`);
                  }
                  if (isManualEntryAction || isPublishAction) {
                    return navigate(
                      `./${action.path + reportID + reviewPagePath}`
                    );
                  }
                  navigate(`./${action.path}`);
                }}
              >
                {action.label}
              </Styled.TaskCardActionLink>
            ))}
          </Styled.TaskCardActionLinksWrapper>
        )}
      </Styled.TaskCard>
    );
  };

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
      const metrics = await metricConfigStore.getMetricSettings(
        String(agencyId)
      );
      await reportStore.getReportOverviews(String(agencyId));
      const records = reportStore.reportOverviews;
      /** Sort records latest record first, oldest record last */
      const sortedRecords = Object.values(records).sort(
        (a, b) =>
          new Date(b.year, b.month).getTime() -
          new Date(a.year, a.month).getTime()
      );
      const latestMonthlyRecordID = sortedRecords.find(
        (record) => record.frequency === "MONTHLY"
      )?.id;
      const latestAnnualRecordID = sortedRecords.find(
        (record) => record.frequency === "ANNUAL"
      )?.id;
      const latestMonthlyRecordStatus =
        records[latestMonthlyRecordID || ""]?.status;
      const latestAnnualRecordStatus =
        records[latestAnnualRecordID || ""]?.status;
      const latestMonthlyReportTitle = printReportTitle(
        records[latestMonthlyRecordID || ""]?.month,
        records[latestMonthlyRecordID || ""]?.year,
        "MONTHLY"
      );
      const latestAnnualReportTitle = printReportTitle(
        records[latestAnnualRecordID || ""]?.month,
        records[latestAnnualRecordID || ""]?.year,
        "ANNUAL"
      );

      /** Load ReportStore with both latest monthly and annual records */
      if (latestMonthlyRecordID)
        await reportStore.getReport(latestMonthlyRecordID as number);
      if (latestAnnualRecordID)
        await reportStore.getReport(latestAnnualRecordID as number);
      const latestMonthlyMetrics =
        reportStore.reportMetrics[latestMonthlyRecordID || ""];
      const latestAnnualMetrics =
        reportStore.reportMetrics[latestAnnualRecordID || ""];

      setTempMetrics(metrics);
      setLatestMonthlyAnnualRecordMetadata({
        monthly: {
          id: latestMonthlyRecordID,
          reportTitle: latestMonthlyReportTitle,
          metrics: latestMonthlyMetrics,
          status: latestMonthlyRecordStatus,
        },
        annual: {
          id: latestAnnualRecordID,
          reportTitle: latestAnnualReportTitle,
          metrics: latestAnnualMetrics,
          status: latestAnnualRecordStatus,
        },
      });
    };

    fetchMetricsAndRecords();
  }, [agencyId, metricConfigStore, reportStore]);

  if (!tempMetrics) {
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
          {hasNoEnabledOrUntouchedMetrics
            ? renderTaskCard(allTasksCompleteTaskCardMetadata)
            : allMetricsWithoutValues.map((metric) => renderTaskCard(metric))}
          {/*  */}
          {allMetricsWithValues.find(
            (metric) => metric.metricFrequency === "MONTHLY"
          ) &&
            latestMonthlyAnnualRecordMetadata?.monthly.status !== "PUBLISHED" &&
            renderTaskCard(monthlyPublishRecordTaskCard)}
          {allMetricsWithValues.find(
            (metric) => metric.metricFrequency === "ANNUAL"
          ) &&
            latestMonthlyAnnualRecordMetadata?.annual.status !== "PUBLISHED" &&
            renderTaskCard(annualPublishRecordTaskCard)}
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
