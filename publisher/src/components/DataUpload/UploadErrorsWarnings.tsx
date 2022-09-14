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

import { removeSnakeCase } from "../../utils";
import { ReactComponent as ErrorIcon } from "../assets/error-icon.svg";
import { ReactComponent as WarningIcon } from "../assets/warning-icon.svg";
import {
  Button,
  ButtonWrapper,
  ErrorAdditionalInfo,
  ErrorIconWrapper,
  ErrorMessageDescription,
  ErrorMessageTitle,
  ErrorMessageWrapper,
  ErrorsAndWarnings,
  MetricTitle,
  systemToTemplateSpreadsheetFileName,
  UserPromptContainer,
  UserPromptDescription,
  UserPromptError,
  UserPromptErrorContainer,
  UserPromptTitle,
  UserPromptWrapper,
} from ".";

type UploadErrorsWarningsProps = {
  errorsAndWarnings: ErrorsAndWarnings;
  setErrorsAndWarnings: (
    value: React.SetStateAction<ErrorsAndWarnings | undefined>
  ) => void;
  selectedSystem: string | undefined;
};
export const UploadErrorsWarnings: React.FC<UploadErrorsWarningsProps> = ({
  errorsAndWarnings,
  setErrorsAndWarnings,
  selectedSystem,
}) => {
  const systemFileName =
    selectedSystem && systemToTemplateSpreadsheetFileName[selectedSystem];

  return (
    <UserPromptContainer>
      <UserPromptWrapper>
        <UserPromptTitle>
          Uh oh, we found <span>{errorsAndWarnings?.errorCount}</span> errors.
        </UserPromptTitle>

        <UserPromptDescription>
          We ran into a few discrepancies between the uploaded data and the
          Justice Counts format for the{" "}
          <span>
            <a href={`./assets/${systemFileName}`} download={systemFileName}>
              {selectedSystem && removeSnakeCase(selectedSystem).toLowerCase()}
            </a>
          </span>{" "}
          system. To continue, please resolve the errors in your file and
          reupload.
        </UserPromptDescription>

        <ButtonWrapper>
          <Button type="blue" onClick={() => setErrorsAndWarnings(undefined)}>
            New Upload
          </Button>
        </ButtonWrapper>

        <UserPromptErrorContainer>
          {errorsAndWarnings?.errors.map((sheet: any) => (
            <UserPromptError key={sheet.display_name}>
              <MetricTitle>{sheet.display_name}</MetricTitle>

              {sheet.messages?.map((message: any) => (
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
        </UserPromptErrorContainer>
      </UserPromptWrapper>
    </UserPromptContainer>
  );
};
