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

import { CheckboxOptionsWrapper } from "@justice-counts/common/components/CheckboxOptions";
import {
  CustomDropdown,
  CustomDropdownMenu,
} from "@justice-counts/common/components/Dropdown";
import { spacing } from "@recidiviz/design-system";
import { rem } from "polished";
import styled from "styled-components/macro";

import { DropdownWrapper } from "../MetricsConfiguration/ChildAgenciesDropdown.styled";

export const CheckboxDropdownWrapper = styled(DropdownWrapper)`
  padding: 0;
  height: 100%;

  & ${CustomDropdown} {
    border-radius: ${rem(spacing.xs)};
    padding: ${rem(3)} ${rem(spacing.md)};
  }
  & ${CustomDropdownMenu} {
    max-height: ${rem(400)};
    border-radius: ${rem(spacing.xs)};
    margin-top: ${rem(spacing.sm)};
  }
  & ${CheckboxOptionsWrapper} {
    margin-bottom: 0;
  }
`;
