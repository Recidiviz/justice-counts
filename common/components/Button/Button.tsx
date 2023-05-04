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

import React from "react";

import * as Styled from "./Button.styled";
import {
  ButtonBorderColor,
  ButtonColor,
  ButtonLabelColor,
  ButtonSize,
} from "./types";

type Props = {
  label: string | React.ReactNode;
  onClick: () => void;
  buttonColor?: ButtonColor;
  labelColor?: ButtonLabelColor;
  borderColor?: ButtonBorderColor;
  size?: ButtonSize;
  enabledDuringOnboarding?: boolean;
  disabled?: boolean;
  noSidePadding?: boolean;
  noHover?: boolean;
  showTooltip?: boolean;
  tooltipMsg?: string;
};

export function Button({
  label,
  onClick,
  buttonColor,
  labelColor,
  borderColor,
  size,
  enabledDuringOnboarding,
  disabled,
  noSidePadding,
  noHover,
  showTooltip,
  tooltipMsg,
}: Props) {
  return (
    <Styled.ButtonWrapper>
      <Styled.Button
        onClick={onClick}
        buttonColor={buttonColor}
        labelColor={labelColor}
        borderColor={borderColor}
        size={size}
        disabled={disabled}
        enabledDuringOnboarding={enabledDuringOnboarding}
        noSidePadding={noSidePadding}
        noHover={noHover}
      >
        {label}
      </Styled.Button>
      {showTooltip && <Styled.ButtonTooltip>{tooltipMsg}</Styled.ButtonTooltip>}
    </Styled.ButtonWrapper>
  );
}
