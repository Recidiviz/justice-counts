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
import React from "react";
import { useNavigate } from "react-router-dom";

import { useStore } from "../../stores";
import { ReactComponent as GearIcon } from "../assets/gear-icon.svg";
import { ReactComponent as OpenLinkIcon } from "../assets/open-link-icon.svg";
import { ReactComponent as SettingsIcon } from "../assets/settings-icon.svg";
import * as Styled from ".";

export const Home = observer(() => {
  const { userStore } = useStore();
  const navigate = useNavigate();
  const userFirstName = userStore.name?.split(" ")[0];
  const welcomeDescription = false // TODO: set this to the conditional that determines whether or not all tasks are completed
    ? "See open tasks below"
    : "All tasks are completed";
  const taskCardLabelsActionLinks = {
    publish: { label: "Publish", path: "records" },
    uploadData: { label: "Upload Data", path: "upload" },
    newRecord: { label: "New Record", path: "records/create" },
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
                onClick={() => navigate(`./${link.path}`)}
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

  return (
    <Styled.HomeContainer>
      <Styled.WelcomeUser>Welcome, {userFirstName}</Styled.WelcomeUser>
      <Styled.WelcomeDescription>
        {welcomeDescription}
      </Styled.WelcomeDescription>

      <Styled.ContentContainer>
        <Styled.LeftPanelWrapper />

        <Styled.OpenTasksContainer>
          {renderTaskCard(allTasksCompleteTaskCardMetadata)}
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
