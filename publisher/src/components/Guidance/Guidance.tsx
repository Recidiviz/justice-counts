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
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useStore } from "../../stores";
import {
  ActionButton,
  ActionButtonWrapper,
  ContentContainer,
  GuidanceContainer,
  ProgressStepBubble,
  ProgressStepsContainer,
  SkipButton,
  TopicDescription,
  TopicTitle,
} from ".";

export const Guidance = observer(() => {
  const navigate = useNavigate();
  const { agencyId } = useParams();
  const { guidanceStore, reportStore } = useStore();
  const { onboardingTopicsMetadata, currentTopicID, updateTopicStatus } =
    guidanceStore;

  const currentTopicDisplayName =
    currentTopicID && onboardingTopicsMetadata[currentTopicID].displayName;
  const currentTopicDescription =
    currentTopicID && onboardingTopicsMetadata[currentTopicID].description;
  const skippable =
    currentTopicID && onboardingTopicsMetadata[currentTopicID].skippable;
  const buttonDisplayName =
    currentTopicID &&
    onboardingTopicsMetadata[currentTopicID].buttonDisplayName;
  const pathToTask =
    currentTopicID && onboardingTopicsMetadata[currentTopicID].pathToTask;
  const topLeftPositionedTopic =
    currentTopicID === "WELCOME" || currentTopicID === "METRIC_CONFIG";

  useEffect(() => {
    const initialize = async () => {
      reportStore.resetState();
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await reportStore.getReportOverviews(agencyId!);
      const hasMinimumOneReport =
        currentTopicID === "ADD_DATA" &&
        Object.keys(reportStore.reportOverviews).length > 0;

      if (hasMinimumOneReport) {
        /* TODO(#267) Enable this to check during the ADD_DATA whether or not a user has atleast one draft (if so, then the topic is complete) */
        // updateTopicStatus(currentTopicID, true);
      }
    };

    if (currentTopicID === "ADD_DATA") initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agencyId, currentTopicID]);

  const renderProgressSteps = () => {
    if (currentTopicID === "WELCOME") return;

    const onboardingTopicsMetadataKeysExcludingWelcome = Object.keys(
      onboardingTopicsMetadata
    ).filter((topic) => topic !== "WELCOME");
    const totalNumberOfTopics =
      currentTopicID && onboardingTopicsMetadataKeysExcludingWelcome.length;

    return (
      <ProgressStepsContainer
        position={topLeftPositionedTopic ? "TOPLEFT" : undefined}
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

  return (
    <>
      <GuidanceContainer>
        <ContentContainer
          position={topLeftPositionedTopic ? "TOPLEFT" : undefined}
        >
          {renderProgressSteps()}
          <TopicTitle>{currentTopicDisplayName}</TopicTitle>
          <TopicDescription>{currentTopicDescription}</TopicDescription>

          {currentTopicID === "ADD_DATA" ? (
            <ActionButtonWrapper>
              <ActionButton
                kind="primary"
                onClick={() => navigate("../upload")}
              >
                Upload spreadsheet
              </ActionButton>
              <ActionButton
                kind="bordered"
                onClick={() => navigate("../records")}
              >
                Fill out report
              </ActionButton>
            </ActionButtonWrapper>
          ) : (
            <>
              {/* TODO(#268) Replace the || "Next" and only display ActionButton if there is a buttonDisplayName property while mocking */}
              <ActionButton
                onClick={() => {
                  if (currentTopicID) {
                    if (pathToTask) navigate(pathToTask);
                    updateTopicStatus(currentTopicID, true);
                  }
                }}
              >
                {buttonDisplayName || "Next"}
              </ActionButton>
            </>
          )}

          {skippable && (
            <SkipButton
              onClick={() =>
                currentTopicID && updateTopicStatus(currentTopicID, true)
              }
            >
              Skip
            </SkipButton>
          )}
        </ContentContainer>
      </GuidanceContainer>
    </>
  );
});
