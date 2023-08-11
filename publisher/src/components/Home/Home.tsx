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
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useStore } from "../../stores";
import { removeSnakeCase } from "../../utils";
import HomeStore from "../../stores/HomeStore";
import { ReactComponent as GearIcon } from "../assets/gear-icon.svg";
import { ReactComponent as OpenLinkIcon } from "../assets/open-link-icon.svg";
import { Loading } from "../Loading";
import { LatestRecordsAgencyMetrics, TaskCard, TaskCardMetadata } from ".";
import * as Styled from "./Home.styled";

export const Home = observer(() => {
  const { userStore, homeStore } = useStore();
  const { agencyId } = useParams() as { agencyId: string };
  const navigate = useNavigate();

  const { name } = userStore;
  const {
    loading,
    systemSelectionOptions,
    currentSystemSelection,
    agencyMetrics,
    hasCompletedAllTasks,
    addDataConfigureMetricsTaskCardMetadatas,
    latestMonthlyRecordMetadata,
    latestAnnualRecordsMetadata,
    publishMetricsTaskCardMetadatas,
    updateCurrentSystemSelection,
  } = homeStore;

  const hasMonthlyRecordsToPublish =
    latestMonthlyRecordMetadata &&
    publishMetricsTaskCardMetadatas &&
    publishMetricsTaskCardMetadatas.MONTHLY.length > 0;
  const hasAnnualRecordsToPublish =
    latestAnnualRecordsMetadata &&
    publishMetricsTaskCardMetadatas &&
    publishMetricsTaskCardMetadatas.ANNUAL.length > 0;

  const welcomeUser = `Welcome${name ? `, ${name.split(" ")[0]}` : "!"}`;
  const welcomeDescription = hasCompletedAllTasks
    ? "Dashboards are updated with the latest published records"
    : "See open tasks below";
  const allTasksCompleteTaskCardMetadata: TaskCardMetadata = {
    title: "All tasks complete",
    description: "Your data is up-to-date and published.",
  };

  useEffect(() => {
    const fetchMetricsAndRecords = async () => {
      homeStore.initAgencySystemSelectionOptions(agencyId);
      (await homeStore.fetchLatestReportsAndMetrics(
        agencyId as string
      )) as LatestRecordsAgencyMetrics;
      homeStore.updateTaskCardMetadatasToRender();
    };
    fetchMetricsAndRecords();
  }, [agencyId, homeStore]);

  if (!agencyMetrics || loading) {
    return <Loading />;
  }

  return (
    <Styled.HomeContainer>
      <Styled.WelcomeUser>{welcomeUser}</Styled.WelcomeUser>
      <Styled.WelcomeDescription>
        {welcomeDescription}
      </Styled.WelcomeDescription>

      {/* System Selector */}
      {systemSelectionOptions.length > 1 && (
        <Styled.SystemSelectorContainer>
          <div />
          <Styled.SystemSelectorTabWrapper>
            {systemSelectionOptions.map((system) => (
              <Styled.SystemSelectorTab
                key={system}
                selected={system === currentSystemSelection}
                onClick={() => updateCurrentSystemSelection(system)}
              >
                {system.toLocaleLowerCase()}
              </Styled.SystemSelectorTab>
            ))}
          </Styled.SystemSelectorTabWrapper>
          <div />
        </Styled.SystemSelectorContainer>
      )}

      {/* Tasks & Submenu */}
      <Styled.ContentContainer>
        <Styled.LeftPanelWrapper />

        {/* All Open Tasks */}
        <Styled.OpenTasksContainer>
          {/* All Tasks Completed Card or Configure Metrics/Add Data/Publish Record Cards */}
          {hasCompletedAllTasks ? (
            <TaskCard metadata={allTasksCompleteTaskCardMetadata} />
          ) : (
            <>
              {/* Configure Metrics/Add Data Cards */}
              {addDataConfigureMetricsTaskCardMetadatas?.map(
                (taskCardMetadata) => (
                  <TaskCard
                    key={JSON.stringify(taskCardMetadata)}
                    metadata={taskCardMetadata}
                    reportID={taskCardMetadata.reportID}
                  />
                )
              )}
            </>
          )}

          {/* Publish Latest Monthly Record Card */}
          {hasMonthlyRecordsToPublish && (
            <TaskCard
              metadata={HomeStore.createPublishTaskCardMetadata(
                latestMonthlyRecordMetadata.reportTitle,
                "MONTHLY"
              )}
              reportID={latestMonthlyRecordMetadata?.id}
            />
          )}

          {/* Publish Latest Annual Record(s) Cards */}
          {hasAnnualRecordsToPublish &&
            Object.values(latestAnnualRecordsMetadata).map((record) => {
              return (
                <TaskCard
                  key={record.id}
                  metadata={HomeStore.createPublishTaskCardMetadata(
                    record.reportTitle,
                    "ANNUAL"
                  )}
                  reportID={record.id}
                />
              );
            })}
        </Styled.OpenTasksContainer>

        {/* Submenu */}
        <Styled.Submenu>
          <Styled.SubmenuItem
            onClick={() => navigate("./settings/agency-settings")}
          >
            <GearIcon />
            Agency Settings
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
