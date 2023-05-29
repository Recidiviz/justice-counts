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

import { useStore } from "../../stores";
import { ReactComponent as GearIcon } from "../assets/gear-icon.svg";
import { ReactComponent as OpenLinkIcon } from "../assets/open-link-icon.svg";
import { ReactComponent as SettingsIcon } from "../assets/settings-icon.svg";
import * as Styled from ".";

export const Home = observer(() => {
  const { userStore } = useStore();
  const userFirstName = userStore.name?.split(" ")[0];
  return (
    <Styled.HomeContainer>
      <Styled.WelcomeUser>Welcome, {userFirstName}</Styled.WelcomeUser>
      <Styled.WelcomeDescription>
        See open tasks below
      </Styled.WelcomeDescription>
      <Styled.ContentContainer>
        <Styled.LeftPanelWrapper />
        <Styled.OpenTasksContainer>
          <Styled.TaskCard>
            <Styled.TaskCardTitle>
              Post-adjudication Admissions
            </Styled.TaskCardTitle>
            <Styled.TaskCardDescription>
              The number of admission events to the agency’s jurisdiction in
              which the person has been adjudicated.
            </Styled.TaskCardDescription>
            <Styled.TaskCardActionLinksWrapper>
              <Styled.TaskCardActionLink>
                Set Metric Availability
              </Styled.TaskCardActionLink>
              <Styled.TaskCardActionLink>Upload Data</Styled.TaskCardActionLink>
              <Styled.TaskCardActionLink>New Record</Styled.TaskCardActionLink>
              <Styled.TaskCardActionLink>Publish</Styled.TaskCardActionLink>
            </Styled.TaskCardActionLinksWrapper>
          </Styled.TaskCard>
        </Styled.OpenTasksContainer>
        <Styled.Submenu>
          <Styled.SubmenuButton>
            <GearIcon />
            Agency Settings
          </Styled.SubmenuButton>
          <Styled.SubmenuButton>
            <SettingsIcon />
            Metric Settings
          </Styled.SubmenuButton>
          <Styled.SubmenuButton>
            <OpenLinkIcon />
            Justice Counts Website
          </Styled.SubmenuButton>
        </Styled.Submenu>
      </Styled.ContentContainer>
    </Styled.HomeContainer>
  );
});
