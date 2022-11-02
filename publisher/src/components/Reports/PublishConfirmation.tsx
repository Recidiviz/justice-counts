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

import { showToast } from "@justice-counts/common/components/Toast";
import {
  MetricContextWithErrors,
  MetricDisaggregationDimensionsWithErrors,
  MetricDisaggregationsWithErrors,
  MetricWithErrors,
} from "@justice-counts/common/types";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { trackReportPublished } from "../../analytics";
import { useStore } from "../../stores";
import FormStore from "../../stores/FormStore";
import { printReportTitle } from "../../utils";
import logoImg from "../assets/jc-logo-vector.png";
import errorIcon from "../assets/status-error-icon.png";
import { DataUploadHeader } from "../DataUpload";
import { Logo, LogoContainer } from "../Header";
import { Heading, Subheading } from "../ReviewMetrics/ReviewMetrics.styles";
import {
  BreakdownErrorImg,
  BreakdownLabel,
  BreakdownLabelContainer,
  BreakdownValue,
  ConfirmationButtonsContainer,
  ConfirmationDialogueTopBarButton,
  ConfirmationDialogueWrapper,
  ContextContainer,
  ContextErrorImg,
  ContextValue,
  DisaggregationBreakdown,
  DisaggregationBreakdownContainer,
  HorizontalLine,
  Metric,
  MetricCollapseSignWrapper,
  MetricDetailWrapper,
  MetricHeader,
  MetricsPreviewWrapper,
  MetricSubTitleContainer,
  MetricTitle,
  MetricTitleNumber,
  MetricTitleWrapper,
  MetricValue,
  PublishConfirmButton,
  VerticalLine,
} from "./PublishConfirmation.styles";

const Disaggregation: React.FC<{
  disaggregation: MetricDisaggregationsWithErrors;
}> = ({ disaggregation }) => {
  const { display_name: displayName, dimensions } = disaggregation;
  return (
    <>
      <MetricSubTitleContainer>{displayName}</MetricSubTitleContainer>
      <DisaggregationBreakdownContainer>
        {dimensions.map(
          (dimension: MetricDisaggregationDimensionsWithErrors) => {
            return (
              <DisaggregationBreakdown
                key={dimension.key}
                error={!!dimension.error}
              >
                <BreakdownLabelContainer>
                  <BreakdownLabel>{dimension.label}</BreakdownLabel>
                  {!!dimension.error && (
                    <BreakdownErrorImg src={errorIcon} alt="" />
                  )}
                </BreakdownLabelContainer>
                <BreakdownValue
                  missing={!dimension.value}
                  error={!!dimension.error}
                >
                  {dimension.value?.toLocaleString("en-US") || "--"}
                </BreakdownValue>
              </DisaggregationBreakdown>
            );
          }
        )}
      </DisaggregationBreakdownContainer>
    </>
  );
};

const Context: React.FC<{ context: MetricContextWithErrors }> = ({
  context,
}) => {
  const hasError = !!context.error && context.required;
  return (
    <ContextContainer verticalOnly>
      <MetricSubTitleContainer>
        {context.display_name}
        {hasError && <ContextErrorImg src={errorIcon} alt="" />}
      </MetricSubTitleContainer>

      <ContextValue missing={!context.value} error={hasError}>
        {context.value?.toLocaleString("en-US") || "Not Reported"}
      </ContextValue>
    </ContextContainer>
  );
};

const MetricsDisplay: React.FC<{
  metric: MetricWithErrors;
  metricHasError: boolean;
  index: number;
}> = ({ metric, metricHasError, index }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <Metric id={metric.key}>
      <MetricHeader
        hasValue={!!metric.value}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <MetricTitleWrapper>
          <MetricTitleNumber hasError={metricHasError}>
            {index + 1}
          </MetricTitleNumber>
          <MetricTitle>{metric.display_name}</MetricTitle>
          <MetricCollapseSignWrapper isExpanded={isExpanded}>
            <HorizontalLine />
            {!isExpanded && <VerticalLine />}
          </MetricCollapseSignWrapper>
        </MetricTitleWrapper>
        <MetricValue>
          {metric.value?.toLocaleString("en-US") || "Not Reported"}
        </MetricValue>
      </MetricHeader>

      <MetricDetailWrapper isExpanded={isExpanded}>
        {/* Disaggregations > Dimensions */}
        {metric.disaggregations.length > 0 &&
          metric.disaggregations.map((disaggregation) => {
            return (
              <Disaggregation
                key={disaggregation.key}
                disaggregation={disaggregation}
              />
            );
          })}

        {/* Contexts */}
        {metric.contexts.length > 0 &&
          metric.contexts.map((context) => {
            return <Context key={context.key} context={context} />;
          })}
      </MetricDetailWrapper>
    </Metric>
  );
};

const PublishConfirmation: React.FC<{
  reportID: number;
  checkMetricForErrors: (metricKey: string, formStore: FormStore) => boolean;
  toggleConfirmationDialogue: () => void;
}> = ({ reportID, checkMetricForErrors, toggleConfirmationDialogue }) => {
  const [isPublishable, setIsPublishable] = useState(false);
  const [metricsPreview, setMetricsPreview] = useState<MetricWithErrors[]>();
  const { formStore, reportStore, userStore } = useStore();
  const navigate = useNavigate();

  const publishReport = async () => {
    if (isPublishable) {
      setIsPublishable(false);

      const finalMetricsToPublish =
        formStore.reportUpdatedValuesForBackend(reportID);

      const response = (await reportStore.updateReport(
        reportID,
        finalMetricsToPublish,
        "PUBLISHED"
      )) as Response;

      if (response.status === 200) {
        navigate("/");
        showToast(
          `Congratulations! You published the ${printReportTitle(
            reportStore.reportOverviews[reportID].month,
            reportStore.reportOverviews[reportID].year,
            reportStore.reportOverviews[reportID].frequency
          )} report!`,
          true
        );
        const agencyID = reportStore.reportOverviews[reportID]?.agency_id;
        const agency = userStore.userAgencies?.find((a) => a.id === agencyID);
        trackReportPublished(reportID, finalMetricsToPublish, agency);
      } else {
        showToast(
          `Something went wrong publishing the ${printReportTitle(
            reportStore.reportOverviews[reportID].month,
            reportStore.reportOverviews[reportID].year,
            reportStore.reportOverviews[reportID].frequency
          )} report!`,
          false
        );
        setIsPublishable(true);
      }
    }
  };

  useEffect(() => {
    const { metrics, isPublishable: publishable } =
      formStore.validateAndGetAllMetricFormValues(reportID);
    setMetricsPreview(metrics);
    setIsPublishable(publishable);
  }, [formStore, reportID]);

  return (
    <>
      <DataUploadHeader transparent={false}>
        <LogoContainer onClick={() => navigate("/")}>
          <Logo src={logoImg} alt="" />
        </LogoContainer>

        <ConfirmationButtonsContainer>
          <ConfirmationDialogueTopBarButton
            type="border"
            onClick={toggleConfirmationDialogue}
          >
            Back to data entry
          </ConfirmationDialogueTopBarButton>
          <ConfirmationDialogueTopBarButton
            type="border"
            onClick={() => navigate(-1)}
          >
            Exit without Publishing
          </ConfirmationDialogueTopBarButton>
          <PublishConfirmButton
            onClick={publishReport}
            disabled={!isPublishable}
          />
        </ConfirmationButtonsContainer>
      </DataUploadHeader>
      <ConfirmationDialogueWrapper>
        <MetricsPreviewWrapper>
          <Heading>
            {metricsPreview && (
              <>
                Review <span>{metricsPreview.length}</span> Metrics
              </>
            )}
          </Heading>
          <Subheading>
            {metricsPreview && (
              <>
                Before publishing, take a moment to review the changes. You must
                resolve any errors before publishing; otherwise, you can save
                this report and return at another time.
              </>
            )}
          </Subheading>
          {metricsPreview &&
            metricsPreview.map((metric, i) => {
              return (
                metric.enabled && (
                  <MetricsDisplay
                    key={metric.key}
                    metric={metric}
                    metricHasError={checkMetricForErrors(metric.key, formStore)}
                    index={i}
                  />
                )
              );
            })}
        </MetricsPreviewWrapper>
      </ConfirmationDialogueWrapper>
    </>
  );
};

export default observer(PublishConfirmation);
