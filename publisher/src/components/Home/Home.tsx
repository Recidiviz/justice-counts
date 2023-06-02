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

import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useStore } from "../../stores";
import { ReactComponent as GearIcon } from "../assets/gear-icon.svg";
import { ReactComponent as OpenLinkIcon } from "../assets/open-link-icon.svg";
import { ReactComponent as SettingsIcon } from "../assets/settings-icon.svg";
import * as Styled from ".";
import { Loading } from "../Loading";

export const Home = observer(() => {
  const { userStore, metricConfigStore, reportStore } = useStore();
  const navigate = useNavigate();
  const userFirstName = userStore.name?.split(" ")[0];
  const taskCardLabelsActionLinks = {
    publish: { label: "Publish", path: "records" },
    uploadData: { label: "Upload Data", path: "upload" },
    manualEntry: { label: "Manual Entry", path: "records/" },
    metricAvailability: { label: "Metric Availability", path: "metric-config" },
  };
  const allTasksCompleteTaskCardMetadata = {
    title: "All tasks complete",
    description: "Your data is updated and published.",
  };

  const renderTaskCard = ({
    title,
    description,
    actionLinks,
    metricFrequency,
    metricSettingsParams,
  }: {
    title: string;
    description: string;
    actionLinks?: { label: string; path: string }[];
  }) => {
    return (
      <Styled.TaskCard>
        <Styled.TaskCardTitle>{title}</Styled.TaskCardTitle>
        <Styled.TaskCardDescription>{description}</Styled.TaskCardDescription>
        {actionLinks && (
          <Styled.TaskCardActionLinksWrapper>
            {actionLinks?.map((link) => (
              <Styled.TaskCardActionLink
                onClick={() => {
                  if (
                    link.path ===
                    taskCardLabelsActionLinks.metricAvailability.path
                  ) {
                    return navigate(`./${link.path + metricSettingsParams}`);
                  }
                  if (
                    link.path === taskCardLabelsActionLinks.manualEntry.path
                  ) {
                    return navigate(
                      `./${
                        link.path +
                        (metricFrequency && metricFrequency === "MONTHLY"
                          ? latestMonthlyRecordID
                          : latestAnnualRecordID)
                      }`
                    );
                  }
                  navigate(`./${link.path}`);
                }}
              >
                {link.label}
              </Styled.TaskCardActionLink>
            ))}
          </Styled.TaskCardActionLinksWrapper>
        )}
      </Styled.TaskCard>
    );
  };

  const renderSystemSelectorTabs = (
    tabs: {
      label: string;
      selected: boolean;
    }[]
  ) => {
    return (
      <Styled.ContentContainer>
        <div />
        <Styled.SystemSelectorTabWrapper>
          {tabs.map((tab) => (
            <Styled.SystemSelectorTab selected={tab.selected} key={tab.label}>
              {tab.label}
            </Styled.SystemSelectorTab>
          ))}
        </Styled.SystemSelectorTabWrapper>
        <div />
      </Styled.ContentContainer>
    );
  };

  const { agencyId } = useParams();

  const [tempMetrics, setTempMetrics] = useState<any>();
  const [tempRecords, setTempRecords] = useState<any>({});

  useEffect(() => {
    const fetchMetricsAndRecords = async () => {
      const metrics = await metricConfigStore.getMetricSettings(
        String(agencyId)
      );
      await reportStore.getReportOverviews(String(agencyId));
      const records = reportStore.reportOverviews;
      setTempMetrics(metrics);
      setTempRecords(records);
    };

    fetchMetricsAndRecords();
  }, [agencyId, metricConfigStore]);

  const sortedRecords = Object.values(tempRecords).sort(
    (a, b) =>
      new Date(b.year, b.month).getTime() - new Date(a.year, a.month).getTime()
  );

  console.log(sortedRecords);

  const latestMonthlyRecordID = sortedRecords.find(
    (record) => record.frequency === "MONTHLY"
  )?.id;
  const latestAnnualRecordID = sortedRecords.find(
    (record) => record.frequency === "ANNUAL"
  )?.id;

  const enabledMetrics =
    tempMetrics
      ?.filter((metric) => metric.enabled)
      .map((metric) => {
        return {
          title: metric.display_name,
          description: metric.description,
          metricFrequency: metric.custom_frequency || metric.frequency,
          actionLinks: metric.value
            ? [taskCardLabelsActionLinks.publish]
            : [
                taskCardLabelsActionLinks.uploadData,
                taskCardLabelsActionLinks.manualEntry,
              ],
        };
      }) || [];

  const untouchedMetrics =
    tempMetrics
      ?.filter((metric) => metric.enabled === null)
      .map((metric) => {
        return {
          title: metric.display_name,
          description: metric.description,
          metricSettingsParams: `?system=${metric.system.key.toLowerCase()}&metric=${metric.key.toLowerCase()}`,
          actionLinks: [taskCardLabelsActionLinks.metricAvailability],
        };
      }) || [];

  const hasNoEnabledOrUntouchedMetrics =
    enabledMetrics.length === 0 && untouchedMetrics.length === 0;

  const welcomeDescription = hasNoEnabledOrUntouchedMetrics
    ? "All tasks are completed"
    : "See open tasks below";

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
            : [...untouchedMetrics, ...enabledMetrics].map((metric) =>
                renderTaskCard(metric)
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
