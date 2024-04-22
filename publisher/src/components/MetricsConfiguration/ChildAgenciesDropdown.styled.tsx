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

import {
  CustomDropdown,
  CustomDropdownMenu,
  CustomInput,
  CustomInputWrapper,
} from "@justice-counts/common/components/Dropdown";
import { palette } from "@justice-counts/common/components/GlobalStyles";
import styled from "styled-components/macro";

export const DropdownWrapper = styled.div`
  padding-bottom: 14px;

  & ${CustomDropdown} {
    width: 100%;
    max-width: 360px;
    border: 1px solid ${palette.highlight.grey2};
    padding: 0 12px;
  }
  & ${CustomDropdownMenu} {
    box-shadow: none;
    border: 1px solid ${palette.highlight.grey2};
  }
  & ${CustomInputWrapper} {
    padding: 12px 16px;
    border-bottom: 1px solid ${palette.highlight.grey2};
  }
  & ${CustomInput} {
    border: 0;
    outline: 0;
    background: transparent;
  }
`;
