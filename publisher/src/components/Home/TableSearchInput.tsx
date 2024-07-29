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

import { palette } from "@justice-counts/common/components/GlobalStyles";
import { Icon, IconSVG } from "@recidiviz/design-system";
import React, { useEffect, useState } from "react";

import * as Styled from "./TableSearchInput.styled";

type TableSearchInputProps = {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
};

const TableSearchInput = ({
  value: initialValue,
  onChange,
  debounce = 300,
}: TableSearchInputProps) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [debounce, onChange, value]);

  return (
    <Styled.InputWrapper>
      <Icon
        color={palette.highlight.grey8}
        kind={IconSVG.Search}
        width={15}
        rotate={270}
      />
      <Styled.Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search..."
      />
      {value && (
        <Styled.ClearButton
          type="button"
          onClick={() => {
            setValue("");
          }}
        >
          Clear
        </Styled.ClearButton>
      )}
    </Styled.InputWrapper>
  );
};

export default TableSearchInput;
