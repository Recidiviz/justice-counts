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

import React, { useState } from "react";

import infoRedIcon from "../../assets/info-red-icon.png";
import { FormError } from "../../types";
import { ErrorIconContainer, ErrorInfo, ErrorLabel } from "./Input.styled";

type ErrorWithTooltipProps = {
  error: FormError;
  disabled?: boolean;
  multiline?: boolean;
  textSize?: "small";
};

export const ErrorWithTooltip: React.FC<ErrorWithTooltipProps> = ({
  error,
  disabled,
  multiline,
  textSize,
}): JSX.Element => {
  const [showErrorInfo, setShowErrorInfo] = useState<boolean>();
  return (
    <ErrorLabel
      isDisabled={disabled}
      error={error.message}
      multiline={multiline}
      textSize={textSize}
    >
      {error.message}
      {error?.info && (
        <ErrorIconContainer>
          <img
            src={infoRedIcon}
            alt=""
            width="16px"
            height="16px"
            onMouseEnter={() => setShowErrorInfo(true)}
            onMouseLeave={() => setShowErrorInfo(false)}
          />
          {showErrorInfo && <ErrorInfo>{error.info}</ErrorInfo>}
        </ErrorIconContainer>
      )}
    </ErrorLabel>
  );
};
