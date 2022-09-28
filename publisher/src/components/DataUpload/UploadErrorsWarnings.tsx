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

import React, { Fragment } from "react";
import { useNavigate } from "react-router-dom";

import { removeSnakeCase } from "../../utils";
import { ReactComponent as ErrorIcon } from "../assets/error-icon.svg";
import checkIcon from "../assets/status-check-icon.png";
import { ReactComponent as WarningIcon } from "../assets/warning-icon.svg";
import {
  BlueText,
  Button,
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
  MetricTitle,
  RedText,
  SectionHeader,
  SheetTitle,
  systemToTemplateSpreadsheetFileName,
  Title,
  Wrapper,
} from ".";
import { ErrorsWarningsMetrics } from "./types";

type UploadErrorsWarningsProps = {
  errorsWarningsMetrics: ErrorsWarningsMetrics;
  selectedSystem: string | undefined;
  resetToNewUpload: () => void;
};
export const UploadErrorsWarnings: React.FC<UploadErrorsWarningsProps> = ({
  errorsWarningsMetrics,
  selectedSystem,
  resetToNewUpload,
}) => {
  const { metrics, errorsWarningsAndSuccessfulMetrics, nonMetricErrors } =
    errorsWarningsMetrics;
  const navigate = useNavigate();
  const systemFileName =
    selectedSystem && systemToTemplateSpreadsheetFileName[selectedSystem];
  const successCount =
    errorsWarningsAndSuccessfulMetrics.successfulMetrics.length;
  /** If there are non-metric errors, include them in the error count */
  const errorCount = nonMetricErrors
    ? errorsWarningsAndSuccessfulMetrics.errorWarningMetrics.length +
      nonMetricErrors?.length
    : errorsWarningsAndSuccessfulMetrics.errorWarningMetrics.length;

  const renderMessages = () => {
    return (
      <>
        {/* Errors */}
        {errorCount > 0 && (
          <>
            <SectionHeader>Errors</SectionHeader>
            {errorsWarningsAndSuccessfulMetrics.errorWarningMetrics.map(
              (metric) => (
                <Message key={metric.display_name}>
                  <MetricTitle>{metric.display_name}</MetricTitle>

                  {metric.display_name &&
                    metric.metric_errors.map((sheet) => (
                      <Fragment key={sheet.display_name}>
                        {sheet.display_name && (
                          <SheetTitle>
                            {sheet.display_name} <span>{sheet.sheet_name}</span>
                          </SheetTitle>
                        )}

                        {sheet.messages?.map((message) => (
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

            {nonMetricErrors && nonMetricErrors.length > 0 && (
              <Message>
                <SheetTitle />
                {nonMetricErrors.map((message) => (
                  <Fragment key={message.title + message.description}>
                    <IconWrapper>
                      {message.type === "ERROR" ? (
                        <ErrorIcon />
                      ) : (
                        <WarningIcon />
                      )}

                      <MessageBody>
                        <MessageTitle>{message.title}</MessageTitle>
                        <MessageSubtitle>{message.subtitle}</MessageSubtitle>
                      </MessageBody>
                    </IconWrapper>
                    <MessageDescription>
                      {message.description}
                    </MessageDescription>
                  </Fragment>
                ))}
              </Message>
            )}
          </>
        )}

        {/* Successful Metrics */}
        {successCount > 0 && (
          <>
            <SectionHeader>Successes</SectionHeader>
            {errorsWarningsAndSuccessfulMetrics.successfulMetrics.map(
              (metric) => (
                <Message key={metric.key}>
                  <MetricTitle>
                    <CheckIcon src={checkIcon} alt="" />
                    {metric.display_name}
                  </MetricTitle>
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
        {errorCount === 0 && (
          <>
            <BlueText>{successCount}</BlueText> metric
            {successCount === 0 || successCount > 1 ? "s" : ""} were uploaded
            successfully.
          </>
        )}
        {errorCount > 0 && (
          <>
            <RedText>{errorCount}</RedText> metric
            {errorCount > 1 ? "s" : ""} require your attention, and{" "}
            <BlueText>{successCount}</BlueText> metric
            {successCount === 0 || successCount > 1 ? "s" : ""} were uploaded
            successfully.
          </>
        )}
      </>
    );
  };

  const renderErrorWarningDescription = () => {
    return (
      <>
        We ran into a few discrepancies between the uploaded data and the
        Justice Counts format for the{" "}
        <span>
          {selectedSystem && removeSnakeCase(selectedSystem).toLowerCase()}
        </span>{" "}
        system (
        <a href={`./assets/${systemFileName}`} download={systemFileName}>
          download example
        </a>
        )
        {errorCount > 0
          ? `. To continue, please resolve the errors in your file and
              reupload.`
          : `, but we did our best to resolve them. Please review the
          warnings and determine if it is safe to proceed. If not,
          resolve the warnings in your file and reupload.`}
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
          <Button onClick={resetToNewUpload}>New Upload</Button>

          <Button
            onClick={() =>
              navigate("/review-metrics", {
                state: metrics,
                replace: true,
              })
            }
          >
            Review
          </Button>
        </ErrorWarningButtonWrapper>

        {/* Messages */}
        <MessagesContainer>{renderMessages()}</MessagesContainer>
      </Wrapper>
    </Container>
  );
};
