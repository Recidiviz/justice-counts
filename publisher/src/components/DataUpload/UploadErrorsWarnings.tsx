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
import { ReactComponent as WarningIcon } from "../assets/warning-icon.svg";
import {
  Button,
  ErrorAdditionalInfo,
  ErrorIconWrapper,
  ErrorMessageDescription,
  ErrorMessageTitle,
  ErrorMessageWrapper,
  MetricTitle,
  OrangeText,
  RedText,
  systemToTemplateSpreadsheetFileName,
  UploadErrorButtonWrapper,
  UserPromptContainer,
  UserPromptDescription,
  UserPromptError,
  UserPromptErrorContainer,
  UserPromptTitle,
  UserPromptWrapper,
} from ".";

export type ErrorWarningMessage = {
  title: string;
  subtitle: string;
  description: string;
  type: "ERROR" | "WARNING";
};

export type MetricErrors = {
  display_name: string;
  sheet_name: string;
  messages: ErrorWarningMessage[];
};

export type ErrorsWarnings = {
  errorCount: number;
  warningCount: number;
  metricErrors: MetricErrors[];
  preIngestErrors?: ErrorWarningMessage[];
};

type UploadErrorsWarningsProps = {
  errorsAndWarnings: ErrorsWarnings;
  selectedSystem: string | undefined;
  resetToNewUpload: () => void;
};
export const UploadErrorsWarnings: React.FC<UploadErrorsWarningsProps> = ({
  errorsAndWarnings,
  selectedSystem,
  resetToNewUpload,
}) => {
  const navigate = useNavigate();
  const systemFileName =
    selectedSystem && systemToTemplateSpreadsheetFileName[selectedSystem];
  const hasWarningsOnly =
    "warningCount" in errorsAndWarnings &&
    !!errorsAndWarnings.warningCount &&
    !errorsAndWarnings.errorCount;

  const renderMessages = () => {
    return (
      <>
        {errorsAndWarnings.metricErrors.map((sheet) => (
          <UserPromptError key={sheet.display_name}>
            <MetricTitle>
              {sheet.display_name} <span>{sheet.sheet_name}</span>
            </MetricTitle>

            {sheet.display_name &&
              sheet.messages?.map((message) => (
                <Fragment key={message.title + message.description}>
                  <ErrorIconWrapper>
                    {message.type === "ERROR" ? <ErrorIcon /> : <WarningIcon />}

                    <ErrorMessageWrapper>
                      <ErrorMessageTitle>{message.title}</ErrorMessageTitle>
                      <ErrorMessageDescription>
                        {message.subtitle}
                      </ErrorMessageDescription>
                    </ErrorMessageWrapper>
                  </ErrorIconWrapper>
                  <ErrorAdditionalInfo>
                    {message.description}
                  </ErrorAdditionalInfo>
                </Fragment>
              ))}
          </UserPromptError>
        ))}

        {errorsAndWarnings.preIngestErrors?.map((message) => (
          <UserPromptError key={message.title + message.description}>
            <MetricTitle />
            <ErrorIconWrapper>
              {message.type === "ERROR" ? <ErrorIcon /> : <WarningIcon />}

              <ErrorMessageWrapper>
                <ErrorMessageTitle>{message.title}</ErrorMessageTitle>
                <ErrorMessageDescription>
                  {message.subtitle}
                </ErrorMessageDescription>
              </ErrorMessageWrapper>
            </ErrorIconWrapper>
            <ErrorAdditionalInfo>{message.description}</ErrorAdditionalInfo>
          </UserPromptError>
        ))}
      </>
    );
  };

  return (
    <UserPromptContainer>
      <UserPromptWrapper>
        {/* Error/Warning Header */}
        {hasWarningsOnly ? (
          <>
            <UserPromptTitle>
              We found{" "}
              <OrangeText>{errorsAndWarnings?.warningCount}</OrangeText> warning
              {errorsAndWarnings?.warningCount > 1 ? "s" : ""}, but you can
              still proceed.
            </UserPromptTitle>
            <UserPromptDescription>
              We ran into a few discrepancies between the uploaded data and the
              Justice Counts format for the{" "}
              <span>
                <a
                  href={`./assets/${systemFileName}`}
                  download={systemFileName}
                >
                  {selectedSystem &&
                    removeSnakeCase(selectedSystem).toLowerCase()}
                </a>
              </span>{" "}
              system, but we did our best to resolve them. Please review the
              warnings and determine if it is safe to proceed. If not, resolve
              the warnings in your file and reupload.
            </UserPromptDescription>
          </>
        ) : (
          <>
            <UserPromptTitle>
              Uh oh, we found <RedText>{errorsAndWarnings?.errorCount}</RedText>{" "}
              error
              {errorsAndWarnings?.errorCount > 1 ? "s" : ""}.
            </UserPromptTitle>
            <UserPromptDescription>
              We ran into a few discrepancies between the uploaded data and the
              Justice Counts format for the{" "}
              <span>
                <a
                  href={`./assets/${systemFileName}`}
                  download={systemFileName}
                >
                  {selectedSystem &&
                    removeSnakeCase(selectedSystem).toLowerCase()}
                </a>
              </span>{" "}
              system. To continue, please resolve the errors in your file and
              reupload.
            </UserPromptDescription>
          </>
        )}

        {/* Action Button(s) */}
        <UploadErrorButtonWrapper>
          <Button onClick={resetToNewUpload}>New Upload</Button>

          {/* (TODO(#15195): Placeholder - this should navigate to the confirmation component */}
          {hasWarningsOnly && (
            <Button onClick={() => navigate("/")}>Continue</Button>
          )}
        </UploadErrorButtonWrapper>

        {/* Messages */}
        <UserPromptErrorContainer>{renderMessages()}</UserPromptErrorContainer>
      </UserPromptWrapper>
    </UserPromptContainer>
  );
};
