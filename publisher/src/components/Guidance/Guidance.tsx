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

import {
  Badge,
  BadgeColorMapping,
} from "@justice-counts/common/components/Badge";
import {
  printReportTitle,
  removeSnakeCase,
} from "@justice-counts/common/utils";
import { observer } from "mobx-react-lite";
import React, { Fragment, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useStore } from "../../stores";
import MetricConfigStore from "../../stores/MetricConfigStore";
import { ReactComponent as RightArrowIcon } from "../assets/right-arrow.svg";
import checkmarkIcon from "../assets/status-check-icon.png";
import { REPORTS_LOWERCASE } from "../Global/constants";
import { Loading } from "../Loading";
import {
  ActionButton,
  ActionButtonWrapper,
  CheckIcon,
  CheckIconWrapper,
  ConfiguredMetricIndicatorTitle,
  ContentContainer,
  GuidanceContainer,
  Metric,
  metricConfigurationProgressSteps,
  MetricContentContainer,
  MetricListContainer,
  MetricName,
  MetricStatus,
  Progress,
  ProgressBarContainer,
  ProgressItemName,
  ProgressItemWrapper,
  ProgressStepBubble,
  ProgressStepsContainer,
  ProgressTooltipContainer,
  ReportsOverviewContainer,
  ReportsOverviewItemWrapper,
  ReportTitle,
  ReviewPublishLink,
  SkipButton,
  TopicDescription,
  TopicTitle,
} from ".";

export const Guidance = observer(() => {
  const navigate = useNavigate();
  const { agencyId } = useParams();
  const { guidanceStore, metricConfigStore, reportStore } = useStore();
  const {
    onboardingTopicsMetadata,
    currentTopicID,
    updateTopicStatus,
    calculateOverallMetricProgress,
    calculateMetricCompletionPercentage,
  } = guidanceStore;

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
  const reportStatusBadgeColors: BadgeColorMapping = {
    DRAFT: "ORANGE",
    PUBLISHED: "GREEN",
    NOT_STARTED: "RED",
  };
  const metricsEntries = Object.entries(metricConfigStore.metrics);
  const totalMetrics = metricsEntries.length;

  const renderProgressSteps = () => {
    if (currentTopicID === "WELCOME") return;

    const onboardingTopicsMetadataKeysExcludingWelcome = Object.keys(
      onboardingTopicsMetadata
    ).filter((topic) => topic !== "WELCOME");
    const totalNumberOfTopics =
      onboardingTopicsMetadataKeysExcludingWelcome.length;

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

  const numberOfMetricsCompleted = metricsEntries.filter(
    ([key]) => calculateMetricCompletionPercentage(key) === 100
  ).length;

  useEffect(() => {
    const initialize = async () => {
      reportStore.resetState();
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await reportStore.getReportOverviews(agencyId!);
      if (currentTopicID === "METRIC_CONFIG")
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        await metricConfigStore.initializeMetricConfigStoreValues(agencyId!);

      const hasMinimumOneReport =
        currentTopicID === "ADD_DATA" &&
        Object.keys(reportStore.reportOverviews).length > 0;
      const hasMinimumOnePublishedReport =
        currentTopicID === "PUBLISH_DATA" &&
        Object.values(reportStore.reportOverviews).find(
          (report) => report.status === "PUBLISHED"
        );

      if (hasMinimumOneReport) {
        updateTopicStatus("ADD_DATA", true);
      }
      if (hasMinimumOnePublishedReport) {
        updateTopicStatus("PUBLISH_DATA", true);
      }
      if (totalMetrics > 0 && numberOfMetricsCompleted === totalMetrics) {
        updateTopicStatus("METRIC_CONFIG", true);
      }
    };

    if (
      currentTopicID === "ADD_DATA" ||
      currentTopicID === "PUBLISH_DATA" ||
      currentTopicID === "METRIC_CONFIG"
    )
      initialize();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agencyId, currentTopicID, numberOfMetricsCompleted]);

  if (!guidanceStore.isInitialized) return <Loading />;

  return (
    <>
      <GuidanceContainer>
        <ContentContainer currentTopicID={currentTopicID}>
          {renderProgressSteps()}
          <TopicTitle>{currentTopicDisplayName}</TopicTitle>
          <TopicDescription>{currentTopicDescription}</TopicDescription>

          {/* Publish Data - Reports Overview */}
          {currentTopicID === "PUBLISH_DATA" && (
            <ReportsOverviewContainer>
              {Object.values(reportStore.reportOverviews).map((report) => (
                <ReportsOverviewItemWrapper key={report.id}>
                  <ReportTitle
                    onClick={() =>
                      navigate(`../${REPORTS_LOWERCASE}/${report.id}`)
                    }
                  >
                    <span>
                      {printReportTitle(
                        report.month,
                        report.year,
                        report.frequency
                      )}
                    </span>
                    <Badge color={reportStatusBadgeColors[report.status]}>
                      {removeSnakeCase(report.status).toLowerCase()}
                    </Badge>
                  </ReportTitle>
                  <ReviewPublishLink
                    onClick={() =>
                      navigate(`../${REPORTS_LOWERCASE}/${report.id}/review`)
                    }
                  >
                    Review and publish
                    <RightArrowIcon />
                  </ReviewPublishLink>
                </ReportsOverviewItemWrapper>
              ))}
            </ReportsOverviewContainer>
          )}

          {/* Action Buttons */}
          {currentTopicID === "ADD_DATA" ? (
            <>
              <ActionButtonWrapper>
                <ActionButton
                  kind="primary"
                  onClick={() => navigate("../upload")}
                >
                  Upload spreadsheet
                </ActionButton>
                <ActionButton
                  kind="bordered"
                  onClick={() => navigate(`../${REPORTS_LOWERCASE}`)}
                >
                  Fill out report
                </ActionButton>
              </ActionButtonWrapper>
            </>
          ) : (
            <>
              {buttonDisplayName && (
                <ActionButton
                  onClick={() => {
                    if (currentTopicID) {
                      if (pathToTask) navigate(pathToTask);
                      updateTopicStatus(currentTopicID, true);
                    }
                  }}
                >
                  {buttonDisplayName}
                </ActionButton>
              )}
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

        {/* Configure Metrics: Overview List */}
        {currentTopicID === "METRIC_CONFIG" && (
          <MetricContentContainer>
            <ConfiguredMetricIndicatorTitle>
              <span>{numberOfMetricsCompleted}</span> of {totalMetrics} metrics
              configured
            </ConfiguredMetricIndicatorTitle>
            <MetricListContainer>
              {metricsEntries.map(([systemMetricKey, metric]) => {
                const metricCompletionProgress =
                  calculateOverallMetricProgress(systemMetricKey);
                const metricCompletionProgressPercentage =
                  calculateMetricCompletionPercentage(systemMetricKey);
                const { system, metricKey } =
                  MetricConfigStore.splitSystemMetricKey(systemMetricKey);

                return (
                  <Fragment key={systemMetricKey}>
                    <Metric
                      hideTooltip={metric.enabled === false}
                      onClick={() =>
                        navigate(
                          `../settings/metric-config?system=${system}&metric=${metricKey}`
                        )
                      }
                    >
                      <MetricName>{metric.label}</MetricName>
                      <MetricStatus greyText={metric.enabled === false}>
                        {metricCompletionProgressPercentage === 100 &&
                          metric.enabled && (
                            <CheckIcon src={checkmarkIcon} alt="" />
                          )}
                        {metric.enabled === false && "Unavailable"}
                        {metricCompletionProgressPercentage < 100 &&
                          (metric.enabled || metric.enabled === null) &&
                          "Action Required"}
                      </MetricStatus>
                      <RightArrowIcon />

                      {/* Progress Tooltip */}
                      <ProgressTooltipContainer>
                        {metricConfigurationProgressSteps.map((step) => (
                          <ProgressItemWrapper key={step}>
                            <CheckIconWrapper>
                              {(metricCompletionProgress[step] === 25 ||
                                metricCompletionProgress[step] === 100) && (
                                <CheckIcon src={checkmarkIcon} alt="" />
                              )}
                            </CheckIconWrapper>
                            <ProgressItemName>{step}</ProgressItemName>
                          </ProgressItemWrapper>
                        ))}
                      </ProgressTooltipContainer>
                    </Metric>
                    <ProgressBarContainer>
                      <Progress
                        progress={
                          metric.enabled === false
                            ? 0
                            : metricCompletionProgressPercentage
                        }
                      />
                    </ProgressBarContainer>
                  </Fragment>
                );
              })}
            </MetricListContainer>
          </MetricContentContainer>
        )}
      </GuidanceContainer>
    </>
  );
});
