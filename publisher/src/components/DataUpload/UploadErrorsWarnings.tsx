// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2024 Recidiviz, Inc.
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

import checkIcon from "@justice-counts/common/assets/status-check-icon.png";
import { Button } from "@justice-counts/common/components/Button";
import { AgencySystem, ReportOverview } from "@justice-counts/common/types";
import React, { Fragment } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useStore } from "../../stores";
import { formatSystemName } from "../../utils";
import { ReactComponent as ErrorIcon } from "../assets/error-icon.svg";
import { ReactComponent as WarningIcon } from "../assets/warning-icon.svg";
import { SYSTEM_LOWERCASE } from "../Global/constants";
import {
  BlueText,
  CheckIcon,
  Container,
  ErrorWarningButtonWrapper,
  ErrorWarningDescription,
  IconWrapper,
  Message,
  MessageBody,
  MessageDescription,
  MessagesContainer,
  MessageSubtitle,
  MessageTitle,
  MetricEnableDescription,
  MetricTitle,
  RedText,
  SectionHeader,
  systemToTemplateSpreadsheetFileName,
  Title,
  Wrapper,
} from ".";
import {
  ErrorsWarningsMetrics,
  ErrorWarningMessage,
  MetricErrors,
  UploadedMetric,
} from "./types";
import { isSupervisionMetricForSupervisionAgencyThatReportsSubsystems } from "./utils";

type UploadErrorsWarningsProps = {
  errorsWarningsMetrics: ErrorsWarningsMetrics;
  selectedSystem: AgencySystem | undefined;
  resetToNewUpload: () => void;
  fileName?: string;
  newAndUpdatedReports: {
    newReports: ReportOverview[];
    updatedReports: ReportOverview[];
    unchangedReports: ReportOverview[];
  };
};
export const UploadErrorsWarnings: React.FC<UploadErrorsWarningsProps> = ({
  errorsWarningsMetrics,
  selectedSystem,
  resetToNewUpload,
  fileName,
  newAndUpdatedReports,
}) => {
  const navigate = useNavigate();
  const { agencyId } = useParams() as { agencyId: string };
  const { userStore } = useStore();
  const currentAgency = userStore.getAgency(agencyId);

  const { metrics, errorsWarningsAndSuccessfulMetrics, nonMetricErrors } =
    errorsWarningsMetrics;
  const systemFileName =
    selectedSystem && systemToTemplateSpreadsheetFileName[selectedSystem];
  const successfulMetricsCount =
    errorsWarningsAndSuccessfulMetrics.successfulMetrics.length;
  const noMetricUploadCount =
    errorsWarningsAndSuccessfulMetrics.notUploadedMetrics.length;
  /** If there are non-metric errors, include them in the error count */
  const errorCount = nonMetricErrors
    ? errorsWarningsAndSuccessfulMetrics.errorWarningMetrics.length +
      (nonMetricErrors?.length || 0)
    : errorsWarningsAndSuccessfulMetrics.errorWarningMetrics.length;

  /**
   * Metric-Level errors contain a null value for `display_name` and `sheet_name`
   * because they are associated with the overall metric and not a specific excel sheet.
   */
  const sortMetricLevelErrorsBeforeSheetLevelErrors = (a: MetricErrors) =>
    !a.display_name ? -1 : 1;
  const sortErrorsBeforeWarnings = (a: ErrorWarningMessage) =>
    a.type === "ERROR" ? -1 : 1;

  const metricNotConfigured = (
    <MetricEnableDescription>
      This metric has not been configured yet. Please visit the Metric
      Configuration page to configure this metric.
    </MetricEnableDescription>
  );
  const metricDisabled = (
    <MetricEnableDescription>
      This metric is disabled. If you would like to enable it, visit the Metric
      Configuration page.
    </MetricEnableDescription>
  );

  const shouldShowDisabledMetricMessage = (m: UploadedMetric): boolean => {
    if (
      isSupervisionMetricForSupervisionAgencyThatReportsSubsystems(
        m,
        currentAgency
      )
    ) {
      // Don't show the message to the user for supervision error messages because supervision
      // sheet errors will be grouped under general Supervision errors because subsystem-specific data could
      // not be ingested.
      return false;
    }

    // If the agency does not report for supervision subsystems or the specific metric is not
    // a supervision metric, always show the message when the metric is disabled.
    return m.enabled === false;
  };

  const renderMessages = () => {
    return (
      <>
        {/* Errors */}
        {errorCount > 0 && (
          <>
            <SectionHeader>Alerts</SectionHeader>
            {errorsWarningsAndSuccessfulMetrics.errorWarningMetrics.map(
              (metric) => (
                <Message key={metric.display_name} enabled={metric.enabled}>
                  <MetricTitle>{metric.display_name}</MetricTitle>
                  {metric.enabled === null && metricNotConfigured}
                  {shouldShowDisabledMetricMessage(metric) && metricDisabled}
                  {metric.metric_errors
                    .sort(sortMetricLevelErrorsBeforeSheetLevelErrors)
                    .map((sheet) => (
                      <Fragment key={sheet.display_name}>
                        {sheet.messages
                          ?.sort(sortErrorsBeforeWarnings)
                          .map((message) => (
                            <Fragment key={message.title + message.description}>
                              <IconWrapper>
                                {message.type === "ERROR" ? (
                                  <ErrorIcon />
                                ) : (
                                  <WarningIcon />
                                )}

                                <MessageBody>
                                  <MessageTitle>
                                    {message.title}{" "}
                                    {sheet.display_name && (
                                      <span>{sheet.sheet_name}</span>
                                    )}
                                  </MessageTitle>
                                  <MessageSubtitle>
                                    {message.subtitle}
                                  </MessageSubtitle>
                                </MessageBody>
                              </IconWrapper>
                              <MessageDescription>
                                {message.description}
                              </MessageDescription>
                            </Fragment>
                          ))}
                      </Fragment>
                    ))}
                </Message>
              )
            )}

            {nonMetricErrors && nonMetricErrors.length > 0 && (
              <Message>
                {nonMetricErrors.map((message) => (
                  <Fragment key={message.title + message.description}>
                    <MetricTitle>{message.title}</MetricTitle>
                    <IconWrapper>
                      <MessageBody>
                        {message.type === "ERROR" ? (
                          <ErrorIcon />
                        ) : (
                          <WarningIcon />
                        )}
                        <MessageDescription>
                          {message.description}
                        </MessageDescription>
                      </MessageBody>
                    </IconWrapper>
                  </Fragment>
                ))}
              </Message>
            )}
          </>
        )}

        {/* Successful Metrics */}
        {successfulMetricsCount > 0 && (
          <>
            <SectionHeader>Saved Metrics</SectionHeader>
            {errorsWarningsAndSuccessfulMetrics.successfulMetrics.map(
              (metric) => (
                <Message key={metric.key} enabled={metric.enabled}>
                  <MetricTitle>
                    <CheckIcon
                      src={checkIcon}
                      alt=""
                      enabled={metric.enabled}
                    />
                    {metric.display_name}
                  </MetricTitle>
                  {metric.enabled === null && metric.datapoints.length > 0 && (
                    <MetricEnableDescription>
                      Your uploaded data has been saved. This metric has not
                      been configured yet. Please visit the Metric Configuration
                      page to configure this metric.
                    </MetricEnableDescription>
                  )}
                  {metric.enabled === false && metric.datapoints.length > 0 && (
                    <MetricEnableDescription>
                      Your uploaded data has been saved. This metric is
                      disabled. If you would like to enable it, visit the Metric
                      Configuration page.
                    </MetricEnableDescription>
                  )}
                  {metric.enabled === null &&
                    metric.datapoints.length === 0 &&
                    metricNotConfigured}
                  {metric.enabled === false &&
                    metric.datapoints.length === 0 &&
                    metricDisabled}
                  {metric.metric_errors.map((sheet) => (
                    <Fragment key={sheet.display_name + sheet.sheet_name}>
                      {sheet.messages.map((message) => (
                        <Fragment key={message.title + message.description}>
                          <IconWrapper>
                            {message.type === "ERROR" ? (
                              <ErrorIcon />
                            ) : (
                              <WarningIcon />
                            )}

                            <MessageBody>
                              <MessageTitle>{message.title}</MessageTitle>
                              <MessageSubtitle>
                                {message.subtitle}
                              </MessageSubtitle>
                            </MessageBody>
                          </IconWrapper>
                          <MessageDescription>
                            {message.description}
                          </MessageDescription>
                        </Fragment>
                      ))}
                    </Fragment>
                  ))}
                </Message>
              )
            )}
          </>
        )}
        {/* Metrics with no Uploaded Data */}
        {noMetricUploadCount > 0 && (
          <>
            <SectionHeader>Metrics Not Uploaded</SectionHeader>
            {errorsWarningsAndSuccessfulMetrics.notUploadedMetrics.map(
              (metric) => (
                <Message key={metric.key} enabled={metric.enabled}>
                  <MetricTitle>{metric.display_name}</MetricTitle>
                  {metric.metric_errors.map((sheet) => (
                    <Fragment key={sheet.display_name + sheet.sheet_name}>
                      {sheet.messages.map((message) => (
                        <Fragment key={message.title + message.description}>
                          <IconWrapper>
                            <WarningIcon />
                            <MessageBody>
                              <MessageTitle>{message.title}</MessageTitle>
                              <MessageSubtitle>
                                {message.subtitle}
                              </MessageSubtitle>
                            </MessageBody>
                          </IconWrapper>
                          <MessageDescription>
                            {message.description}
                          </MessageDescription>
                        </Fragment>
                      ))}
                    </Fragment>
                  ))}
                </Message>
              )
            )}
          </>
        )}
      </>
    );
  };

  const renderErrorWarningTitle = () => {
    return (
      <>
        {/* Section 1: Show number of metrics successfully ingested */}
        {/* Case 1: 0 metrics were saved */}
        {successfulMetricsCount === 0 && (
          <>
            No metrics were saved successfully.
            <br />
          </>
        )}

        {/* Case 2: 1 or more metrics were saved */}
        {successfulMetricsCount > 0 && (
          <>
            <BlueText>{successfulMetricsCount}</BlueText> metric
            {successfulMetricsCount === 1 ? " was" : "s were"} saved
            successfully
            {errorsWarningsAndSuccessfulMetrics.hasWarnings &&
              " (with warnings)"}
            .<br />
          </>
        )}

        {/* Section 2: Show number of metrics with errors */}
        {errorCount > 0 && (
          <>
            We encountered <RedText>{errorCount}</RedText> error
            {errorCount > 1 ? "s" : ""}.
          </>
        )}
      </>
    );
  };

  const renderSystemNameAndTemplate = () => {
    return (
      <>
        <span>
          {selectedSystem &&
            formatSystemName(selectedSystem, {
              allUserSystems: currentAgency?.systems,
            })}
        </span>{" "}
        {SYSTEM_LOWERCASE} (
        <a href={`/assets/${systemFileName}`} download={systemFileName}>
          download template
        </a>
        )
      </>
    );
  };

  const renderErrorWarningDescription = () => {
    return (
      <>
        {/* Case 1: Only Warnings (which means all metrics were successfully ingested) */}
        {errorCount === 0 && successfulMetricsCount > 0 && (
          <>
            Your data was successfully saved to Justice Counts. We ran into a
            few discrepancies between the uploaded data and the Justice Counts
            format for the {renderSystemNameAndTemplate()}, but we did our best
            to resolve them. Please review the warnings below; if needed,
            resolve the warnings in your file and reupload. Otherwise, click
            Continue to view the data.
          </>
        )}

        {/* Case 2: Has Errors Only */}
        {errorCount > 0 && successfulMetricsCount === 0 && (
          <>
            We ran into a few discrepancies between the uploaded data and the
            Justice Counts format for the {renderSystemNameAndTemplate()} that
            could not be resolved. Before continuing, we strongly recommend that
            you resolve the errors in your file and reupload. Otherwise, click
            Continue to view the data that was successfully saved.{" "}
          </>
        )}

        {/* Case 3: Has Errors and Successes */}
        {errorCount > 0 && successfulMetricsCount > 0 && (
          <>
            Some data was successfully saved, but a few discrepancies between
            the uploaded data and the Justice Counts format for the{" "}
            {renderSystemNameAndTemplate()} could not be resolved. Before
            continuing, we strongly recommend that you resolve the errors in
            your file and reupload. Otherwise, click Continue to view the data
            that was successfully saved.{" "}
          </>
        )}
      </>
    );
  };

  return (
    <Container>
      <Wrapper>
        {/* Error/Warning Header */}
        <Title>{renderErrorWarningTitle()}</Title>
        <ErrorWarningDescription>
          {renderErrorWarningDescription()}
        </ErrorWarningDescription>

        {/* Action Button(s) */}
        <ErrorWarningButtonWrapper>
          <Button label="New Upload" onClick={resetToNewUpload} />
          <Button
            label="Continue"
            onClick={() =>
              navigate(`/agency/${agencyId}/upload/review-metrics`, {
                state: {
                  uploadedMetrics: metrics,
                  fileName,
                  newReports: newAndUpdatedReports.newReports,
                  updatedReports: newAndUpdatedReports.updatedReports,
                  unchangedReports: newAndUpdatedReports.unchangedReports,
                },
                replace: true,
              })
            }
          />
        </ErrorWarningButtonWrapper>

        {/* Messages */}
        <MessagesContainer>{renderMessages()}</MessagesContainer>
      </Wrapper>
    </Container>
  );
};
