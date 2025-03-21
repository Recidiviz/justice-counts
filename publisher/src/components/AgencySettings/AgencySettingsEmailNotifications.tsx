// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2024 Recidiviz, Inc.
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

import { CheckboxOptions } from "@justice-counts/common/components/CheckboxOptions";
import { debounce } from "lodash";
import { observer } from "mobx-react-lite";
import React, { useRef, useState } from "react";

import { useStore } from "../../stores";
import {
  AgencySettingsBlock,
  AgencySettingsBlockDescription,
  AgencySettingsBlockTitle,
  CheckboxSpacingWrapper,
  DescriptionSection,
  ErrorMessage,
  InputWrapper,
} from "./AgencySettings.styles";

export const AgencySettingsEmailNotifications: React.FC = observer(() => {
  const { agencyStore } = useStore();
  const {
    updateEmailSubscriptionDetails,
    isUserSubscribedToEmails,
    daysAfterTimePeriodToSendEmail,
  } = agencyStore;
  const [reminderEmailOffsetDays, setReminderEmailOffsetDays] =
    useState<string>();

  const currentOffsetDays =
    reminderEmailOffsetDays === ""
      ? ""
      : reminderEmailOffsetDays || daysAfterTimePeriodToSendEmail;

  const isValidInput = (value: string | number | null) =>
    Number(value) > 0 && Number(value) <= 1000;

  const handleSubscribeUnsubscribe = () => {
    updateEmailSubscriptionDetails(
      !isUserSubscribedToEmails,
      Number(currentOffsetDays)
    );
  };

  const saveOffsetDays = (offsetDays: string, inputError: boolean) => {
    if (!inputError) {
      updateEmailSubscriptionDetails(true, Number(offsetDays));
    }
  };

  const debouncedSaveOffsetDays = useRef(
    debounce(saveOffsetDays, 1500)
  ).current;

  return (
    <AgencySettingsBlock withBorder id="email">
      <AgencySettingsBlockTitle>Email Reminders</AgencySettingsBlockTitle>
      <AgencySettingsBlockDescription>
        <DescriptionSection>
          This toggle affects your email settings for{" "}
          {agencyStore.currentAgency?.name ??
            "the agency you are currently viewing"}
          . If you subscribe, you will receive the following emails:
          <ul>
            <li>Reminders to upload data to Publisher each month</li>
            <li>
              Confirmations that Automated Bulk Upload attempts were processed
              by Publisher
            </li>
          </ul>
        </DescriptionSection>

        <DescriptionSection>
          Below, you can choose how soon after the end of each reporting period
          to receive an upload data reminder email. For instance, if you enter
          15, you would receive a reminder to upload any missing data for the
          month of March on April 15th.
        </DescriptionSection>
        <CheckboxSpacingWrapper>
          <CheckboxOptions
            options={[
              {
                key: "emailReminder",
                label: "Send me emails",
                checked: isUserSubscribedToEmails,
              },
            ]}
            onChange={() => handleSubscribeUnsubscribe()}
          />
        </CheckboxSpacingWrapper>
        {isUserSubscribedToEmails && (
          <DescriptionSection>
            Enter the number of days after the end of the reporting period to
            receive a reminder email:
            <br />
            <InputWrapper error={!isValidInput(currentOffsetDays)}>
              <input
                type="text"
                value={currentOffsetDays || ""}
                onChange={(e) => {
                  setReminderEmailOffsetDays(e.target.value);
                  debouncedSaveOffsetDays(
                    e.target.value,
                    !isValidInput(e.target.value)
                  );
                }}
              />
            </InputWrapper>
          </DescriptionSection>
        )}
        {isUserSubscribedToEmails && !isValidInput(currentOffsetDays) && (
          <ErrorMessage>Please enter a number between 1-1000</ErrorMessage>
        )}
      </AgencySettingsBlockDescription>
    </AgencySettingsBlock>
  );
});
