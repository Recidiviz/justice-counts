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

export type InputProps = {
  error?: string;
  placeholder?: string;
  isPlaceholderVisible?: boolean;
  multiline?: boolean;
  persistLabel?: boolean;
  notReporting?: boolean;
  textSize?: InputTextSize;
};

export type InputLabelProps = {
  inputHasValue?: boolean;
  isDisabled?: boolean;
  error?: string;
  persistLabel?: boolean;
  notReporting?: boolean;
};

export type ErrorLabelProps = {
  isDisabled?: boolean;
  error?: string;
  multiline?: boolean;
  textSize?: InputTextSize;
};

export type NotReportedIconWithTooltipProps = {
  size?: number;
  lighter?: boolean;
  tooltipText?: string;
  tooltipLinkLabel?: string;
  tooltipLink?: () => void;
};

export type InputTextSize = "small";
