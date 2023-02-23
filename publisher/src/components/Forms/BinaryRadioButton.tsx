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

import {
  MIN_DESKTOP_WIDTH,
  palette,
  typography,
} from "@justice-counts/common/components/GlobalStyles";
import React, { InputHTMLAttributes } from "react";
import styled, { css } from "styled-components/macro";

export const BinaryRadioGroupContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

export const BinaryRadioGroupWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  div {
    flex: 1;
  }
`;

export const BinaryRadioGroupQuestion = styled.div`
  ${typography.sizeCSS.medium}
  display: flex;
  align-items: center;
  color: ${palette.solid.darkgrey};
`;

export const RadioButtonWrapper = styled.div<{ lastOptionBlue?: boolean }>`
  display: flex;
  flex: 1 1 0;
  margin: 15px 0 0 0;

  &:not(:last-child) {
    margin: 15px 10px 0 0;
  }

  ${({ lastOptionBlue }) =>
    lastOptionBlue &&
    css`
      margin: 0;

      &:first-child {
        margin: 0px 10px 0 0;
      }

      &:first-child input:checked + label {
        background-color: ${palette.highlight.grey9};
        border-color: unset;
        color: ${palette.solid.white};
      }
    `}

  @media only screen and (max-width: ${MIN_DESKTOP_WIDTH}px) {
    width: 100%;

    &:not(:last-child) {
      margin: ${({ lastOptionBlue }) => !lastOptionBlue && "15px 0 0 0"};
    }
  }
`;

export const RadioButtonElement = styled.input<{
  disabled?: boolean;
}>`
  width: 0;
  position: fixed;
  opacity: 0;

  &:focus + label {
    border: ${({ disabled }) =>
      disabled ? "none" : `1px solid ${palette.highlight.grey9}`};
  }

  &:checked + label {
    background-color: ${palette.solid.blue};
    border-color: ${palette.solid.blue};
    color: ${palette.solid.white};
  }

  &:checked + label:hover {
    background-color: ${({ disabled }) =>
      disabled ? "none" : palette.solid.darkblue};
  }

  &:hover {
    cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  }
`;

export const RadioButtonLabel = styled.label<{
  disabled?: boolean;
  buttonSize?: string;
}>`
  ${typography.sizeCSS.medium}
  width: 100%;
  height: 56px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px 24px;
  border: 1px solid ${palette.highlight.grey4};
  border-radius: 2px;
  transition: 0.2s ease;

  &:hover {
    cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
    background-color: ${({ disabled }) =>
      disabled ? "none" : palette.highlight.grey2};
  }

  ${({ buttonSize }) =>
    buttonSize === "small" &&
    css`
      ${typography.sizeCSS.normal}
      width: unset;
      height: unset;
      min-width: 60px;
      padding: 9px 16px;
    `}
`;

export const BinaryRadioGroupClearButton = styled.div<{
  disabled?: boolean;
}>`
  ${typography.sizeCSS.small}
  margin-top: 8px;
  color: ${palette.solid.blue};
  text-decoration: underline;

  &:hover {
    cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  }
`;

interface RadioButtonProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  context?: string;
  metricKey?: string;
  buttonSize?: string;
  lastOptionBlue?: boolean;
}

/** Single radio button in the style of a regular button */
export const BinaryRadioButton: React.FC<RadioButtonProps> = ({
  label,
  context,
  metricKey,
  disabled,
  buttonSize,
  lastOptionBlue,
  ...props
}): JSX.Element => {
  return (
    <RadioButtonWrapper lastOptionBlue={lastOptionBlue}>
      <RadioButtonElement
        disabled={disabled}
        {...props}
        data-metric-key={metricKey}
      />
      <RadioButtonLabel
        disabled={disabled}
        buttonSize={buttonSize}
        htmlFor={props.id}
      >
        {label}
      </RadioButtonLabel>
    </RadioButtonWrapper>
  );
};
