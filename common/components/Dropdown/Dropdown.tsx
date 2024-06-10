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

import { Icon, IconSVG } from "@recidiviz/design-system";
import _ from "lodash";
import React, { useEffect, useRef, useState } from "react";

import dropdownCaret from "../../assets/dropdown-caret.svg";
import { palette } from "../GlobalStyles";
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
  lightBoxShadow?: boolean;
  fullWidth?: boolean;
  fullHeight?: boolean;
  highlightIcon?: React.ReactNode;
  typeaheadSearch?: { placeholder: string };
  customClearSearchButton?: string;
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
 * @param [Props.fullHeight] - { boolean } - determines if the menu height will be restricted by a `max-height: 300px` or not (if true, no max height will be set)
 * @param [Props.highlightIcon] - icon used when an element is highlighted
 * @param [Props.typeaheadSearch] - { placeholder: string } - an object with customizable options - renders a typeahead search feature for
 *                                                            the current list when set.
 * */
export function Dropdown({
  label,
  options,
  size,
  disabled,
  hover,
  caretPosition,
  alignment,
  lightBoxShadow,
  fullWidth,
  fullHeight,
  highlightIcon,
  typeaheadSearch,
  customClearSearchButton,
}: DropdownProps) {
  const [filteredOptions, setFilteredOptions] = useState<DropdownOption[]>();
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const updateFilteredOptions = (val: string) => {
    const regex = new RegExp(`${val}`, `i`);
    const normalizedOptions =
      "id" in options[0] && val !== ""
        ? _.uniqBy(
            options.filter((option) => !option.groupTitle),
            "id"
          )
        : options;
    setFilteredOptions(() =>
      normalizedOptions.filter(
        (option) => typeof option.label === "string" && regex.test(option.label)
      )
    );
  };

  useEffect(() => {
    setFilteredOptions(options);
    setInputValue("");
  }, [options]);

  useEffect(() => {
    /** Helps maintain focus on input element as the dropdown list re-renders */
    const timeout = setTimeout(() => {
      inputRef.current?.focus();
      clearTimeout(timeout);
    }, 0);
  }, [inputValue]);

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
        menuFullHeight={fullHeight}
        lightBoxShadow={lightBoxShadow}
      >
        <>
          {typeaheadSearch && (
            <Styled.CustomInputWrapper>
              {customClearSearchButton && (
                <Icon
                  color={palette.highlight.grey8}
                  kind={IconSVG.Search}
                  width={20}
                  rotate={270}
                />
              )}
              <Styled.CustomInput
                ref={inputRef}
                customClearButton={Boolean(customClearSearchButton)}
                id="dropdown-typeahead"
                name="dropdown-typeahead"
                type="search"
                placeholder={typeaheadSearch.placeholder}
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  updateFilteredOptions(e.target.value);
                }}
              />
              {customClearSearchButton && (
                <Styled.CustomClearButton
                  type="button"
                  onClick={() => {
                    setInputValue("");
                    updateFilteredOptions("");
                  }}
                >
                  {customClearSearchButton}
                </Styled.CustomClearButton>
              )}
            </Styled.CustomInputWrapper>
          )}

          {filteredOptions?.map(
            ({
              key,
              label: optionLabel,
              onClick,
              color,
              disabled: optionDisabled,
              highlight,
              noHover,
              icon,
              groupTitle,
            }) => (
              <Styled.CustomDropdownMenuItem
                key={key}
                onClick={onClick}
                color={color}
                disabled={optionDisabled}
                noHover={noHover}
                highlight={highlight && !highlightIcon}
                groupTitle={groupTitle}
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

          {typeaheadSearch && filteredOptions?.length === 0 && (
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
