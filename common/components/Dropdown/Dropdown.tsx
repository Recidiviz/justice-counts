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
  toggleLabel: string | React.ReactNode;
  options: DropdownOption[];
  size?: ToggleSize;
  toggleDisabled?: boolean;
  toggleHover?: ToggleHover;
  caret?: "left" | "right";
  menuAlignment?: "left" | "right";
  menuOverflow?: boolean;
  menuFullWidth?: boolean;
};

export function Dropdown({
  toggleLabel,
  options,
  size,
  toggleDisabled,
  toggleHover,
  caret,
  menuAlignment,
  menuOverflow,
  menuFullWidth,
}: Props) {
  return (
    <Styled.CustomDropdown>
      <Styled.CustomDropdownToggle
        kind="borderless"
        disabled={toggleDisabled}
        hover={toggleHover}
        size={size}
      >
        {caret === "left" && (
          <Styled.CustomDropdownToggleCaret
            src={dropdownCaret}
            alt=""
            size={size}
          />
        )}
        <Styled.CustomDropdownToggleLabel>
          {toggleLabel}
        </Styled.CustomDropdownToggleLabel>
        {caret === "right" && (
          <Styled.CustomDropdownToggleCaret
            src={dropdownCaret}
            alt=""
            size={size}
          />
        )}
      </Styled.CustomDropdownToggle>
      {options.length > 1 ? (
        <Styled.CustomDropdownMenu
          alignment={menuAlignment}
          menuOverflow={menuOverflow}
          menuFullWidth={menuFullWidth}
        >
          {options.map(
            ({ key, label, onClick, color, disabled, highlight, noHover }) => (
              <Styled.CustomDropdownMenuItem
                key={key}
                onClick={onClick}
                color={color}
                disabled={disabled}
                highlight={highlight}
                noHover={noHover}
              >
                {label}
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
