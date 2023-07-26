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
// eslint-disable-next-line no-restricted-imports
import styled from "styled-components";

import { centerTextCSS, palette, typography } from "../GlobalStyles";
import { TooltipColor, TooltipWidth } from "./types";

export const TooltipContainer = styled.div<{
  tooltipColor?: TooltipColor;
  tooltipWidth?: TooltipWidth;
  centerText?: boolean;
}>`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-radius: 3px;

  max-width: ${({ tooltipWidth }) => {
    if (tooltipWidth === "narrow") return "170px";
    return "300px";
  }};
  background-color: ${({ tooltipColor }) => {
    if (tooltipColor === "info") return palette.solid.blue;
    return palette.solid.darkgrey;
  }};
  ${centerTextCSS}
`;

export const TooltipTitle = styled.span`
  ${typography.sizeCSS.medium};
`;

export const TooltipContent = styled.span`
  ${typography.sizeCSS.normal};
  white-space: normal;
  text-transform: none;
`;
