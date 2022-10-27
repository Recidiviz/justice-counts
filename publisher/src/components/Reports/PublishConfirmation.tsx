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
  HEADER_BAR_HEIGHT,
  palette,
  typography,
} from "@justice-counts/common/components/GlobalStyles";
import {
  MetricContextWithErrors,
  MetricDisaggregationDimensionsWithErrors,
  MetricDisaggregationsWithErrors,
  MetricWithErrors,
} from "@justice-counts/common/types";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components/macro";

import { trackReportPublished } from "../../analytics";
import { useStore } from "../../stores";
import FormStore from "../../stores/FormStore";
import { printReportTitle } from "../../utils";
import logoImg from "../assets/jc-logo-vector.png";
import errorIcon from "../assets/status-error-icon.png";
import { Button, DataUploadHeader } from "../DataUpload";
import { Logo, LogoContainer } from "../Header";
import {
  Heading,
  MAIN_PANEL_MAX_WIDTH,
  MainPanel,
  SectionTitle,
  SectionTitleNumber,
  Subheading,
} from "../ReviewMetrics/ReviewMetrics.styles";
import { showToast } from "../Toast";
import { CONFIRMATION_DIALOGUE_SIDE_PANEL_WIDTH } from "./ReportDataEntry.styles";

const CONTAINER_HORIZONTAL_PADDING = 24;

const ConfirmationDialogueHeader = styled(DataUploadHeader)`
  z-index: 5;
`;

const ConfirmationButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
`;

const PublishConfirmButton = styled(Button)<{ disabled: boolean }>`
  padding-right: 22px;
  padding-left: 22px;
  background-color: ${({ disabled }) =>
    disabled ? palette.highlight.grey5 : palette.solid.green};
  color: ${palette.solid.white};

  &:hover {
    cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
    opacity: ${({ disabled }) => (disabled ? 1 : 0.9)};
    background-color: ${({ disabled }) =>
      disabled ? palette.highlight.grey5 : palette.solid.green};
  }

  &::after {
    content: "Publish";
  }
`;

const ConfirmationDialogueWrapper = styled.div`
  background: ${palette.solid.white};
  display: flex;
  justify-content: center;
  position: fixed;
  top: ${HEADER_BAR_HEIGHT}px;
  overflow: scroll;
  height: 100vh;
  width: 100%;
  padding-left: ${CONFIRMATION_DIALOGUE_SIDE_PANEL_WIDTH}px;
  padding-right: ${CONFIRMATION_DIALOGUE_SIDE_PANEL_WIDTH}px;
  z-index: 4;

  @media only screen and (max-width: ${CONFIRMATION_DIALOGUE_SIDE_PANEL_WIDTH *
      2 +
    MAIN_PANEL_MAX_WIDTH}px) {
    padding-right: ${CONTAINER_HORIZONTAL_PADDING}px;
    justify-content: start;
  }

  @media only screen and (max-width: ${CONFIRMATION_DIALOGUE_SIDE_PANEL_WIDTH +
    MAIN_PANEL_MAX_WIDTH +
    CONTAINER_HORIZONTAL_PADDING * 2}px) {
    padding-left: ${CONTAINER_HORIZONTAL_PADDING}px;
    justify-content: center;
  }
`;

const MetricsPreviewWrapper = styled(MainPanel)`
  margin-top: 56px;
`;

const MetricCollapseSignWrapper = styled.div`
  width: 16px;
  height: 16px;
  position: relative;
  margin-left: 10px;
  display: none;

  &:hover {
    display: block;
  }
`;

const HorizontalLine = styled.div`
  width: 100%;
  position: absolute;
  top: 7px;
  border: 1px solid ${palette.solid.darkgrey};
  border-radius: 2px;
`;

const VerticalLine = styled.div`
  height: 100%;
  position: absolute;
  left: 7px;
  border: 1px solid ${palette.solid.darkgrey};
  border-radius: 2px;
`;

const Metric = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  justify-content: space-between;
  border-top: 1px solid ${palette.highlight.grey3};
  padding-top: 16px;
  margin-top: 32px;

  &:last-child {
    padding-bottom: ${HEADER_BAR_HEIGHT + 128}px;
  }

  &:hover ${MetricCollapseSignWrapper}:not(:hover) {
    display: block;
  }
`;

const MetricHeader = styled.div<{ hasValue: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  color: ${({ hasValue }) =>
    hasValue ? palette.solid.darkgrey : palette.highlight.grey8};

  &:hover {
    cursor: pointer;
  }
`;

const MetricTitleWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const MetricTitle = styled(SectionTitle)`
  &:hover {
    cursor: pointer;
  }
`;

const MetricTitleNumber = styled(SectionTitleNumber)<{ hasError: boolean }>`
  background-color: ${({ hasError }) =>
    hasError ? palette.solid.red : palette.solid.blue};
`;

const MetricValue = styled.div`
  ${typography.sizeCSS.title}
`;

const MetricDetailWrapper = styled.div<{ isExpanded: boolean }>`
  flex: 0 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: stretch;

  @media only screen and (max-width: ${MAIN_PANEL_MAX_WIDTH +
    CONTAINER_HORIZONTAL_PADDING * 2}px) {
    flex: 0 1 auto;
  }

  display: ${({ isExpanded }) => (isExpanded ? "block" : "none")};
`;

const MetricSubTitleContainer = styled.div`
  ${typography.sizeCSS.small}
  margin-bottom: 16px;
  margin-top: 16px;
`;

const Breakdown = styled.div<{ missing?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  font-size: 18px;
  line-height: 18px;
  font-weight: 500;
`;

const DisaggregationBreakdown = styled(Breakdown)<{ error?: boolean }>`
  color: ${({ error }) => (error ? palette.solid.red : palette.solid.darkgrey)};
`;

const DisaggregationBreakdownContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  &:hover ${DisaggregationBreakdown}:not(:hover) {
    opacity: 0.5;
  }
`;

const BreakdownLabelContainer = styled.div`
  display: flex;
`;

const BreakdownLabel = styled.div`
  display: flex;
  flex: 1;
`;

const BreakdownValue = styled.div<{ missing?: boolean; error?: boolean }>`
  display: flex;
  flex: 1;
  justify-content: flex-end;
  font-style: ${({ missing }) => missing && "italic"};
  color: ${({ error }) =>
    error ? palette.solid.red : palette.highlight.grey8};
`;

const ContextContainer = styled(Breakdown)<{ verticalOnly?: boolean }>`
  flex-direction: ${({ verticalOnly }) => (verticalOnly ? "column" : "row")};

  @media only screen and (max-width: ${MAIN_PANEL_MAX_WIDTH +
    CONTAINER_HORIZONTAL_PADDING * 2}px) {
    flex-direction: column;
  }
`;

const ContextValue = styled(BreakdownValue)`
  justify-content: flex-start;
`;

const ErrorImg = styled.img`
  margin-left: 4px;
  width: 16px;
  height: 16px;
`;

const BreakdownErrorImg = styled(ErrorImg)`
  transform: translate(0, 2px);
`;

const ContextErrorImg = styled(ErrorImg)`
  width: 12px;
  height: 12px;
  transform: translate(0, 1px);
`;

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
    <Metric id={metric.key} onClick={() => setIsExpanded(!isExpanded)}>
      <MetricHeader hasValue={!!metric.value}>
        <MetricTitleWrapper>
          <MetricTitleNumber hasError={metricHasError}>
            {index + 1}
          </MetricTitleNumber>
          <MetricTitle>{metric.display_name}</MetricTitle>
          <MetricCollapseSignWrapper>
            <HorizontalLine />
            {!isExpanded && <VerticalLine />}
          </MetricCollapseSignWrapper>
        </MetricTitleWrapper>
        <MetricValue>{metric.value || "Not Reported"}</MetricValue>
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
}> = ({ reportID, checkMetricForErrors }) => {
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
      <ConfirmationDialogueHeader transparent={false}>
        <LogoContainer onClick={() => navigate("/")}>
          <Logo src={logoImg} alt="" />
        </LogoContainer>

        <ConfirmationButtonsContainer>
          <Button type="border" onClick={() => navigate(-1)}>
            Exit without Publishing
          </Button>
          <PublishConfirmButton
            onClick={publishReport}
            disabled={!isPublishable}
          />
        </ConfirmationButtonsContainer>
      </ConfirmationDialogueHeader>
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
