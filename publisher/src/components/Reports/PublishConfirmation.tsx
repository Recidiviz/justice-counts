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
  MetricDisaggregationDimensions,
  MetricDisaggregationDimensionsWithErrors,
  MetricDisaggregationsWithErrors,
  MetricWithErrors,
} from "@justice-counts/common/types";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { trackReportPublished } from "../../analytics";
import { useStore } from "../../stores";
import { printReportTitle } from "../../utils";
import logoImg from "../assets/jc-logo-vector.png";
import errorIcon from "../assets/status-error-icon.png";
import { DataUploadHeader } from "../DataUpload";
import {
  REPORT_LOWERCASE,
  REPORTED_CAPITALIZED,
  REPORTS_LOWERCASE,
} from "../Global/constants";
import { Logo, LogoContainer } from "../Header";
import { RACE_ETHNICITY_DISAGGREGATION_KEY } from "../MetricConfiguration";
import { Heading, Subheading } from "../ReviewMetrics/ReviewMetrics.styles";
import { useCheckMetricForErrors } from "./hooks";
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

const RaceEthnicitiesGroupedByEthnicity: React.FC<{
  dimensions: MetricDisaggregationDimensions[] &
    MetricDisaggregationDimensionsWithErrors[];
}> = ({ dimensions }) => {
  const dimensionsGroupedByEthnicity =
    dimensions.reduce(
      (acc, dimension) => {
        if (dimension.ethnicity === "Hispanic") {
          acc.Hispanic.push(dimension);
        }
        if (dimension.ethnicity === "Not Hispanic") {
          acc["Not Hispanic"].push(dimension);
        }
        if (dimension.ethnicity === "Unknown Ethnicity") {
          acc["Unknown Ethnicity"].push(dimension);
        }
        return acc;
      },
      {
        Hispanic: [],
        "Not Hispanic": [],
        "Unknown Ethnicity": [],
      } as { [key: string]: MetricDisaggregationDimensionsWithErrors[] }
    ) || {};
  const dimensionsGroupedByEthnicityEntries = Object.entries(
    dimensionsGroupedByEthnicity
  );

  return (
    <>
      {dimensionsGroupedByEthnicityEntries.map(
        ([ethnicity, groupedDimensions]) => (
          <>
            <MetricSubTitleContainer secondary>
              {ethnicity}
            </MetricSubTitleContainer>
            <DisaggregationBreakdownContainer>
              {groupedDimensions.map((dimension) => (
                <DisaggregationBreakdown
                  key={dimension.key}
                  error={!!dimension.error}
                >
                  <BreakdownLabelContainer>
                    <BreakdownLabel>{dimension.race}</BreakdownLabel>
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
              ))}
            </DisaggregationBreakdownContainer>
          </>
        )
      )}
    </>
  );
};

const Disaggregation: React.FC<{
  disaggregation: MetricDisaggregationsWithErrors;
}> = ({ disaggregation }) => {
  const { display_name: displayName, dimensions } = disaggregation;

  return (
    <>
      <MetricSubTitleContainer>{displayName}</MetricSubTitleContainer>

      {disaggregation.key === RACE_ETHNICITY_DISAGGREGATION_KEY ? (
        <RaceEthnicitiesGroupedByEthnicity dimensions={dimensions} />
      ) : (
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
      )}
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
        {context.value?.toLocaleString("en-US") ||
          `Not ${REPORTED_CAPITALIZED}`}
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
          {metric.value?.toLocaleString("en-US") ||
            `Not ${REPORTED_CAPITALIZED}`}
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

const PublishConfirmation: React.FC<{ reportID: number }> = ({ reportID }) => {
  const [isPublishable, setIsPublishable] = useState(false);
  const [metricsPreview, setMetricsPreview] = useState<MetricWithErrors[]>();
  const { formStore, reportStore, userStore } = useStore();
  const { agencyId } = useParams();
  const navigate = useNavigate();
  const checkMetricForErrors = useCheckMetricForErrors(reportID);

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
        navigate(`/agency/${agencyId}/${REPORTS_LOWERCASE}`);
        showToast(
          `Congratulations! You published the ${printReportTitle(
            reportStore.reportOverviews[reportID].month,
            reportStore.reportOverviews[reportID].year,
            reportStore.reportOverviews[reportID].frequency
          )} ${REPORT_LOWERCASE}!`,
          true
        );
        const agencyID = reportStore.reportOverviews[reportID]?.agency_id;
        const agency = userStore.userAgenciesById[agencyID];
        trackReportPublished(reportID, finalMetricsToPublish, agency);
      } else {
        showToast(
          `Something went wrong publishing the ${printReportTitle(
            reportStore.reportOverviews[reportID].month,
            reportStore.reportOverviews[reportID].year,
            reportStore.reportOverviews[reportID].frequency
          )} ${REPORT_LOWERCASE}!`,
          false
        );
        setIsPublishable(true);
      }
    }
  };

  useEffect(() => {
    const { metrics, isPublishable: publishable } =
      formStore.validateAndGetAllMetricFormValues(reportID);
    const enabledMetrics = metrics.filter((metric) => metric.enabled);
    setMetricsPreview(enabledMetrics);
    setIsPublishable(publishable);
  }, [formStore, reportID]);

  return (
    <>
      <DataUploadHeader transparent={false}>
        <LogoContainer
          onClick={() => navigate(`/agency/${agencyId}/${REPORTS_LOWERCASE}`)}
        >
          <Logo src={logoImg} alt="" />
        </LogoContainer>

        <ConfirmationButtonsContainer>
          <ConfirmationDialogueTopBarButton
            type="border"
            onClick={() => navigate(-1)}
          >
            Back to data entry
          </ConfirmationDialogueTopBarButton>
          <ConfirmationDialogueTopBarButton
            type="border"
            onClick={() => navigate(`/agency/${agencyId}/${REPORTS_LOWERCASE}`)}
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
        {metricsPreview && (
          <MetricsPreviewWrapper>
            <Heading>
              Review <span>{metricsPreview.length}</span> Metrics
            </Heading>
            <Subheading>
              Before publishing, take a moment to review the changes. You must
              resolve any errors before publishing; otherwise, you can save this{" "}
              {REPORT_LOWERCASE} and return at another time.
            </Subheading>
            {metricsPreview.map((metric, i) => {
              return (
                metric.enabled && (
                  <MetricsDisplay
                    key={metric.key}
                    metric={metric}
                    metricHasError={checkMetricForErrors(metric.key)}
                    index={i}
                  />
                )
              );
            })}
          </MetricsPreviewWrapper>
        )}
      </ConfirmationDialogueWrapper>
    </>
  );
};

export default observer(PublishConfirmation);
