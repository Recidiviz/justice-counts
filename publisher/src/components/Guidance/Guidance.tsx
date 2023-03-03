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

import {
  Badge,
  BadgeColorMapping,
} from "@justice-counts/common/components/Badge";
import {
  AgencySystems,
  SupervisionSubsystems,
} from "@justice-counts/common/types";
import {
  printReportTitle,
  removeSnakeCase,
} from "@justice-counts/common/utils";
import { observer } from "mobx-react-lite";
import React, { Fragment, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useStore } from "../../stores";
import MetricConfigStore from "../../stores/MetricConfigStore";
import { formatSystemName } from "../../utils";
import { ReactComponent as RightArrowIcon } from "../assets/right-arrow.svg";
import checkmarkIcon from "../assets/status-check-icon.png";
import { REPORT_LOWERCASE, REPORTS_LOWERCASE } from "../Global/constants";
import { Loader, Loading } from "../Loading";
import { MetricInfo } from "../MetricConfiguration";
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
  SystemNameTitle,
  TopicDescription,
  TopicTitle,
} from ".";

export const Guidance = observer(() => {
  const navigate = useNavigate();
  const { agencyId } = useParams() as { agencyId: string };
  const { guidanceStore, metricConfigStore, reportStore, userStore } =
    useStore();
  const {
    onboardingTopicsMetadata,
    currentTopicID,
    saveOnboardingTopicsStatuses,
    getOverallMetricProgress,
    getMetricCompletionValue,
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

  const currentAgency = userStore.getAgency(agencyId);
  const metricsEntries = Object.entries(metricConfigStore.metrics);
  const metricsEntriesBySystem = metricsEntries.reduce(
    (acc, [systemMetricKey, metric]) => {
      const { system } =
        MetricConfigStore.splitSystemMetricKey(systemMetricKey);

      if (!SupervisionSubsystems.includes(system as AgencySystems)) {
        if (!acc[system]) {
          acc[system] = [];
        }
        acc[system].push([systemMetricKey, metric]);
      }

      return acc;
    },
    {} as { [system: string]: [string, MetricInfo][] }
  );
  const totalMetrics = Object.values(metricsEntriesBySystem).reduce(
    (acc, metrics) => {
      // eslint-disable-next-line no-param-reassign
      acc += metrics.length;
      return acc;
    },
    0
  );

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

  const numberOfMetricsCompleted = Object.values(metricsEntriesBySystem)
    .flatMap((entries) => entries)
    .filter(([key]) => getMetricCompletionValue(key) === 4).length;

  useEffect(
    () => metricConfigStore.resetStore(),
    [agencyId, metricConfigStore]
  );

  useEffect(() => {
    const initializeReportStoreUpdateProgress = async () => {
      reportStore.resetState();
      await reportStore.getReportOverviews(agencyId);

      const hasMinimumOneReport =
        currentTopicID === "ADD_DATA" &&
        Object.keys(reportStore.reportOverviews).length > 0;
      const hasMinimumOnePublishedReport =
        currentTopicID === "PUBLISH_DATA" &&
        Object.values(reportStore.reportOverviews).find(
          (report) => report.status === "PUBLISHED"
        );

      if (hasMinimumOneReport) {
        saveOnboardingTopicsStatuses(
          {
            topicID: "ADD_DATA",
            topicCompleted: true,
          },
          agencyId
        );
      }
      if (hasMinimumOnePublishedReport) {
        saveOnboardingTopicsStatuses(
          {
            topicID: "PUBLISH_DATA",
            topicCompleted: true,
          },
          agencyId
        );
      }
    };
    const initializeMetricConfigStoreUpdateProgress = async () => {
      await metricConfigStore.initializeMetricConfigStoreValues(agencyId);

      if (totalMetrics > 0 && numberOfMetricsCompleted === totalMetrics) {
        saveOnboardingTopicsStatuses(
          {
            topicID: "METRIC_CONFIG",
            topicCompleted: true,
          },
          agencyId
        );
      }
    };

    // Initialize the ReportStore only when we are on the ADD_DATA/PUBLISH_DATA steps to load a list of reports in the overview screen
    if (currentTopicID === "ADD_DATA" || currentTopicID === "PUBLISH_DATA") {
      initializeReportStoreUpdateProgress();
    }

    // Initialize the MetricConfigStore only when we are on the METRIC_CONFIG step to load a list of metrics in the overview screen
    if (currentTopicID === "METRIC_CONFIG") {
      initializeMetricConfigStoreUpdateProgress();
    }

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
                  Fill out {REPORT_LOWERCASE}
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
                      saveOnboardingTopicsStatuses(
                        {
                          topicID: currentTopicID,
                          topicCompleted: true,
                        },
                        agencyId
                      );
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
              onClick={() => {
                if (currentTopicID) {
                  saveOnboardingTopicsStatuses(
                    {
                      topicID: currentTopicID,
                      topicCompleted: true,
                    },
                    agencyId
                  );
                }
              }}
            >
              Skip
            </SkipButton>
          )}
        </ContentContainer>

        {/* Configure Metrics: Overview List */}
        {currentTopicID === "METRIC_CONFIG" && (
          <MetricContentContainer>
            {totalMetrics === 0 ? (
              <Loader />
            ) : (
              <>
                <ConfiguredMetricIndicatorTitle>
                  <span>{numberOfMetricsCompleted}</span> of {totalMetrics}{" "}
                  metrics configured
                </ConfiguredMetricIndicatorTitle>
                <MetricListContainer>
                  {Object.entries(metricsEntriesBySystem).map(
                    ([system, entries]) => {
                      return (
                        <Fragment key={system}>
                          {currentAgency?.systems &&
                            currentAgency.systems.length > 1 && (
                              <SystemNameTitle>
                                {formatSystemName(system as AgencySystems)}
                              </SystemNameTitle>
                            )}
                          {entries.map(([systemMetricKey, metric]) => {
                            const metricCompletionProgress =
                              getOverallMetricProgress(systemMetricKey);
                            const metricCompletionProgressValue =
                              getMetricCompletionValue(systemMetricKey);
                            const { metricKey } =
                              MetricConfigStore.splitSystemMetricKey(
                                systemMetricKey
                              );

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
                                  <MetricStatus
                                    greyText={metric.enabled === false}
                                  >
                                    {metricCompletionProgressValue === 4 &&
                                      metric.enabled && (
                                        <CheckIcon src={checkmarkIcon} alt="" />
                                      )}
                                    {metric.enabled === false && "Unavailable"}
                                    {metricCompletionProgressValue < 4 &&
                                      (metric.enabled ||
                                        metric.enabled === null) &&
                                      "Action Required"}
                                  </MetricStatus>
                                  <RightArrowIcon />

                                  {/* Progress Tooltip */}
                                  <ProgressTooltipContainer>
                                    {metricConfigurationProgressSteps.map(
                                      (step) => (
                                        <ProgressItemWrapper key={step}>
                                          <CheckIconWrapper>
                                            {metricCompletionProgress[step] && (
                                              <CheckIcon
                                                src={checkmarkIcon}
                                                alt=""
                                              />
                                            )}
                                          </CheckIconWrapper>
                                          <ProgressItemName>
                                            {step}
                                          </ProgressItemName>
                                        </ProgressItemWrapper>
                                      )
                                    )}
                                  </ProgressTooltipContainer>
                                </Metric>
                                <ProgressBarContainer>
                                  <Progress
                                    progress={
                                      metric.enabled === false
                                        ? 0
                                        : metricCompletionProgressValue
                                    }
                                  />
                                </ProgressBarContainer>
                              </Fragment>
                            );
                          })}
                        </Fragment>
                      );
                    }
                  )}
                </MetricListContainer>
              </>
            )}
          </MetricContentContainer>
        )}
      </GuidanceContainer>
    </>
  );
});
