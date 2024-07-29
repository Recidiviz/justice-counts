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

import React, { InputHTMLAttributes } from "react";

import * as Styled from "./RadioButton.styled";
import { RadioButtonSize } from "./types";

interface RadioButtonProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  buttonSize?: RadioButtonSize;
  metricKey?: string;
}

export function RadioButton({
  label,
  buttonSize,
  metricKey,
  disabled,
  ...props
}: RadioButtonProps) {
  return (
    <Styled.NewRadioButtonWrapper>
      <Styled.NewRadioButtonInput
        disabled={disabled}
        {...props}
        data-metric-key={metricKey}
      />
      <Styled.NewRadioButtonLabel
        buttonSize={buttonSize}
        disabled={disabled}
        htmlFor={props.id}
      >
        {label}
      </Styled.NewRadioButtonLabel>
    </Styled.NewRadioButtonWrapper>
  );
}
