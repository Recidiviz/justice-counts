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
import {
  ActionButton,
  ActionButtonWrapper,
  CheckIcon,
  ConfiguredMetricIndicatorTitle,
  ContentContainer,
  GuidanceContainer,
  Metric,
  MetricContentContainer,
  MetricListContainer,
  MetricName,
  MetricStatus,
  Progress,
  ProgressBarContainer,
  ProgressStepBubble,
  ProgressStepsContainer,
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
  const reportStatusBadgeColors: BadgeColorMapping = {
    DRAFT: "ORANGE",
    PUBLISHED: "GREEN",
    NOT_STARTED: "RED",
  };
  const metricsEntries = Object.entries(metricConfigStore.metrics);
  const totalMetrics = metricsEntries.length;

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
        /* TODO(#267) Enable this to check during the ADD_DATA step whether or not a user has atleast one draft (if so, then the topic is complete) */
        // updateTopicStatus("ADD_DATA", true);
      }
      if (hasMinimumOnePublishedReport) {
        /* TODO(#267) Enable this to check during the PUBLISH_DATA step whether or not a user has atleast one published record (if so, then the topic is complete) */
        // updateTopicStatus("PUBLISH_DATA", true);
      }
      if (numberOfMetricsCompleted === totalMetrics) {
        /* TODO(#267) Enable this to check during the PUBLISH_DATA step whether or not a user has atleast one published record (if so, then the topic is complete) */
        // updateTopicStatus("METRIC_CONFIG", true);
      }
    };

    if (
      currentTopicID === "ADD_DATA" ||
      currentTopicID === "PUBLISH_DATA" ||
      currentTopicID === "METRIC_CONFIG"
    )
      initialize();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agencyId, currentTopicID]);

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

  const calculateOverallMetricProgress = (systemMetricKey: string) => {
    let completionPercentage = 0;
    const {
      metrics,
      dimensions,
      metricDefinitionSettings,
      dimensionDefinitionSettings,
    } = metricConfigStore;

    /** Confirm the metric’s availability/frequency */
    if (metrics[systemMetricKey].enabled !== null) {
      completionPercentage += 25;
    }

    /** Confirm metric definitions */
    const metricDefinitionsCompleted =
      metricDefinitionSettings[systemMetricKey] &&
      Object.values(metricDefinitionSettings[systemMetricKey]).filter(
        (definition) => definition.included === null
      ).length === 0;

    if (
      metricDefinitionsCompleted ||
      !metricDefinitionSettings[systemMetricKey]
    ) {
      completionPercentage += 25;
    }

    /** Confirm breakdown availability */
    const disaggregationValues = Object.values(dimensions[systemMetricKey]);
    const dimensionsCompleted =
      disaggregationValues.filter(
        (disaggregation) =>
          Object.values(disaggregation).filter(
            (dimension) => dimension.enabled === null
          ).length === 0
      ).length === disaggregationValues.length;

    if (dimensionsCompleted) {
      completionPercentage += 25;
    }

    /** Confirm breakdown definitions */
    const dimensionDefinitionSettingsValues =
      dimensionDefinitionSettings[systemMetricKey] &&
      Object.values(dimensionDefinitionSettings[systemMetricKey]);
    const dimensionDefinitionsCompleted =
      dimensionDefinitionSettingsValues?.filter(
        (dimension) =>
          Object.values(dimension).filter(
            (definition) => definition.enabled === null
          ).length === 0
      ).length === dimensionDefinitionSettingsValues?.length;

    if (
      dimensionDefinitionsCompleted ||
      !dimensionDefinitionSettings[systemMetricKey]
    ) {
      completionPercentage += 25;
    }

    return completionPercentage;
  };

  const numberOfMetricsCompleted = metricsEntries.filter(
    ([key]) => calculateOverallMetricProgress(key) === 100
  ).length;

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
              {/* TODO(#268) To be removed entirely from this section - for testing purposes only */}
              <ActionButton
                onClick={() => {
                  if (currentTopicID) {
                    updateTopicStatus(currentTopicID, true);
                  }
                }}
              >
                Mock Topic Completion
              </ActionButton>
            </>
          ) : (
            <>
              {/* TODO(#268) Replace "Mock Topic Completion" buttons and only display ActionButton if there is a buttonDisplayName property while mocking */}
              <ActionButton
                onClick={() => {
                  if (currentTopicID) {
                    if (pathToTask) navigate(pathToTask);
                    updateTopicStatus(currentTopicID, true);
                  }
                }}
              >
                {buttonDisplayName || "Mock Topic Completion"}
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

        {/* Configure Metrics: Overview List */}
        {currentTopicID === "METRIC_CONFIG" && (
          <MetricContentContainer>
            <ConfiguredMetricIndicatorTitle>
              <span>{numberOfMetricsCompleted}</span> of {totalMetrics} metrics
              configured
            </ConfiguredMetricIndicatorTitle>
            <MetricListContainer>
              {metricsEntries.map(([key, metric]) => {
                const metricCompletionPercentage =
                  calculateOverallMetricProgress(key);
                const { system, metricKey } =
                  MetricConfigStore.splitSystemMetricKey(key);

                return (
                  <Fragment key={metric.label}>
                    <Metric
                      onClick={() =>
                        navigate(
                          `../settings/metric-config?system=${system}&metric=${metricKey}`
                        )
                      }
                    >
                      <MetricName>{metric.label}</MetricName>
                      <MetricStatus greyText={metric.enabled === false}>
                        {metricCompletionPercentage === 100 &&
                          metric.enabled && (
                            <CheckIcon src={checkmarkIcon} alt="" />
                          )}
                        {metric.enabled === false && "Unavailable"}
                        {metricCompletionPercentage < 100 &&
                          metric.enabled &&
                          "Action Required"}
                      </MetricStatus>
                      <RightArrowIcon />
                    </Metric>
                    <ProgressBarContainer>
                      <Progress
                        progress={
                          metric.enabled === false
                            ? 0
                            : metricCompletionPercentage
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
