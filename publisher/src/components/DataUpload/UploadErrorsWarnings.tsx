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
  ErrorsAndWarnings,
  MetricTitle,
  systemToTemplateSpreadsheetFileName,
  UploadErrorButtonWrapper,
  UserPromptContainer,
  UserPromptDescription,
  UserPromptError,
  UserPromptErrorContainer,
  UserPromptTitle,
  UserPromptWrapper,
} from ".";

type UploadErrorsWarningsProps = {
  errorsAndWarnings: ErrorsAndWarnings;
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
    !!errorsAndWarnings.warningCount && !errorsAndWarnings.errorCount;

  return (
    <UserPromptContainer>
      <UserPromptWrapper>
        {hasWarningsOnly ? (
          <>
            <UserPromptTitle>Warning title.</UserPromptTitle>
            <UserPromptDescription>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quaerat
              quasi placeat maxime error esse sapiente similique beatae fugit id
              provident eligendi ad fugiat iure tempora a vitae, incidunt ea
              accusamus.
            </UserPromptDescription>
          </>
        ) : (
          <>
            <UserPromptTitle>
              Uh oh, we found <span>{errorsAndWarnings?.errorCount}</span> error
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

        <UploadErrorButtonWrapper>
          <Button onClick={resetToNewUpload}>New Upload</Button>

          {/* (TODO(#15195): Placeholder - this should navigate to the confirmation component */}
          {hasWarningsOnly && (
            <Button onClick={() => navigate("/")}>Continue</Button>
          )}
        </UploadErrorButtonWrapper>

        <UserPromptErrorContainer>
          {errorsAndWarnings?.errors.map((sheet: any) => (
            <UserPromptError key={sheet.display_name}>
              <MetricTitle>{sheet.display_name}</MetricTitle>

              {!sheet.display_name && (
                <Fragment key={sheet.title + sheet.description}>
                  <ErrorIconWrapper>
                    {sheet.type === "ERROR" ? <ErrorIcon /> : <WarningIcon />}

                    <ErrorMessageWrapper>
                      <ErrorMessageTitle>{sheet.title}</ErrorMessageTitle>
                      <ErrorMessageDescription>
                        {sheet.subtitle}
                      </ErrorMessageDescription>
                    </ErrorMessageWrapper>
                  </ErrorIconWrapper>
                  <ErrorAdditionalInfo>{sheet.description}</ErrorAdditionalInfo>
                </Fragment>
              )}

              {sheet.display_name &&
                sheet.messages?.map((message: any) => (
                  <Fragment key={message.title + message.description}>
                    <ErrorIconWrapper>
                      {message.type === "ERROR" ? (
                        <ErrorIcon />
                      ) : (
                        <WarningIcon />
                      )}

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
        </UserPromptErrorContainer>
      </UserPromptWrapper>
    </UserPromptContainer>
  );
};
