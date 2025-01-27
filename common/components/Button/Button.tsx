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

import React from "react";

import { Tooltip } from "../Tooltip";
import * as Styled from "./Button.styled";
import {
  ButtonBorderColor,
  ButtonColor,
  ButtonLabelColor,
  ButtonSize,
} from "./types";

export type ButtonProps = {
  label: string | React.ReactNode;
  onClick: () => void;
  id?: string;
  buttonColor?: ButtonColor;
  labelColor?: ButtonLabelColor;
  borderColor?: ButtonBorderColor;
  size?: ButtonSize;
  disabled?: boolean;
  noSidePadding?: boolean;
  noTopBottomPadding?: boolean;
  noHover?: boolean;
  tooltipMsg?: string;
  agencySettingsConfigs?: boolean;
  style?: React.CSSProperties;
};

export function Button({
  label,
  onClick,
  id,
  buttonColor,
  labelColor,
  borderColor,
  size,
  disabled,
  noSidePadding,
  noTopBottomPadding,
  noHover,
  tooltipMsg,
  agencySettingsConfigs,
  style,
}: ButtonProps) {
  return (
    <Styled.ButtonWrapper id={id}>
      <Styled.Button
        onClick={onClick}
        buttonColor={buttonColor}
        labelColor={labelColor}
        borderColor={borderColor}
        size={size}
        disabled={disabled}
        noSidePadding={noSidePadding}
        noTopBottomPadding={noTopBottomPadding}
        noHover={noHover}
        agencySettingsConfigs={agencySettingsConfigs}
        style={style}
      >
        {label}
      </Styled.Button>
      {tooltipMsg && id && (
        <Tooltip anchorId={id} position="bottom" content={tooltipMsg} noArrow />
      )}
    </Styled.ButtonWrapper>
  );
}
