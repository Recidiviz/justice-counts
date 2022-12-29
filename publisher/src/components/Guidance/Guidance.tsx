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

import { observer } from "mobx-react-lite";
import React from "react";
import { createSearchParams, useNavigate, useParams } from "react-router-dom";

import { useStore } from "../../stores";
import {
  ActionButton,
  ContentContainer,
  GuidanceContainer,
  GuidanceHeader,
  ProgressStepBubble,
  ProgressStepsContainer,
  TopicDescription,
  TopicTitle,
} from ".";

export const Guidance = observer(() => {
  const { guidanceStore } = useStore();
  const { onboardingTopicsMetadata, currentTopicID, updateTopicStatus } =
    guidanceStore;

  const currentTopicDisplayName =
    currentTopicID && onboardingTopicsMetadata[currentTopicID].topicDisplayName;
  const currentTopicDescription =
    currentTopicID && onboardingTopicsMetadata[currentTopicID].topicDescription;

  const renderProgressSteps = () => {
    if (currentTopicID === "WELCOME") return;

    const onboardingTopicsMetadataKeysExcludingWelcome = Object.keys(
      onboardingTopicsMetadata
    ).filter((topic) => topic !== "WELCOME");
    const totalNumberOfTopics =
      currentTopicID && onboardingTopicsMetadataKeysExcludingWelcome.length;

    return (
      <ProgressStepsContainer
        position={currentTopicID === "METRIC_CONFIG" ? "TOPLEFT" : undefined}
      >
        {Array.from({ length: totalNumberOfTopics || 0 }, (_, i) => (
          <ProgressStepBubble
            highlight={
              currentTopicID === onboardingTopicsMetadataKeysExcludingWelcome[i]
            }
            key={i}
          >
            {i + 1}
          </ProgressStepBubble>
        ))}
      </ProgressStepsContainer>
    );
  };

  const navigate = useNavigate();

  return (
    <>
      {/* <GuidanceHeader /> */}
      <GuidanceContainer>
        <ContentContainer
          position={
            currentTopicID === "WELCOME" || currentTopicID === "METRIC_CONFIG"
              ? "TOPLEFT"
              : undefined
          }
        >
          {renderProgressSteps()}
          <TopicTitle onClick={() => navigate(`../settings`)}>
            {/* <TopicTitle> */}
            {currentTopicDisplayName}
          </TopicTitle>
          <TopicDescription>{currentTopicDescription}</TopicDescription>
          <ActionButton
            onClick={() =>
              currentTopicID && updateTopicStatus(currentTopicID, true)
            }
          >
            Next
          </ActionButton>
        </ContentContainer>
      </GuidanceContainer>
    </>
  );
});
