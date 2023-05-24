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
import { palette } from "@justice-counts/common/components/GlobalStyles";
import { MiniLoader } from "@justice-counts/common/components/MiniLoader";
import React from "react";
// eslint-disable-next-line no-restricted-imports
import styled from "styled-components";

export type BadgeColors = "RED" | "GREEN" | "ORANGE" | "GREY";

export type BadgeColorMapping = { [key: string]: BadgeColors };

export type BadgeProps = {
  color: BadgeColors;
  disabled?: boolean;
  loading?: boolean;
  noMargin?: boolean;
  leftMargin?: number;
};

export const BadgeElement = styled.div<{
  color?: BadgeColors;
  disabled?: boolean;
  noMargin?: boolean;
  leftMargin?: number;
}>`
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${({ color, disabled }) => {
    if (color === "GREY" || disabled) {
      return palette.highlight.grey8;
    }
    if (color === "RED") {
      return palette.solid.red;
    }
    if (color === "GREEN") {
      return palette.solid.green;
    }
    if (color === "ORANGE") {
      return palette.solid.orange;
    }
    return palette.highlight.grey5;
  }};
  color: ${palette.solid.white};
  padding: 4px 8px;
  font-size: 0.65rem;
  font-weight: 600;
  white-space: nowrap;
  text-transform: capitalize;
  ${({ noMargin, leftMargin }) =>
    !noMargin && `margin-left: ${leftMargin || 10}px;`};
`;

export const reportFrequencyBadgeColors: BadgeColorMapping = {
  ANNUAL: "ORANGE",
  MONTHLY: "GREEN",
};

export const Badge: React.FC<React.PropsWithChildren<BadgeProps>> = ({
  color,
  disabled,
  loading,
  noMargin,
  leftMargin,
  children,
}) => {
  return (
    <BadgeElement
      color={color}
      disabled={disabled}
      noMargin={noMargin}
      leftMargin={leftMargin}
    >
      {children}
      {loading && <MiniLoader />}
    </BadgeElement>
  );
};
