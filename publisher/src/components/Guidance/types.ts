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
    topicDisplayName: string;
    topicDescription: string;
    pathToTask?: string;
  };
};

export type OnboardingTopicsStatus = {
  topicID: TopicID;
  topicCompleted: boolean;
};

export const onboardingTopicsMetadata: OnboardingTopicsMetadata = {
  AGENCY_SETUP: {
    topicDisplayName: "Agency Setup",
    topicDescription: "Agency Setup description text here...",
  },
  METRIC_CONFIG: {
    topicDisplayName: "Configure Metrics",
    topicDescription: "Configure Metrics description text here...",
  },
  ADD_DATA: {
    topicDisplayName: "Add Data",
    topicDescription: "Add Data description text here...",
  },
  PUBLISH_DATA: {
    topicDisplayName: "Publish Data",
    topicDescription: "Publish Data description text here...",
  },
};

export const mockTopicsStatus: OnboardingTopicsStatus[] = [
  {
    topicID: "WELCOME",
    topicCompleted: false,
  },
  {
    topicID: "AGENCY_SETUP",
    topicCompleted: false,
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
