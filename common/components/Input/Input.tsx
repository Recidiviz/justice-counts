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

import React, { InputHTMLAttributes, useState } from "react";

import statusCheckIcon from "../../assets/status-check-icon.png";
import statusErrorIcon from "../../assets/status-error-icon.png";
import { FormError } from "../../types";
import { ErrorWithTooltip } from "./ErrorWithTooltip";
import * as Styled from "./Input.styled";
import { NotReportedIcon } from "./NotReportedIcon";
import { InputTextSize } from "./types";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  noBottomMargin?: boolean;
  error?: FormError;
  valueLabel?: string;
  multiline?: boolean;
  persistLabel?: boolean;
  metricKey?: string;
  notReporting?: boolean;
  notReportingTooltipLink?: () => void;
  isPlaceholderVisible?: boolean;
  textSize?: InputTextSize;
}

export function Input({
  label,
  noBottomMargin,
  error,
  valueLabel,
  multiline,
  placeholder,
  persistLabel,
  metricKey,
  notReporting,
  notReportingTooltipLink,
  isPlaceholderVisible,
  textSize,
  ...props
}: InputProps) {
  const [showTooltip, setShowTooltip] = useState<boolean>();
  const { name, value, disabled } = props;

  const showTooltipIfTruncated = (
    e: React.MouseEvent<HTMLInputElement, MouseEvent>
  ) => {
    const labelElement = e.currentTarget.querySelector("label") as HTMLElement;
    if (labelElement.offsetWidth < labelElement.scrollWidth) {
      setShowTooltip(true);
    }
  };
  const clearTooltip = () => setShowTooltip(false);

  return (
    <Styled.InputWrapper
      onMouseEnter={showTooltipIfTruncated}
      onMouseLeave={clearTooltip}
      onFocus={clearTooltip}
      noBottomMargin={noBottomMargin}
    >
      {/* Text Input */}
      <Styled.Input
        {...props}
        data-metric-key={metricKey}
        disabled={disabled}
        as={multiline ? "textarea" : "input"}
        multiline={multiline}
        error={error?.message}
        id={`input-${name}`}
        placeholder={placeholder}
        isPlaceholderVisible={isPlaceholderVisible}
        persistLabel={persistLabel}
        notReporting={notReporting}
        textSize={textSize}
      />

      {/* Text Input Label (appears inside of text input) */}
      <Styled.InputLabel
        htmlFor={`input-${name}`}
        inputHasValue={Boolean(value)}
        isDisabled={disabled}
        persistLabel={persistLabel}
        error={error?.message}
        notReporting={notReporting}
      >
        {label}
      </Styled.InputLabel>

      {showTooltip && <Styled.InputTooltip>{name}</Styled.InputTooltip>}

      {/* Error Description (appears below text input) */}
      {error && (
        <ErrorWithTooltip
          error={error}
          disabled={disabled}
          multiline={multiline}
          textSize={textSize}
        />
      )}

      {/* Label Chip (appears inside of text input on the right) */}

      {/* Chip: Required */}
      {/* Disable the Required Chip for now. Refer to https://github.com/Recidiviz/recidiviz-data/pull/13849 for more information */}
      {/* {required && !error && !value && (
        <LabelChipPosition>
          <RequiredChip />
        </LabelChipPosition>
      )} */}
      {/* Chip: Not Reporting Status */}
      {notReporting && (
        <Styled.LabelChipPosition textSize={textSize}>
          <NotReportedIcon
            lighter
            size={textSize === "small" ? 16 : undefined}
            notReportingTooltipLink={notReportingTooltipLink}
          />
        </Styled.LabelChipPosition>
      )}

      {/* Chip: Error Status */}
      {error && !notReporting && (
        <Styled.LabelChipPosition textSize={textSize}>
          <img src={statusErrorIcon} alt="" />
        </Styled.LabelChipPosition>
      )}

      {/* Chip: Validated Successfully Status */}
      {!error && !notReporting && value && (
        <Styled.LabelChipPosition textSize={textSize}>
          <img src={statusCheckIcon} alt="" />
        </Styled.LabelChipPosition>
      )}
    </Styled.InputWrapper>
  );
}
