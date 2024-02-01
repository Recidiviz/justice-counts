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

import * as Styled from "./CheckboxOptions.styles";

export type CheckboxOption = { key: string; label: string; checked: boolean };

export type CheckboxOnChangeParams = { key: string; checked: boolean };

export type CheckboxOptionsProps = {
  options: CheckboxOption[];
  onChange: (onChangeParams: CheckboxOnChangeParams) => void;
};

export const CheckboxOptions: React.FC<CheckboxOptionsProps> = ({
  options,
  onChange,
}) => {
  return options.map(({ key, label, checked }) => (
    <Styled.CheckboxOptionsWrapper key={key}>
      <Styled.Checkbox
        id={key}
        type="checkbox"
        checked={checked}
        onChange={() => onChange({ key, checked })}
      />
      <Styled.CheckboxLabel>{label}</Styled.CheckboxLabel>
    </Styled.CheckboxOptionsWrapper>
  ));
};
