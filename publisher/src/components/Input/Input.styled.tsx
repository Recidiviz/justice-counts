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

// eslint-disable-next-line no-restricted-imports
import {
  palette,
  typography
} from "@justice-counts/common/components/GlobalStyles";
import styled from "styled-components/macro";

import {
  ErrorLabelProps,
  InputLabelProps,
  InputProps,
  InputTextSize,
} from "./types";

/** TODO(#1169/#1170) Replace existing input styles with new styles */

export const InputWrapper = styled.div<{ noBottomMargin?: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  margin-bottom: ${({ noBottomMargin }) => (noBottomMargin ? "0" : "32px")};
`;

export const Input = styled.input<InputProps>`
  ${({ textSize }) =>
    textSize === "small"
      ? typography.sizeCSS.normal
      : typography.sizeCSS.large};
  line-height: 30px;
  min-width: 266px;
  resize: none;
  height: ${({ multiline, textSize }) => {
    if (multiline) return "200px";
    if (textSize === "small") return "auto";
    return "71px";
  }};
  padding: ${({ persistLabel, textSize }) => {
    if (persistLabel) return "42px 55px 16px 16px";
    if (textSize === "small") return "10px 55px 10px 16px";
    return "16px 55px 10px 16px";
  }};
  background: ${({ value, error, notReporting }) => {
    if (error) {
      return palette.highlight.red;
    }
    if (notReporting) {
      return palette.highlight.grey1;
    }
    return value || value === 0
      ? palette.highlight.lightblue1
      : palette.highlight.grey1;
  }};
  ${({ notReporting }) => notReporting && `color: ${palette.highlight.grey6}`};

  caret-color: ${({ error }) => {
    if (error) {
      return palette.solid.red;
    }
    return palette.solid.blue;
  }};

  border: none;
  border-bottom: 1px solid
    ${({ value, error, disabled }) => {
      if (error) {
        return palette.solid.red;
      }
      if (disabled) {
        return palette.highlight.grey8;
      }
      return value || value === 0
        ? palette.solid.blue
        : palette.highlight.grey9;
    }};

  &:hover {
    border-bottom: ${({ disabled }) =>
      disabled ? undefined : `1px solid ${palette.solid.blue}`};
  }

  &:focus ~ label {
    ${typography.sizeCSS.small}
    ${({ persistLabel }) => !persistLabel && "display: none"};
    top: 12px;
    color: ${({ error }) => {
      if (error) {
        return palette.solid.red;
      }
      return palette.solid.blue;
    }};
  }

  &:hover ~ label {
    color: ${({ error, disabled }) =>
      !error && !disabled && palette.solid.blue};
  }

  &::placeholder {
    opacity: ${({ isPlaceholderVisible }) =>
      isPlaceholderVisible ? "1" : "0"};
    transition: 0.2s;
  }

  &:focus::placeholder {
    opacity: 1;
    transition: 0.2s;
    color: ${palette.highlight.grey6};
  }
`;

export const InputLabel = styled.label<InputLabelProps>`
  ${({ inputHasValue }) =>
    inputHasValue
      ? typography.sizeCSS.small
      : typography.sizeCSS
          .large} /* If persistLabel is false, the label is visible only when the input has no value
   * If persistLabel is true, when the input has value, show the label above the value
   */ 
   ${({ persistLabel, inputHasValue }) =>
    !persistLabel && inputHasValue && "display: none;"}

  min-height: 50px;
  position: absolute;
  top: ${({ inputHasValue }) => (inputHasValue ? "12px" : "26px")};
  left: 16px;
  z-index: -1;
  transition: 0.2s ease;

  color: ${({ error, isDisabled, inputHasValue, notReporting }) => {
    if (error) {
      return palette.solid.red;
    }
    if (isDisabled || notReporting) {
      return palette.highlight.grey6;
    }
    return inputHasValue ? palette.solid.blue : palette.highlight.grey8;
  }};
`;

export const ErrorLabel = styled.span<ErrorLabelProps>`
  ${typography.sizeCSS.small}
  ${({ error }) => error && `color: ${palette.solid.red};`};
  ${({ isDisabled }) => isDisabled && `color: ${palette.highlight.grey8};`}
  margin-top: 8px;
  position: absolute;
  top: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
`;

export const LabelChipPosition = styled.span<{ textSize?: InputTextSize }>`
  position: absolute;
  top: ${({ textSize }) => (textSize === "small" ? "18px" : "24px")};
  right: 16px;

  & > img {
    width: ${({ textSize }) => (textSize === "small" ? "16px" : "24px")};
    height: ${({ textSize }) => (textSize === "small" ? "16px" : "24px")};
  }
`;

export const InputTooltip = styled.div`
  position: absolute;
  top: 72px;
  border-radius: 4px;
  padding: 16px;
  background-color: ${palette.solid.darkgrey};
  color: ${palette.solid.white};
`;

export const ErrorIconContainer = styled.span`
  transform: translate(1px, -1px);
  flex-grow: 1;
  z-index: 1;
`;

export const ErrorInfo = styled.div`
  position: absolute;
  background-color: ${palette.solid.red};
  color: ${palette.solid.white};
  border-radius: 4px;
  z-index: 1;
  padding: 16px;
  max-width: 300px;
  bottom: 24px;
`;

export const TooltipLink = styled.span`
  text-decoration: underline;

  &:hover {
    cursor: pointer;
  }
`;

export const NewInputWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap:8px;
  color: black;
`;

export const NewInput = styled.input<{
  error: boolean;
  multiline: boolean;
  disabled: boolean;
  fullWidth?: boolean;
}>`
  ${typography.body}
  height: ${({ multiline }) => (multiline ? `200px` : `32px`)};
  border: 1px solid
    ${({ error }) => (error ? palette.solid.red : palette.highlight.grey5)};
  border-radius: 2px;
  text-align: left;
  background-color: ${({ disabled }) =>
    disabled ? palette.solid.lightgrey2 : `transparent`};

  &:focus {
    outline: transparent;
    border: 1px solid
      ${({ error }) => (error ? palette.solid.red : palette.solid.blue)};
    color: ${palette.solid.darkgrey};
  }

  &::placeholder {
    color: ${palette.highlight.grey8};
  }
`;

export const NewInputLabel = styled.label<{ error: boolean }>`
  ${typography.body}
  ${({ error }) =>
    error &&
    `
    &:after {
      content: "*";
      display: inline;
      color: ${palette.solid.red};
    }
  `};
`;

export const ErrorMessage = styled.div`
  ${typography.body}
  color: ${palette.solid.red};
  margin-top: -4px;
`;
