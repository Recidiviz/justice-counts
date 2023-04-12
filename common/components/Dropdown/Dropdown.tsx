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

import dropdownCaret from "../../assets/dropdown-caret.svg";
import * as Styled from "./Dropdown.styled";
import { DropdownOption, ToggleHover, ToggleSize } from "./types";

type Props = {
  label: string | React.ReactNode;
  options: DropdownOption[];
  size?: ToggleSize;
  disabled?: boolean;
  hover?: ToggleHover;
  caretPosition?: "left" | "right";
  alignment?: "left" | "right";
  overflow?: boolean;
  fullWidth?: boolean;
};

/**
 * Customizable Dropdown Component
 * @param {Object} Props
 * @param Props.label - what is seen inside dropdown toggle
 * @param Props.options - options for a dropdown
 * @param [Props.size] - size of a dropdown (default for medium like in most cases)
 * @param [Props.disabled] - condition for disabling dropdown
 * @param [Props.hover] - defines what hover effect has toggle, label color change or background color change, default is cursor = pointer
 * @param [Props.caretPosition] - left or right (if undefined caret is not displayed)
 * @param [Props.alignment] - alignment of the menu (right or left) if not provided then it is left by default
 * @param [Props.overflow] - defines if the menu will be displayed above toggle
 * @param [Props.fullWidth] - defines if the menu width will be equal to dropdown toggle width (default is fit-content)
 * */
export function Dropdown({
  label,
  options,
  size,
  disabled,
  hover,
  caretPosition,
  alignment,
  overflow,
  fullWidth,
}: Props) {
  return (
    <Styled.CustomDropdown>
      <Styled.CustomDropdownToggle
        kind="borderless"
        disabled={disabled}
        hover={hover}
        size={size}
      >
        {caretPosition === "left" && (
          <Styled.CustomDropdownToggleCaret
            src={dropdownCaret}
            alt=""
            size={size}
          />
        )}
        <Styled.CustomDropdownToggleLabel>
          {label}
        </Styled.CustomDropdownToggleLabel>
        {caretPosition === "right" && (
          <Styled.CustomDropdownToggleCaret
            src={dropdownCaret}
            alt=""
            size={size}
          />
        )}
      </Styled.CustomDropdownToggle>
      {options.length > 1 ? (
        <Styled.CustomDropdownMenu
          alignment={alignment}
          menuOverflow={overflow}
          menuFullWidth={fullWidth}
        >
          {options.map(
            ({
              key,
              label: optionLabel,
              onClick,
              color,
              disabled: optionDisabled,
              highlight,
              noHover,
            }) => (
              <Styled.CustomDropdownMenuItem
                key={key}
                onClick={onClick}
                color={color}
                disabled={optionDisabled}
                highlight={highlight}
                noHover={noHover}
              >
                {optionLabel}
              </Styled.CustomDropdownMenuItem>
            )
          )}
        </Styled.CustomDropdownMenu>
      ) : (
        <></>
      )}
    </Styled.CustomDropdown>
  );
}
