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

import dropdownCaret from "../../assets/dropdown-caret.svg";
import * as Styled from "./Dropdown.styled";
import {
  DropdownMenuAlignment,
  DropdownOption,
  ToggleCaretPosition,
  ToggleHover,
  ToggleSize,
} from "./types";

type DropdownProps = {
  label: string | React.ReactNode;
  options: DropdownOption[];
  size?: ToggleSize;
  disabled?: boolean;
  hover?: ToggleHover;
  caretPosition?: ToggleCaretPosition;
  alignment?: DropdownMenuAlignment;
  fullWidth?: boolean;
  highlightIcon?: React.ReactNode;
  withTypeaheadSearch?: boolean;
};

/**
 * Customizable Dropdown Component
 * @param {Object} Props
 * @param Props.label - what is seen inside dropdown toggle
 * @param [Props.options] - options for a dropdown
 * @param [Props.size] - size of a dropdown (default for medium like in most cases)
 * @param [Props.disabled] - condition for disabling dropdown
 * @param [Props.hover] - defines what hover effect has toggle, label color change or background color change, default is cursor = pointer
 * @param [Props.caretPosition] - left or right (if undefined caret is not displayed)
 * @param [Props.alignment] - alignment of the menu (right or left) if not provided then it is left by default
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
  fullWidth,
  highlightIcon,
  withTypeaheadSearch,
}: DropdownProps) {
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [inputValue, setInputValue] = useState("");
  const optionsToRender =
    withTypeaheadSearch && inputValue !== "" ? filteredOptions : options;
  const handleFilteredOptions = (val: string) => {
    const regex = new RegExp(`${val}`, `im`);
    setFilteredOptions(() =>
      options.filter((option) => regex.test(option.label as string))
    );
  };

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
      <Styled.CustomDropdownMenu
        alignment={alignment}
        menuFullWidth={fullWidth}
      >
        <>
          {withTypeaheadSearch && (
            <Styled.CustomInputWrapper>
              <Styled.CustomInput
                id="dropdown-typeahead"
                name="dropdown-typeahead"
                type="text"
                placeholder="Search for Agency"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  handleFilteredOptions(e.target.value);
                }}
              />
            </Styled.CustomInputWrapper>
          )}

          {optionsToRender?.map(
            ({
              key,
              label: optionLabel,
              onClick,
              color,
              disabled: optionDisabled,
              highlight,
              noHover,
              icon,
            }) => (
              <Styled.CustomDropdownMenuItem
                key={key}
                onClick={onClick}
                color={color}
                disabled={optionDisabled}
                noHover={noHover}
                highlight={highlight && !highlightIcon}
              >
                <Styled.OptionLabelWrapper
                  highlightIcon={Boolean(highlightIcon)}
                >
                  {/**
                   * icon: a label icon that's always visible in the dropdown menu
                   * highlightIcon: an icon that indicates (and is only visible on) the menu option that is currently active
                   */}
                  {icon}
                  {optionLabel}
                  {highlight && highlightIcon}
                </Styled.OptionLabelWrapper>
              </Styled.CustomDropdownMenuItem>
            )
          )}

          {withTypeaheadSearch && filteredOptions.length === 0 && (
            <Styled.NoResultsFoundWrapper>
              <Styled.OptionLabelWrapper>
                No Results Found
              </Styled.OptionLabelWrapper>
            </Styled.NoResultsFoundWrapper>
          )}
        </>
      </Styled.CustomDropdownMenu>
    </Styled.CustomDropdown>
  );
}
