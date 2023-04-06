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

import caret from "../../assets/dropdown-caret.svg";
import * as Styled from "./Dropdown.styled";
import { DropdownBorder, DropdownOption, ToggleHover } from "./types";

type Props = {
  toggleLabel: string | React.ReactNode;
  options: DropdownOption[];
  dropdownBorder?: DropdownBorder;
  toggleDisabled?: boolean;
  toggleHover?: ToggleHover;
  toggleNoPadding?: boolean;
  noCaret?: boolean;
  menuAlignment?: "left" | "right";
  menuOverflow?: boolean;
};

export function Dropdown({
  dropdownBorder,
  toggleLabel,
  toggleDisabled,
  toggleHover,
  toggleNoPadding,
  noCaret,
  menuAlignment,
  menuOverflow,
  options,
}: Props) {
  return (
    <Styled.CustomDropdown border={dropdownBorder}>
      <Styled.CustomDropdownToggle
        kind="borderless"
        disabled={toggleDisabled}
        hover={toggleHover}
        noPadding={toggleNoPadding}
      >
        {toggleLabel}
        {!noCaret && <Styled.CustomDropdownToggleCaret src={caret} alt="" />}
      </Styled.CustomDropdownToggle>
      <Styled.CustomDropdownMenu
        alignment={menuAlignment}
        menuOverflow={menuOverflow}
      >
        {options.map(
          ({ id, label, onClick, color, disabled, highlight, hasHover }) => (
            <Styled.CustomDropdownMenuItem
              key={id}
              onClick={onClick}
              color={color}
              disabled={disabled}
              highlight={highlight}
              hasHover={hasHover}
            >
              {label}
            </Styled.CustomDropdownMenuItem>
          )
        )}
      </Styled.CustomDropdownMenu>
    </Styled.CustomDropdown>
  );
}
