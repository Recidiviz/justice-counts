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

import { makeAutoObservable } from "mobx";

import {
  mockTopicsStatus,
  OnboardingTopicsMetadata,
  onboardingTopicsMetadata,
  OnboardingTopicsStatus,
  TopicID,
} from "../components/Guidance";
import API from "./API";
import UserStore from "./UserStore";

class GuidanceStore {
  userStore: UserStore;

  api: API;

  onboardingTopicsMetadata: OnboardingTopicsMetadata;

  onboardingTopicsStatus: OnboardingTopicsStatus[];

  constructor(userStore: UserStore, api: API) {
    makeAutoObservable(this);

    this.api = api;
    this.userStore = userStore;
    this.onboardingTopicsMetadata = onboardingTopicsMetadata;
    this.onboardingTopicsStatus = mockTopicsStatus;
  }

  get hasCompletedOnboarding() {
    if (this.onboardingTopicsStatus.length === 0) return false;
    const indexOfTopicNotCompleted = this.onboardingTopicsStatus.findIndex(
      (topic) => !topic.topicCompleted
    );
    return indexOfTopicNotCompleted < 0;
  }

  get currentTopicID() {
    if (this.onboardingTopicsStatus.length === 0) return;
    const topicIndex = this.onboardingTopicsStatus.findIndex(
      (topic) => !topic.topicCompleted
    );
    if (topicIndex < 0) return;
    return this.onboardingTopicsStatus[topicIndex].topicID;
  }

  updateTopicStatus = (topicID: TopicID, status: boolean) => {
    this.onboardingTopicsStatus = this.onboardingTopicsStatus.map((topic) => {
      if (topic.topicID !== topicID) return topic;
      return { ...topic, topicCompleted: status };
    });
  };
}

export default GuidanceStore;
