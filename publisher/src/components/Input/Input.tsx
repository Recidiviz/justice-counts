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

import notReportedIcon from "@justice-counts/common/assets/not-reported-icon.png";
import { Tooltip } from "@justice-counts/common/components/Tooltip";
import { FormError } from "@justice-counts/common/types";
import { replaceSymbolsWithDash } from "@justice-counts/common/utils";
import React, { InputHTMLAttributes, useState } from "react";

import { ErrorWithTooltip } from "./ErrorWithTooltip";
import * as Styled from "./Input.styled";
import { InputTextSize, NotReportedIconTooltipProps } from "./types";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  noBottomMargin?: boolean;
  error?: FormError;
  valueLabel?: string;
  multiline?: boolean;
  persistLabel?: boolean;
  metricKey?: string;
  notReported?: boolean;
  notReportedIconTooltip?: NotReportedIconTooltipProps;
  isPlaceholderVisible?: boolean;
  textSize?: InputTextSize;
  hideLabel?: boolean;
  fullWidth?: boolean;
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
  notReported,
  notReportedIconTooltip,
  isPlaceholderVisible,
  textSize,
  ...props
}: InputProps) {
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [showNotReportedTooltip, setShowNotReportedTooltip] =
    useState<boolean>(false);
  const { name, value, disabled } = props;

  const tooltipId = replaceSymbolsWithDash(`input-${metricKey}-${name}`);
  const notReportedIconTooltipContent = notReportedIconTooltip ? (
    <>
      {notReportedIconTooltip.tooltipText}{" "}
      <Styled.TooltipLink onClick={notReportedIconTooltip.tooltipLink}>
        {notReportedIconTooltip.tooltipLinkLabel}
      </Styled.TooltipLink>
      .
    </>
  ) : (
    ""
  );

  const showTooltipIfTruncated = (
    e: React.MouseEvent<HTMLInputElement, MouseEvent>
  ) => {
    if (notReportedIconTooltip) {
      setShowNotReportedTooltip(true);
    }
    const labelElement = e.currentTarget.querySelector("label") as HTMLElement;
    if (labelElement.offsetWidth < labelElement.scrollWidth) {
      setShowTooltip(true);
    }
  };
  const clearTooltip = () => {
    setShowTooltip(false);
    setShowNotReportedTooltip(false);
  };

  return (
    <Styled.InputWrapper
      onMouseEnter={showTooltipIfTruncated}
      onMouseLeave={clearTooltip}
      onFocus={clearTooltip}
      noBottomMargin={noBottomMargin}
      id={tooltipId}
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
        notReporting={notReported}
        textSize={textSize}
      />

      {/* Text Input Label (appears inside of text input) */}
      <Styled.InputLabel
        htmlFor={`input-${name}`}
        inputHasValue={Boolean(value)}
        isDisabled={disabled}
        persistLabel={persistLabel}
        error={error?.message}
        notReporting={notReported}
      >
        {label}
      </Styled.InputLabel>

      <Tooltip
        anchorId={tooltipId}
        position="top"
        content={name}
        noArrow
        isOpen={showTooltip}
        offset={0}
      />

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

      {/* Chip: Not Reporting Status */}

      {notReported && (
        <Styled.LabelChipPosition textSize={textSize}>
          <img id={`img-${tooltipId}`} src={notReportedIcon} alt="" />
          {notReportedIconTooltip && (
            <Tooltip
              anchorId={`img-${tooltipId}`}
              position="bottom"
              content={notReportedIconTooltipContent}
              tooltipWidth="narrow"
              clickable
              isOpen={showNotReportedTooltip}
            />
          )}
        </Styled.LabelChipPosition>
      )}
    </Styled.InputWrapper>
  );
}

/** TODO(#1170) Replace existing Input component with new Input component */

export function NewInput({
  label,
  name,
  value,
  disabled,
  error,
  type,
  multiline,
  metricKey,
  hideLabel,
  fullWidth,
  ...props
}: InputProps) {
  return (
    <Styled.NewInputWrapper>
      <Styled.NewInput
        {...props}
        id={`input-${name}`}
        data-metric-key={metricKey}
        name={name}
        type={type}
        value={value}
        as={multiline ? "textarea" : "input"}
        multiline={Boolean(multiline)}
        disabled={Boolean(disabled)}
        error={Boolean(error)}
        fullWidth={fullWidth}
      />
      {!hideLabel && (
        <Styled.NewInputLabel htmlFor={`input-${name}`} error={Boolean(error)}>
          {label}
        </Styled.NewInputLabel>
      )}
      {error && <Styled.ErrorMessage>{error.message}</Styled.ErrorMessage>}
    </Styled.NewInputWrapper>
  );
}