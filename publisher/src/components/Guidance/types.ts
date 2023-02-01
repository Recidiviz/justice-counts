// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2022 Recidiviz, Inc.
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

export type TopicID =
  | "WELCOME"
  | "AGENCY_SETUP"
  | "METRIC_CONFIG"
  | "ADD_DATA"
  | "PUBLISH_DATA";

export type OnboardingTopicsMetadata = {
  [topicID: string]: {
    displayName: string;
    description: string;
    pathToTask?: string;
    buttonDisplayName?: string;
    skippable?: boolean;
  };
};

export type OnboardingTopicsStatus = {
  topicID: TopicID;
  topicCompleted: boolean;
};

export const onboardingTopicsMetadata: OnboardingTopicsMetadata = {
  WELCOME: {
    displayName: "Welcome to the Justice Counts Publisher",
    description:
      "Publisher is a web-based service that helps criminal justice agencies share important metrics with the public on a regular basis.",
    buttonDisplayName: "Get Started",
  },
  AGENCY_SETUP: {
    displayName: "Setup your agency",
    description:
      "Review and enter important information about your agency, such as your jurisdiction, colleagues, and more.",
    pathToTask: "../settings/agency-settings",
    buttonDisplayName: "Agency Settings",
    skippable: true,
  },
  METRIC_CONFIG: {
    displayName: "Configure metrics",
    description:
      "Publisher allows agencies participating in Justice Counts must indicate which of the metrics they can and cannot share at a monthly or annual frequency, as well as the agency-specific definitions of those metrics.",
  },
  ADD_DATA: {
    displayName: "Add data",
    description:
      "You can now upload data to your metrics by filling out a monthly report or by uploading a spreadsheet.",
  },
  PUBLISH_DATA: {
    displayName: "Publish your uploaded data",
    description: "It looks like you have not published your uploaded data.",
  },
};

export const mockTopicsStatus: OnboardingTopicsStatus[] = [
  {
    topicID: "WELCOME",
    topicCompleted: true,
  },
  {
    topicID: "AGENCY_SETUP",
    topicCompleted: true,
  },
  {
    topicID: "METRIC_CONFIG",
    topicCompleted: false,
  },
  {
    topicID: "ADD_DATA",
    topicCompleted: false,
  },
  {
    topicID: "PUBLISH_DATA",
    topicCompleted: false,
  },
];
