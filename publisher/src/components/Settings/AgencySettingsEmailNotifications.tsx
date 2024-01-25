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

import { ToggleSwitch } from "@justice-counts/common/components/ToggleSwitch";
import { observer } from "mobx-react-lite";
import React from "react";

import { useStore } from "../../stores";
import {
  AgencySettingsBlock,
  AgencySettingsBlockDescription,
  AgencySettingsBlockTitle,
  EditButtonContainer,
} from "./AgencySettings.styles";

export const AgencySettingsEmailNotifications: React.FC = observer(() => {
  const { agencyStore } = useStore();
  const { updateIsUserSubscribedToEmails, isUserSubscribedToEmails } =
    agencyStore;

  const handleSubscribeUnsubscribe = () => {
    updateIsUserSubscribedToEmails(!isUserSubscribedToEmails);
  };

  return (
    <AgencySettingsBlock id="email">
      <AgencySettingsBlockTitle>
        Email Settings
        <EditButtonContainer>
          <ToggleSwitch
            checked={isUserSubscribedToEmails}
            onChange={handleSubscribeUnsubscribe}
            label={isUserSubscribedToEmails ? "Subscribed" : "Unsubscribed"}
          />
        </EditButtonContainer>
      </AgencySettingsBlockTitle>
      <AgencySettingsBlockDescription>
        This toggle will only affect your email settings for{" "}
        {agencyStore.currentAgency?.name ??
          "the agency you are currently viewing"}
        . When you unsubscribe you will no longer receive any emails for this
        agency.
        <br />
        <br />
        These email reminders will currently be sent on the 15th of each month.
        In an upcoming release, you will be able to choose when the email
        reminders are sent.
      </AgencySettingsBlockDescription>
    </AgencySettingsBlock>
  );
});
